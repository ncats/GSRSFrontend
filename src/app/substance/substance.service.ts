import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Observer } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { BaseHttpService } from '../base/base-http.service';
import { SubstanceSummary, SubstanceDetail } from './substance.model';
import { PagingResponse } from '../utils/paging-response.model';
import { StructurePostResponse } from '../utils/structure-post-response.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { SubstanceFacetParam } from '../substance/substance-facet-param.model';

@Injectable({
  providedIn: 'root'
})
export class SubstanceService extends BaseHttpService {
  private structureSearchKeys: { [structureSearchTerm: string]: string } = {};

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    private sanitizer: DomSanitizer,
  ) {
    super(configService);
  }

  getSubtanceDetails(args: {
    searchTerm?: string,
    structureSearchTerm?: string,
    structureSearchCutoff?: number,
    sequenceSearchTerm?: string,
    sequenceSearchIdentity?: string,
    sequenceSearchSeqType?: string,
    searchType?: string,
    getFacets?: boolean,
    pageSize?: number,
    facets?: SubstanceFacetParam,
    skip?: number
  }): Observable<PagingResponse<SubstanceDetail>> {
    return new Observable(observer => {
      let params = new HttpParams();
      params = params.append('view', 'full');
      let url = this.apiBaseUrl;

      let structureFacetsKey;

      if (args.searchTerm) {

        url += 'substances/search';
        params = params.append('q', args.searchTerm);
        params = this.addQueryParameters(
          params,
          args.facets,
          {
            pageSize: args.pageSize,
            skip: args.skip
          });

      } else if (args.structureSearchTerm) {

        structureFacetsKey = this.getStructureSearchKey(args.structureSearchTerm, args.searchType, args.structureSearchCutoff);

        if (this.structureSearchKeys[structureFacetsKey]) {

          url += `status(${this.structureSearchKeys[structureFacetsKey]})/results`;
          params = this.addQueryParameters(
            params,
            args.facets,
            {
              pageSize: args.pageSize,
              skip: args.skip
            });

        } else {
          params = params.append('q', args.structureSearchTerm);
          if (args.searchType) {
            params = params.append('type', args.searchType);
            if (args.searchType === 'similarity') {
              args.structureSearchCutoff = args.structureSearchCutoff || 0;
              params = params.append('cutoff', args.structureSearchCutoff.toString());
            }
          }
          url += 'substances/structureSearch';
        }
      } else if (args.getFacets) {
        url += 'substances/search';
        params = this.addQueryParameters(
          params,
          args.facets,
          {
            pageSize: args.pageSize,
            skip: args.skip
          });
      } else {
        params = this.addQueryParameters(
          params,
          args.facets,
          {
            pageSize: args.pageSize,
            skip: args.skip
          });
      }

      const options = {
        params: params
      };

      this.http.get<any>(url, options).subscribe(
        response => {

          if (response.results) {
            const resultKey = response.key;
            this.structureSearchKeys[structureFacetsKey] = resultKey;
            this.processStructureSearchResults(
              url,
              response,
              observer,
              resultKey,
              options,
              args.pageSize,
              args.facets,
              args.skip,
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

  getSubstanceStructureSearchDetails(args: {
    structureSearchTerm?: string,
    structureSearchCutoff?: number,
    sequenceSearchTerm?: string,
    sequenceSearchIdentity?: string,
    sequenceSearchSeqType?: string,
    searchType?: string,
    getFacets?: boolean,
    pageSize?: number,
    facets?: SubstanceFacetParam,
    skip?: number,
    async?: boolean
  }): any {
    return new Observable(observer => {
      let params = new HttpParams();
      params = params.append('view', 'full');
      let url = this.apiBaseUrl;
      let searchFacetsKey;

      searchFacetsKey = this.getStructureSearchKey(args.structureSearchTerm, args.searchType, args.structureSearchCutoff);

      if (this.structureSearchKeys[searchFacetsKey]) {

        url += `status(${this.structureSearchKeys[searchFacetsKey]})/results`;
        params = this.addQueryParameters(
          params,
          args.facets,
          {
            pageSize: args.pageSize,
            skip: args.skip
          });

      } else {
        params = params.append('q', args.structureSearchTerm);
        if (args.searchType) {
          params = params.append('type', args.searchType);
          if (args.searchType === 'similarity') {
            args.structureSearchCutoff = args.structureSearchCutoff || 0;
            params = params.append('cutoff', args.structureSearchCutoff.toString());
          }
        }
        url += 'substances/structureSearch';
      }
    });
  }

  private addQueryParameters(
    params: HttpParams,
    facets?: SubstanceFacetParam,
    ...args
  ) {

    if (facets != null) {
      params = this.processFacetParams(params, facets);
    }

    const argsObject = {...args}[0];
    const keys = Object.keys(argsObject);

    if (keys != null && keys.length) {
      keys.forEach(key => {
        if (argsObject[key] != null && argsObject[key] !== '') {
          params = params.append(key, argsObject[key].toString());
        }
      });
    }

    return params;
  }

  private processStructureSearchResults(
    url: string,
    structureSearchResponse: any,
    observer: Observer<PagingResponse<SubstanceDetail>>,
    structureSearchKey: string,
    structureSearchCallOptions: any,
    pageSize?: number,
    facets?: SubstanceFacetParam,
    skip?: number,
    view?: string
  ): void {
    this.getSubstanceStructureSearchResults(
      structureSearchKey,
      pageSize,
      facets,
      skip,
      view
    )
      .subscribe(response => {
        observer.next(response);
        if (!structureSearchResponse.finished) {
          this.http.get<any>(url, structureSearchCallOptions).subscribe(searchResponse => {
            setTimeout(() => {
              this.processStructureSearchResults(
                url,
                searchResponse,
                observer,
                structureSearchKey,
                structureSearchCallOptions,
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

  private getSubstanceStructureSearchResults(
    structureSearchKey: string,
    pageSize?: number,
    facets?: SubstanceFacetParam,
    skip?: number,
    view?: string
  ): any {
    const url = `${this.apiBaseUrl}status(${structureSearchKey})/results`;
    let params = new HttpParams();

    params = this.addQueryParameters(
      params,
      facets,
      {
        pageSize: pageSize,
        skip: skip,
        view: view
      });

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceDetail>>(url, options);
  }

  private getStructureSearchKey(
    structureSearchTerm: string,
    structureSearchType: string = '',
    structureSearchCutoff: number = 0): string {

    let key = `${structureSearchTerm}`;

    if (structureSearchType) {
      key += `-${structureSearchType}`;

      if (structureSearchType === 'similarity') {
        key += `-${structureSearchCutoff.toString()}`;
      }
    }

    return key;
  }

  getSubstanceSummaries(
    searchTerm?: string,
    getFacets?: boolean,
    facets?: SubstanceFacetParam
  ): Observable<PagingResponse<SubstanceSummary>> {

    let params = new HttpParams();

    let url = this.apiBaseUrl + 'substances/';

    if (searchTerm) {
      params = params.append('q', searchTerm);
    }

    if (searchTerm != null || getFacets === true) {
      url += 'search';
    }

    if (facets != null) {
      params = this.processFacetParams(params, facets);
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceSummary>>(url, options);
  }

  private processFacetParams(
    params: HttpParams,
    facets?: SubstanceFacetParam
  ): HttpParams {
    const facetsKeys = Object.keys(facets);
    facetsKeys.forEach(facetKey => {
      if (facets[facetKey] != null) {
        const facetValueKeys = Object.keys(facets[facetKey].params);
        facetValueKeys.forEach((facetValueKey) => {
          if (facets[facetKey].params[facetValueKey] != null) {

            const paramPrefix = !facets[facetKey].params[facetValueKey] ? '!' :
              facets[facetKey].isAllMatch ? '^' : '';

            params = params.append(
              'facet',
              (`${paramPrefix}${facetKey}/${facetValueKey}`));
          }
        });
      }
    });

    return params;
  }

  postSubstance(mol: string): Observable<StructurePostResponse> {
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
