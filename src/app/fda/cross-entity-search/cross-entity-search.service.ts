import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpClientJsonpModule, HttpParameterCodec } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, Observer, Subject } from 'rxjs';
import { ConfigService } from '@gsrs-core/config/config.service';
import { BaseHttpService } from '@gsrs-core/base/base-http.service';
import {
  SubstanceSummary,
  SubstanceDetail,
  SubstanceEdit,
  SubstanceName,
  SubstanceCode,
  SubstanceRelationship,
  SubstanceRelated,
  SubstanceReference
} from '@gsrs-core/substance';
import { PagingResponse, ShortResult } from '@gsrs-core/utils/paging-response.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FacetParam } from '@gsrs-core/facets-manager/facet.model';
import { FacetHttpParams } from '@gsrs-core/facets-manager/facet-http-params';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { switchMap, map, catchError, takeWhile } from 'rxjs/operators';
import { ValidationResults} from '@gsrs-core/substance-form/substance-form.model';
import {Facet, FacetQueryResponse} from '@gsrs-core/facets-manager';
import { StructuralUnit } from '@gsrs-core/substance';
import {HierarchyNode} from '@gsrs-core/substances-browse/substance-hierarchy/hierarchy.model';
import { SubstanceDependenciesImageNode } from '@gsrs-core/substance-details/substance-dependencies-image/substance-dependencies-image.model';

import { stringify } from 'querystring';
class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CrossEntitySearchService extends BaseHttpService {

  private searchKeys: { [structureSearchTerm: string]: string } = {};
  public showDeprecated = false;
  private resultEmitter = new Subject<any>();
  showImagePopup = new Subject<boolean>();
  imagePopupUnit = new Subject<StructuralUnit>();
  private searchResult: any;
  private pauseSubject = new BehaviorSubject<boolean>(false);
  tempObject: any;

  constructor(  
    public http: HttpClient,
    public configService: ConfigService,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
  ) {
    super(configService);
  }

  searchSubstanceBulk(
    //    bulkSearchTerm?: string,
    querySearchTerm?: string,
    bulkQID?: number,
    searchOnIdentifiers?: boolean,
    searchEntity?: string,
    cutoff?: number,
    type: string = 'bulk',
    pageSize: number = 10,
    facets?: FacetParam,
    order?: string,
    skip: number = 0,
  ): Observable<PagingResponse<SubstanceSummary>> {
    return new Observable(observer => {
      let params = new FacetHttpParams({ encoder: new CustomEncoder() });
      let url = this.apiBaseUrl;
      let bulkFacetsKey: number;
      bulkFacetsKey = this.utilsService.hashCode(bulkQID, searchOnIdentifiers, searchEntity);
      if (this.searchKeys[bulkFacetsKey]) {
        url += `status(${this.searchKeys[bulkFacetsKey]})/results`;
        params = params.appendFacetParams(facets, this.showDeprecated);
        if (querySearchTerm.length > 0) {
          params = params.appendDictionary({
            top: pageSize.toString(),
            skip: skip.toString(),
            q: querySearchTerm.toString()
          });
        } else {
          params = params.appendDictionary({
            top: pageSize.toString(),
            skip: skip.toString()
          });
        }
        if (order != null && order !== '') {
          params = params.append('order', order);
        }
      } else {
        params = params.append('bulkQID', bulkQID.toString());
        let v = "false";
        if (searchOnIdentifiers === true) { v = "true"; }
        params = params.append('searchOnIdentifiers', v);
        params = params.append('searchEntity', searchEntity);
        url += `substances/bulkSearch`;
      }

      const options = {
        params: params
      };

      this.http.get<any>(url, options).subscribe(
        response => {
          // call async
          if (response.results) {
            const resultKey = response.key;
            this.searchKeys[bulkFacetsKey] = resultKey;
            this.processAsyncSearchResults(
              querySearchTerm,
              url,
              response,
              observer,
              resultKey,
              options,
              pageSize,
              facets,
              skip
            );
          } else {
            // consider making API backend provide statusKey in JSON
            if (this.searchKeys && this.searchKeys[bulkFacetsKey]) {
              response.statusKey = this.searchKeys[bulkFacetsKey];
            }
            observer.next(response);
            observer.complete();
          }
        }, error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  private processAsyncSearchResults(
    querySearchTerm: string,
    url: string,
    asyncCallResponse: any,
    observer: Observer<PagingResponse<SubstanceDetail>>,
    searchKey: string,
    httpCallOptions: any,
    pageSize?: number,
    facets?: FacetParam,
    skip?: number,
    view?: string
  ): void {
    this.tempObject = {
      querySearchTerm: querySearchTerm,
      url: url,
      asyncCallResponse: asyncCallResponse,
      observer: observer,
      searchKey: searchKey,
      httpCallOptions: httpCallOptions,
      pageSize: pageSize ? pageSize : 0,
      facets: facets ? facets : null,
      skip: skip ? skip : 0,
      view: view ? view : null
    }
    this.getAsyncSearchResults(querySearchTerm, searchKey, pageSize, facets, skip, view)
      .pipe(
        switchMap(response => {
          let temp: any = response;
          temp.statusKey = searchKey;
          temp.finished = asyncCallResponse.finished;
          observer.next(temp);

          if (asyncCallResponse.finished) {
            observer.complete();
            return [];
          }

          return this.http.get<any>(url, httpCallOptions).pipe(
            takeWhile(() => !this.pauseSubject.getValue()) // Pause search in browse
          );
        })
      )
      .subscribe(
        searchResponse => {
          setTimeout(() => {
            this.processAsyncSearchResults(
              querySearchTerm,
              url,
              searchResponse,
              observer,
              searchKey,
              httpCallOptions,
              pageSize,
              facets,
              skip,
              view
            );
          });
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
  }

  private getAsyncSearchResults(
    querySearchTerm: string,
    // this is a status
    structureSearchKey: string,
    pageSize?: number,
    facets?: FacetParam,
    skip?: number,
    view?: string
  ): any {
    const url = `${this.apiBaseUrl}status(${structureSearchKey})/results`;
    let params = new FacetHttpParams({encoder: new CustomEncoder()});

    params = params.appendFacetParams(facets, this.showDeprecated);

    // remove this when async backend issue is fixed
    const random_key = Math.random().toString(36).replace('0.', '');
    params = params.appendFacetParams({ facet: { isAllMatch: false, params: { cache: false } } }, this.showDeprecated);

    params = params.appendDictionary({
      top: pageSize.toString(),
      skip: skip.toString(),
      view: view || ''
    });

    // Added for 3.0.2, Advanced Search:Combine structure Search with query search.
    if (querySearchTerm != null && querySearchTerm !== '') {
      params = params.append('q', querySearchTerm);
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceSummary>>(url, options);
  }

  clearSearchKey() {
    Object.keys(this.searchKeys).forEach(key => {
      this.searchKeys[key] = undefined;
    });
  }

}
