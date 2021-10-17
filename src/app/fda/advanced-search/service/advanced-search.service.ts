import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { SubstanceDetail, SubstanceName, SubstanceCode } from '@gsrs-core/substance/substance.model';
import { ProductAll } from '../../product/model/product.model';
import { ClinicalTrial } from '../../clinical-trials/clinical-trial/clinical-trial.model';
// import { map, switchMap, tap } from 'rxjs/operators';
// import { Facet } from '@gsrs-core/facets-manager';
import { Application, ApplicationIngredient } from '../../application/model/application.model';

@Injectable(
  { providedIn: 'root' }
)

export class AdvancedSearchService extends BaseHttpService {

  totalRecords: 0;
  baseHref: '';

  apiBaseUrlWithApplicationEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applications' + '/';
  apiBaseUrlWithApplicationAllEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applicationsall' + '/';
  apiBaseUrlWithApplicationDarrtsEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applicationsdarrts' + '/';

  apiBaseUrlWithProductEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/products' + '/';
  apiBaseUrlWithProductBrowseEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/productsall' + '/';
  apiBaseUrlWithProductElistEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/productselist' + '/';

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
  ) {
    super(configService);
  }

  getBaseHref(): string {
    return this.configService.environment.baseHref;
  }

  getSubstanceCount(): Observable<number> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/@count`;
    return this.http.get<number>(url);
  }

  getApplicationCount(): Observable<number> {
    const url = this.apiBaseUrlWithApplicationEntityUrl + `@count`;
    return this.http.get<number>(url);
  }

  getProductCount(): Observable<number> {
    const url = this.apiBaseUrlWithProductBrowseEntityUrl + `@count`;
    return this.http.get<number>(url);
  }

  getClinicalTrialCount(): Observable<number> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/ctclinicaltrial/@count`;
    return this.http.get<number>(url);
  }

  getSubstances(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<SubstanceDetail>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }
    params = params.appendFacetParams(facets);

    const url = `${this.apiBaseUrl}substances/search`;
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceDetail>>(url, options);
  }

  getApplications(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<Application>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }
    params = params.appendFacetParams(facets);

    const url = this.apiBaseUrlWithApplicationEntityUrl + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<Application>>(url, options);
  }

  getProducts(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<ProductAll>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }
    params = params.appendFacetParams(facets);

    const url = this.apiBaseUrlWithProductBrowseEntityUrl + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<ProductAll>>(url, options);
  }

  getClinicalTrials(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<ClinicalTrial>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }
    params = params.appendFacetParams(facets);

    const url = `${this.apiBaseUrl}ctclinicaltrial/search`;
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<ClinicalTrial>>(url, options);
  }

  getTypeAheadSearchText(category: string, fieldName: string, searchTerm: string): Observable<any> {
    let url: string;
    let entityUrl: string;
    if (category) {
      if (category === 'Application') {
        entityUrl = this.apiBaseUrlWithApplicationEntityUrl;
      }
      url = entityUrl + 'suggest/' + fieldName + '?q=' + searchTerm;
    }
    return this.http.get<any>(url);
  }

  /*
  getSearchSuggestions(searchTerm: string): Observable<Any> {
    const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/' }api/v1/`;

    return this.http.get<Any>(url + 'suggest?q=' + searchTerm);
  }
  */
}
