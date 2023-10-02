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

  apiBaseUrlWithSubstanceEntityUrl = this.configService.configData.apiBaseUrl || '' + 'api/v1/substances' + '/';
  apiBaseUrlWithApplicationEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applications' + '/';
  apiBaseUrlWithApplicationAllEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applicationsall' + '/';
  apiBaseUrlWithApplicationDarrtsEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applicationsdarrts' + '/';

  apiBaseUrlWithProductEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/products' + '/';
  //apiBaseUrlWithProductBrowseEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/productsall' + '/';
  //apiBaseUrlWithProductElistEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/productselist' + '/';

  apiBaseUrlWithClinicalTrialEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/clinicaltrialsus' + '/';

  apiBaseUrlWithEntityPtContext = this.configService.configData.apiBaseUrl + 'api/v1/adverseeventpt' + '/';
  apiBaseUrlWithEntityDmeContext = this.configService.configData.apiBaseUrl + 'api/v1/adverseeventdme' + '/';
  apiBaseUrlWithEntityCvmContext = this.configService.configData.apiBaseUrl + 'api/v1/adverseeventcvm' + '/';


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
    const url = this.apiBaseUrlWithProductEntityUrl + `@count`;
    return this.http.get<number>(url);
  }

  getClinicalTrialCount(): Observable<number> {
    const url = this.apiBaseUrlWithClinicalTrialEntityUrl + `@count`;
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
    params = params.append('top', '1');  // setting top=1, faster result, no content
    params = params.append('view','key'); // setting view=key, faster result, no content
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
    params = params.append('top', '1');  // setting top=1, faster result, no content
    params = params.append('view','key'); // setting view=key, faster result, no content
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
    params = params.append('top', '1');  // setting top=1, faster result, no content
    params = params.append('view','key'); // setting view=key, faster result, no content
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }
    params = params.appendFacetParams(facets);

    const url = this.apiBaseUrlWithProductEntityUrl + 'search';
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
    params = params.append('top', '1');  // setting top=1, faster result, no content
    params = params.append('view','key'); // setting view=key, faster result, no content
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }
    params = params.appendFacetParams(facets);

    const url = this.apiBaseUrlWithClinicalTrialEntityUrl + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<ClinicalTrial>>(url, options);
  }

  getTypeAheadSearchText(category: string, fieldName: string, searchTerm: string): Observable<any> {
    let url: string;
    let entityUrl: string;
    let slash = '/';
    if (category) {
      if (category === 'Substance') {
        entityUrl = `${this.configService.configData.apiBaseUrl}api/v1/`;
      }
      if (category === 'Application') {
        entityUrl = this.apiBaseUrlWithApplicationEntityUrl;
      }
      if (category === 'Product') {
        entityUrl = this.apiBaseUrlWithProductEntityUrl;
      }
      if (category === 'Clinical Trial') {
        entityUrl = this.apiBaseUrlWithClinicalTrialEntityUrl;
      }
      if (category === 'Adverse Event') {
        if (fieldName) {
          if (fieldName === 'Ingredient_Name') {
            entityUrl = `${this.configService.configData.apiBaseUrl}api/v1/`;
            fieldName = 'Name';
          }
          if (fieldName === 'PT_Term') {
            entityUrl = this.apiBaseUrlWithEntityPtContext;
          }
          if (fieldName === 'Prim_SOC') {
            entityUrl = this.apiBaseUrlWithEntityPtContext;
          }
          if (fieldName === 'DME_Reactions') {
            entityUrl = this.apiBaseUrlWithEntityDmeContext;
          }
          if (fieldName === 'PTTerm_Meddra') {
            entityUrl = this.apiBaseUrlWithEntityDmeContext;
          }
          if (fieldName === 'Adverse_Event') {
            entityUrl = this.apiBaseUrlWithEntityCvmContext;
          }
          if (fieldName === 'Species') {
            entityUrl = this.apiBaseUrlWithEntityCvmContext;
          }
        }
      }

      url = entityUrl + 'suggest' + slash + fieldName + '?q=' + searchTerm;
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
