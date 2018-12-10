import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of, Observer } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { BaseHttpService } from '../base/base-http.service';
import { SubstanceSummary, SubstanceDetail } from './substance.model';
import { PagingResponse } from '../utils/paging-response.model';
import { StructurePostResponse } from '../utils/structure-post-response.model';

@Injectable({
  providedIn: 'root'
})
export class SubstanceService extends BaseHttpService {
  private structureSearchKeys: { [structureSearchTerm: string]: string } = {};

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getSubtanceDetails(
    searchTerm?: string,
    structureSearchTerm?: string,
    structureSearchType?: string,
    structureSearchCutoff?: number,
    getFacets?: boolean,
    pageSize?: number,
    facets?: {
      [facetName: string]: {
        [facetValueLabel: string]: boolean
      }
    },
    skip?: number
  ): Observable<PagingResponse<SubstanceDetail>> {
    return new Observable(observer => {
      let params = new HttpParams();
      params = params.append('view', 'full');
      let url = this.apiBaseUrl;

      let structureFacetsKey;

      if (searchTerm) {

        url += 'substances/search';
        params = params.append('q', searchTerm);
        params = this.addQueryParameters(params, pageSize, facets, skip);

      } else if (structureSearchTerm) {

        structureFacetsKey = this.getStructureSearchKey(structureSearchTerm, structureSearchType, structureSearchCutoff);

        if (this.structureSearchKeys[structureFacetsKey]) {

          url += `status(${this.structureSearchKeys[structureFacetsKey]})/results`;
          params = this.addQueryParameters(params, pageSize, facets, skip);

        } else {
          params = params.append('q', structureSearchTerm);
          if (structureSearchType) {
            params = params.append('type', structureSearchType);
            if (structureSearchType === 'similarity') {
              structureSearchCutoff = structureSearchCutoff || 0;
              params = params.append('cutoff', structureSearchCutoff.toString());
            }
          }
          url += 'substances/structureSearch';
        }
      } else if (getFacets) {
        url += 'substances/search';
        params = this.addQueryParameters(params, pageSize, facets, skip);
      } else {
        params = this.addQueryParameters(params, pageSize, facets, skip);
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
              pageSize,
              facets,
              skip);
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

  private addQueryParameters(
    params: HttpParams,
    pageSize?: number,
    facets?: {
      [facetName: string]: {
        [facetValueLabel: string]: boolean
      }
    },
    skip?: number) {
      if (skip) {
        params = params.append('skip', skip.toString());
      }

      if (pageSize) {
        params = params.append('top', pageSize.toString());
      }

      if (facets != null) {
        params = this.processFacetParams(params, facets);
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
    facets?: {
      [facetName: string]: {
        [facetValueLabel: string]: boolean
      }
    },
    skip?: number): void {
    this.getSubstanceStructureSearchResults(
      structureSearchKey,
      pageSize,
      facets,
      skip)
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
              skip);
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
    facets?: {
      [facetName: string]: {
        [facetValueLabel: string]: boolean
      }
    },
    skip?: number): any {
    const url = `${this.apiBaseUrl}status(${structureSearchKey})/results`;
    let params = new HttpParams();

    params = this.addQueryParameters(params, pageSize, facets, skip);

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
    facets?: {
      [facetName: string]: {
        [facetValueLabel: string]: boolean
      }
    }
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

  private processFacetParams(params: HttpParams, facets?: { [facetName: string]: { [facetValueLabel: string]: boolean } }): HttpParams {
    const facetsKeys = Object.keys(facets);
    facetsKeys.forEach(facetKey => {
      if (facets[facetKey] != null) {
        const facetValueKeys = Object.keys(facets[facetKey]);
        facetValueKeys.forEach((facetValueKey) => {
          if (facets[facetKey][facetValueKey]) {
            params = params.append('facet', (facetKey + '/' + facetValueKey));
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

}
