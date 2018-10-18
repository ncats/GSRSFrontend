import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { BaseHttpService } from '../base/base-http.service';
import { SubstanceSummary, SubstanceDetail } from './substance.model';
import { PagingResponse } from '../utils/paging-response.model';
import { switchMap } from 'rxjs/operators';
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
    getFacets?: boolean,
    facets?: {
      [facetName: string]: {
        [facetValueLabel: string]: boolean
      }
    }
  ): Observable<PagingResponse<SubstanceDetail>> {

    let params = new HttpParams();
    params = params.append('view', 'full');

    let url = this.apiBaseUrl;

    let structureFacetsKey;

    if (searchTerm) {
      url += 'substances/search';
      params = params.append('q', searchTerm);
    } else if (structureSearchTerm) {
      structureFacetsKey = this.getStructureFacetsKey(structureSearchTerm, facets);
      if (this.structureSearchKeys[structureFacetsKey]) {
        url += `status(${this.structureSearchKeys[structureSearchTerm]})/results`;
      } else {
        params = params.append('q', structureSearchTerm);
        url += 'substances/structureSearch';
      }
    } else if (getFacets) {
      url += 'substances/search';
    }

    if (facets != null) {
      params = this.processFacetParams(params, facets);
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceDetail>>(url, options).pipe(
      switchMap((response: any) => {
        if (response.results) {
          const resultKey = response.key;
          console.log(resultKey);
          this.structureSearchKeys[structureFacetsKey] = resultKey;
          return this.http.get<PagingResponse<SubstanceDetail>>(response['results']);
        } else {
          return of(response);
        }
      })
    );
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

  private getStructureFacetsKey(structureSearchTerm: string, facets?: {
    [facetName: string]: {
      [facetValueLabel: string]: boolean
    }
  }): string {

    if (facets == null) {
      return structureSearchTerm;
    }
    console.log(facets);
    let key = structureSearchTerm;

    const facetNameKeys = Object.keys(facets);

    facetNameKeys.forEach(facetNameKey => {
      if (facets[facetNameKey] != null) {
        const facetValueKeys = Object.keys(facets[facetNameKey]);
        facetValueKeys.forEach(facetValueKey => {
          if (facets[facetNameKey][facetValueKey]) {
            key += (`-${facetNameKey}-${facetValueKey}`);
          }
        });
      }
    });

    return key;
  }

}
