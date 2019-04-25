import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Observer, ArgumentOutOfRangeError } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { BaseHttpService } from '../base/base-http.service';
import { SubstanceSummary, SubstanceDetail } from './substance.model';
import { PagingResponse } from '../utils/paging-response.model';
import { StructurePostResponse } from '../utils/structure-post-response.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SubstanceFacetParam } from './substance-facet-param.model';
import { SubstanceHttpParams } from './substance-http-params';
import { UtilsService } from '../utils/utils.service';

@Injectable({
  providedIn: 'root'
})
export class SubstanceService extends BaseHttpService {
  private searchKeys: { [structureSearchTerm: string]: string } = {};

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService
  ) {
    super(configService);
  }

  getSubstancesDetails(args: {
    searchTerm?: string,
    structureSearchTerm?: string,
    sequenceSearchTerm?: string,
    cutoff?: number,
    type?: string,
    seqType?: string,
    pageSize?: number,
    order?: string,
    facets?: SubstanceFacetParam,
    skip?: number
  } = {}): Observable<PagingResponse<SubstanceDetail>> {
    return new Observable(observer => {

      if (args.structureSearchTerm != null && args.structureSearchTerm !== '') {
        this.searchSubstanceStructures(
          args.structureSearchTerm,
          args.cutoff,
          args.type,
          args.pageSize,
          args.facets,
          args.skip
        ).subscribe(response => {
          observer.next(response);
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        });
      } else if (args.sequenceSearchTerm != null && args.sequenceSearchTerm !== '') {
        this.searchSubstanceSequences(
          args.sequenceSearchTerm,
          args.cutoff,
          args.type,
          args.seqType,
          args.pageSize,
          args.facets,
          args.skip
        ).subscribe(response => {
          observer.next(response);
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        });
      } else {

        this.searchSubstances(
          args.searchTerm,
          args.pageSize,
          args.facets,
          args.order,
          args.skip
        ).subscribe(response => {
          observer.next(response);
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        });

      }
    });
  }

  searchSubstances(
    searchTerm?: string,
    pageSize: number = 10,
    facets?: SubstanceFacetParam,
    order?: string,
    skip: number = 0
  ): Observable<PagingResponse<SubstanceDetail>> {

    let params = new SubstanceHttpParams();
    params = params.append('view', 'full');
    let url = this.apiBaseUrl;

    url += 'substances/search';
    if (searchTerm != null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }
    if (order != null && order !== '') {
      params = params.append('order', order);
    }
    params = params.appendFacetParams(facets);

    params = params.appendDictionary({
      top: pageSize && pageSize.toString(),
      skip: skip && skip.toString()
    });

    const options = {
      params: params
    };
    return this.http.get<PagingResponse<SubstanceDetail>>(url, options);
  }

  searchSubstanceStructures(
    searchTerm: string,
    cutoff?: number,
    type: string = 'substructure',
    pageSize: number = 10,
    facets?: SubstanceFacetParam,
    skip: number = 0,
    sync: boolean = false
  ): Observable<PagingResponse<SubstanceDetail>> {
    return new Observable(observer => {
      let params = new SubstanceHttpParams();
      params = params.append('view', 'full');
      let url = this.apiBaseUrl;
      let structureFacetsKey;

      structureFacetsKey = this.utilsService.hashCode(searchTerm, type, cutoff);

      if (!sync && this.searchKeys[structureFacetsKey]) {

        url += `status(${this.searchKeys[structureFacetsKey]})/results`;
        params = params.appendFacetParams(facets);
        params = params.appendDictionary({
          top: pageSize.toString(),
          skip: skip.toString()
        });

      } else {
        params = params.append('q', searchTerm);
        if (type) {
          params = params.append('type', type);
          if (type === 'similarity') {
            cutoff = cutoff || 0;
            params = params.append('cutoff', cutoff.toString());
          }
        }
        if (sync) {
          params = params.append('sync', sync.toString());
        }
        url += 'substances/structureSearch';
      }

      const options = {
        params: params
      };

      this.http.get<any>(url, options).subscribe(
        response => {
          // call async
          if (response.results) {
            const resultKey = response.key;
            this.searchKeys[structureFacetsKey] = resultKey;
            this.processAsyncSearchResults(
              url,
              response,
              observer,
              resultKey,
              options,
              pageSize,
              facets,
              skip,
              'full'
            );
          } else {
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

  searchSubstanceSequences(
    searchTerm?: string,
    cutoff: number = 0.5,
    type?: string,
    seqType?: string,
    pageSize: number = 10,
    facets?: SubstanceFacetParam,
    skip: number = 0,
    sync: boolean = false
  ): Observable<PagingResponse<SubstanceDetail>> {
    return new Observable(observer => {
      let params = new SubstanceHttpParams();
      params = params.append('view', 'full');
      let url = this.apiBaseUrl;
      let structureFacetsKey;

      structureFacetsKey = this.utilsService.hashCode(searchTerm, cutoff, type, seqType);

      if (!sync && this.searchKeys[structureFacetsKey]) {

        url += `status(${this.searchKeys[structureFacetsKey]})/results`;
        params = params.appendFacetParams(facets);
        params = params.appendDictionary({
          top: pageSize.toString(),
          skip: skip.toString()
        });

      } else {

        params = params.appendDictionary({
          q: searchTerm,
          type: type,
          cutoff: cutoff.toString()
        });

        if (sync) {
          params = params.append('sync', sync.toString());
        }
        url += 'substances/sequenceSearch';
      }

      const options = {
        params: params
      };

      this.http.get<any>(url, options).subscribe(
        response => {
          // call async
          if (response.results) {
            const resultKey = response.key;
            this.searchKeys[structureFacetsKey] = resultKey;
            this.processAsyncSearchResults(
              url,
              response,
              observer,
              resultKey,
              options,
              pageSize,
              facets,
              skip,
              'full'
            );
          } else {
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
    url: string,
    asyncCallResponse: any,
    observer: Observer<PagingResponse<SubstanceDetail>>,
    searchKey: string,
    httpCallOptions: any,
    pageSize?: number,
    facets?: SubstanceFacetParam,
    skip?: number,
    view?: string
  ): void {
    this.getAsyncSearchResults(
      searchKey,
      pageSize,
      facets,
      skip,
      view
    )
      .subscribe(response => {
        observer.next(response);
        if (!asyncCallResponse.finished) {
          this.http.get<any>(url, httpCallOptions).subscribe(searchResponse => {
            setTimeout(() => {
              this.processAsyncSearchResults(
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
          }, error => {
            observer.error(error);
            observer.complete();
          });
        } else {
          observer.complete();
        }
      }, error => {
        observer.error(error);
        observer.complete();
      });

  }

  private getAsyncSearchResults(
    structureSearchKey: string,
    pageSize?: number,
    facets?: SubstanceFacetParam,
    skip?: number,
    view?: string
  ): any {
    const url = `${this.apiBaseUrl}status(${structureSearchKey})/results`;
    let params = new SubstanceHttpParams();

    params = params.appendFacetParams(facets);
    params = params.appendDictionary({
      top: pageSize.toString(),
      skip: skip.toString(),
      view: view || ''
    });

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceDetail>>(url, options);
  }

  getSubstanceSummaries(
    searchTerm?: string,
    getFacets?: boolean,
    facets?: SubstanceFacetParam
  ): Observable<PagingResponse<SubstanceSummary>> {

    let params = new SubstanceHttpParams();

    let url = this.apiBaseUrl + 'substances/';

    if (searchTerm) {
      params = params.append('q', searchTerm);
    }

    if (searchTerm != null || getFacets === true) {
      url += 'search';
    }

    if (facets != null) {
      params = params.appendFacetParams(facets);
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceSummary>>(url, options);
  }

  postSubstanceStructure(mol: string): Observable<StructurePostResponse> {
    const url = `${this.configService.configData.apiBaseUrl}structure`;
    return this.http.post<StructurePostResponse>(url, mol);
  }

  getSubstanceSummary(id: string): Observable<SubstanceSummary> {
    const url = `${this.apiBaseUrl}substances(${id})`;
    return this.http.get<any>(url);
  }

  getSubstanceDetails(id: string): Observable<SubstanceDetail> {
    const url = `${this.apiBaseUrl}substances(${id})`;
    let params = new HttpParams();
    params = params.append('view', 'full');
    const options = {
      params: params
    };
    return this.http.get<SubstanceDetail>(url, options);
  }

  getSafeIconImgUrl(substance: SubstanceDetail, size: number): SafeUrl {
    let imgUrl = `${this.configService.configData.apiBaseUrl}assets/ginas/images/noimage.svg?size=${size.toString()}`;
    const substanceType = substance.substanceClass;
    if ((substanceType === 'chemical') && (substance.structure.id)) {
      const structureId = substance.structure.id;
      imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=${size.toString()}`;
    } else if ((substanceType === 'polymer') && (substance.polymer.displayStructure.id)) {
      const structureId = substance.polymer.displayStructure.id;
      imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=${size.toString()}`;
    } else {
      imgUrl = `assets/images/${substanceType}.svg`;
    }
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

}
