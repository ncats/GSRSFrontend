import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { BaseHttpService } from '../base/base-http.service';
import { SubstanceSummary, SubstanceDetail } from './substance.model';
import { PagingResponse } from '../utils/paging-response.model';

@Injectable({
  providedIn: 'root'
})
export class SubstanceService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getSubtanceDetails(
    searchTerm?: string,
    getFacets?: boolean,
    facets?: {
      [facetName: string]: {
        [facetValueLabel: string]: boolean
      }
    }
  ): Observable<PagingResponse<SubstanceDetail>> {

    let params = new HttpParams();
    params = params.append('view', 'full');

    if (searchTerm) {
      params = params.append('q', searchTerm);
    }

    let url = this.apiBaseUrl + 'substances/';

    if (searchTerm != null || getFacets === true) {
      url += 'search';
    }

    if (facets != null) {
      params = this.processFacetParams(params, facets);
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceDetail>>(url, options);
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

}
