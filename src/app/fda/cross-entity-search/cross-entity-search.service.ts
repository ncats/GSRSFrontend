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
import { ValidationResults } from '@gsrs-core/substance-form/substance-form.model';
import { Facet, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { StructuralUnit } from '@gsrs-core/substance';
import { HierarchyNode } from '@gsrs-core/substances-browse/substance-hierarchy/hierarchy.model';
import { SubstanceDependenciesImageNode } from '@gsrs-core/substance-details/substance-dependencies-image/substance-dependencies-image.model';

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
    private utilsService: UtilsService,
  ) {
    super(configService);
  }

  getBulkSearchUrl(searchEntity: string, useServiceInUrl: boolean = false): string {

    let url = this.apiBaseUrl;

    if (searchEntity !== 'substances') {
      if (useServiceInUrl == true) {
        let apiAddUrlPrefixToBackendUrls = '/ginas/app';
        if (url.indexOf(apiAddUrlPrefixToBackendUrls) > 0) {
          apiAddUrlPrefixToBackendUrls = '';
        }
        url = url.replace('/api/v1/', apiAddUrlPrefixToBackendUrls + '/service/' + searchEntity + '/api/v1/');
      }
    }
    return url;
  }

  // Using this for Cross Entity Search
  getBulkSearchWithFacets(
    searchEntity?: string,
    bulkQID?: number,
    url = null,
    searchOnIdentifiers?: boolean,
    facets?: FacetParam,
    view?: string,
    useServiceInUrl: boolean = false,
    querySearchTerm?: string,
    pageSize: number = 10,
    skip: number = 0,
    order?: string
  ): Observable<PagingResponse<any>> {
    return new Observable(observer => {

      url = this.getBulkSearchUrl(searchEntity, useServiceInUrl);
      if (url) {
        url += searchEntity + `/bulkSearch`;
      }

      let params = new FacetHttpParams({ encoder: new CustomEncoder() });

      // Append Facets if exists
      params = params.appendFacetParams(facets, this.showDeprecated);

      // call entity/bulkSearch
      params = params.append('bulkQID', bulkQID.toString());
      let v = "false";
      if (searchOnIdentifiers === true) {
 v = "true"; 
}
      params = params.append('searchOnIdentifiers', v);
      params = params.append('searchEntity', searchEntity);


      const options = {
        params: params
      };

      // RETURN RESULTS for either API call bulkSearch or status(<key>)/results
      this.http.get<any>(url, options).subscribe(
        response => {
          // call async until finished is not equal to true
          if (response.results) {
            const resultKey = response.key;
            const resultUrl = response.results;
            const resultFinished = response.finished;

            if (resultFinished == false) {
            } // if search not finished

            else if (resultFinished) {
            }

            observer.next(response);
            observer.complete();

          }
        }, error => {
          observer.error(error);
          observer.complete();
        }
      );  // subscribe 
    });
  }

  public getBulkSearchStatusResults(
    searchEntity?: string,
    key?: number,
    fdim: number = 10,
    view?: string,
    viewfield?: string,
    facetlabel?: string,
    useServiceInUrl: boolean = false,
    simpleSearchOnly?: string,
    facets?: FacetParam,
    pageSize: number = 10,
    skip: number = 0,
    qTop: number = 100
  ): any {

    let url = this.getBulkSearchUrl(searchEntity, useServiceInUrl);

    if (url) {
      url = `${url}status(${key})/results`;
    }

    let params = new FacetHttpParams({ encoder: new CustomEncoder() });

    params = params.appendDictionary({
      top: pageSize.toString(),
      skip: skip.toString(),
      fdim: fdim.toString(),
      qTop: qTop.toString()
    });

    //params = params.appendFacetParams({ facet: { isAllMatch: false, params: { cache: false } } }, this.showDeprecated);

    // Append Facets if exists
    params = params.appendFacetParams(facets, this.showDeprecated);

    if (simpleSearchOnly) {
      params = params.append('simpleSearchOnly', simpleSearchOnly.toString()); // setting simpleSearchOnly=true, faster result, no facets
    }

    if (view && view !== '') {
      params = params.append('view', view); // setting view=key or full, faster result
    }

    if (viewfield && viewfield !== '') {
      params = params.append('viewfield', viewfield); // setting viewfield=id or facet, faster result
    }

    if (facetlabel && facetlabel !== '') {
      params = params.append('facetlabel', facetlabel); // setting facetlabel=FDA UNII, faster result, no content
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<any>>(url, options);
  }

  cancelBulkSearch(searchEntity: string, key: string, useServiceInUrl: boolean = false) {
    let params = new HttpParams();
    let url = this.getBulkSearchUrl(searchEntity, useServiceInUrl);

    if (url) {
      url = url + "substances/bulkSearchTask/cancel?key=" + key;
    }

    const options = {
      params: params
    };

    return this.http.delete<any>(url, options);
  }

}

