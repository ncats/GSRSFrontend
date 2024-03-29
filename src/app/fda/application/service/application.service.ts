import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaseHttpService } from '@gsrs-core/base';
import { ConfigService } from '@gsrs-core/config';
import { PagingResponse } from '@gsrs-core/utils';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { Facet } from '@gsrs-core/facets-manager';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { Application, Product, ProductName, ApplicationIngredient, ApplicationIndication } from '../model/application.model';
import { ApplicationAll } from '../model/application.model';
import { ValidationResults } from '../model/application.model';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';

// import { SubstanceFacetParam } from '../../../core/substance/substance-facet-param.model';
// import { SubstanceHttpParams } from '../../../core/substance/substance-http-params';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class ApplicationService extends BaseHttpService {

  private _bypassUpdateCheck = false;
  private applicationStateHash?: number;
  totalRecords = 0;
  application: Application;

  //apiBaseUrlWithApplicationEntityUrl = this.apiBaseUrl + 'applications' + '/';
  //apiBaseUrlWithApplicationAllEntityUrl = this.apiBaseUrl + 'applicationsall' + '/';
  // apiBaseUrlWithApplicationDarrtsEntityUrl = this.apiBaseUrl + 'applicationsdarrts' + '/';

  apiBaseUrlWithApplicationEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applications' + '/';
  apiBaseUrlWithApplicationAllEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applicationsall' + '/';
  //TODO: remove explicit references like this if at all possible
  apiBaseUrlWithApplicationDarrtsEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applicationsdarrts' + '/';

  APPALL_SEARCH_SUBSTANCE_KEY = 'root_applicationProductList_applicationIngredientList_substanceKey:';

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    public utilsService: UtilsService
  ) {
    super(configService);
  }

  getApplications(
    order: string,
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

    if (order != null && order !== '') {
      params = params.append('order', order);
    }

    const url = this.apiBaseUrlWithApplicationEntityUrl + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<Application>>(url, options);
  }

  getApplicationFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = `${this.configService.configData.apiBaseUrl}api/v1/applications/search/@facets?wait=false&kind=gov.hhs.gsrs.application.application.models.Application&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }

  filterFacets(name: string, category: string): Observable<any> {
    const url = this.apiBaseUrlWithApplicationEntityUrl + `search/@facets?wait=false&kind=gov.hhs.gsrs.application.application.models.Application&skip=0&fdim=200&sideway=true&field=${category}&top=14448&fskip=0&fetch=100&order=%24lastUpdated&ffilter=${name}`;
    return this.http.get(url);
  }

  retrieveFacetValues(facet: Facet): Observable<any> {
    const url = facet._self;
    return this.http.get<any>(url);
  }

  retrieveNextFacetValues(facet: Facet): Observable<any> {
    const url = facet._self;
    if (!facet.$next) {
      return this.http.get<any>(url).pipe(
        switchMap(response => {
          if (response) {
            const next = response.nextPageUri;
            return this.http.get<any>(next);
          } else {
            return 'nada';
          }
        }));
    } else {
      return this.http.get<any>(facet.$next);
    }

  }

  getApiExportUrl(etag: string, extension: string): string {
    const url = this.apiBaseUrlWithApplicationEntityUrl + 'export/' + etag + '/' + extension;
    return url;
  }

  getApplicationSearchSuggestions(searchTerm: string): Observable<SubstanceSuggestionsGroup> {
    return this.http.get<SubstanceSuggestionsGroup>(this.apiBaseUrlWithApplicationEntityUrl + 'suggest?q=' + searchTerm);
  }

  getApplicationAll(
    order: string,
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<ApplicationAll>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    if (order != null && order !== '') {
      params = params.append('order', order);
    }

    const url = this.apiBaseUrlWithApplicationAllEntityUrl + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<ApplicationAll>>(url, options);
  }

  // 2.x play framework, Will REMOVE in Future
  exportBrowseApplicationsUrl(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): string {
    let params = new FacetHttpParams();
    //  params = params.append('skip', skip.toString());
    //  params = params.append('top', '1000');
    params = params.append('page', '1');
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    const url = this.baseUrl + 'exportApplications?' + params;
    const options = {
      params: params
    };

    return url;
  }

  getAppAllApiExportUrl(etag: string, extension: string): string {
    const url = this.apiBaseUrlWithApplicationAllEntityUrl + 'export/' + etag + '/' + extension;
    return url;
  }

  /*
  getClinicalTrialApplication(
    applications: Array<ApplicationSrs>
  ): Observable<Array<any>> {

    //appType: string, appNumber: string
    let clinicalTrial: Array<any> = [];

  //: Observable<Array<any>> {
    //console.log("clinical2 " + application.appType + "  " + application.appNumber);
    applications.forEach((element, index) => {
      console.log("AAA: " + element.appType + "  " +element.appNumber);
      const url = this.baseUrl + 'getClinicalTrialApplication2?appType=' + element.appType + '&appNumber=' + element.appNumber;
    //  clinicalTrial = this.http.get<Array<any>>(url)
    });

    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        return results;
      })
    );

  }
*/

  getApplicationCenterList(
    substanceKey: string
  ): Observable<any> {
    const url = this.apiBaseUrlWithApplicationAllEntityUrl + 'distcenter/' + substanceKey;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getApplicationBySubstanceKeyCenter(substanceKey: string): Observable<any> {
    // const url = this.apiBaseUrlWithEntityAllContext + 'search?q=root_applicationProductList_applicationIngredientList_substanceKey:'
    // + substanceKey;

    const url = this.apiBaseUrlWithApplicationEntityUrl + 'search?q=root_applicationProductList_applicationIngredientList_substanceKey:'
      + substanceKey;
    return this.http.get<Application>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  // 2.x play framework, Will REMOVE in Future
  getSubstanceApplications(
    bdnum: string, center: string, fromTable: string, page: number, pageSize: number
  ): Observable<Array<any>> {

    const func = this.baseUrl + 'applicationListByBdnum?bdnum=';
    const url = func + bdnum + '&center=' + center + '&fromTable=' + fromTable + '&page=' + (page + 1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );
  }

  searchApplicationBySubstanceKey(
    substanceKey: string // , center: string, fromTable: string, page: number, pageSize: number
  ): Observable<Array<any>> {
    const url = this.apiBaseUrlWithApplicationEntityUrl + 'search?q=' + substanceKey;
    // + '&center=' + center + '&fromTable=' + fromTable + '&page=' + (page + 1) + '&pageSize=' + pageSize;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getApplicationById(
    id: number
  ): Observable<any> {
    const url = this.apiBaseUrlWithApplicationEntityUrl + id;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getApplicationHistory(
    applicationId: number
  ): Observable<any> {
    const url = this.apiBaseUrlWithApplicationEntityUrl + 'applicationhistory/' + applicationId;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getProductTechnicalEffect(
    applicationId: number
  ): Observable<any> {
    const url = this.apiBaseUrlWithApplicationEntityUrl + 'prodtechnicaleffect/' + applicationId;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getProductEffected(
    applicationId: number
  ): Observable<any> {
    const url = this.apiBaseUrlWithApplicationEntityUrl + 'prodeffected/' + applicationId;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getClinicalTrialApplication(
    applicationId: number
  ): Observable<any> {
    const url = this.apiBaseUrlWithApplicationEntityUrl + 'appclinicaltrial/' + applicationId;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  // APPLICATION DARRTS
  getApplicationDarrtsDetails(
    appType: string, appNumber: string
  ): Observable<any> {
    const appTypeNumber = appType + appNumber;
    const url = this.apiBaseUrlWithApplicationDarrtsEntityUrl + appTypeNumber;
    // const url = this.baseUrl + 'applicationDarrtsDetails2?appType=' + appType + '&appNumber=' + appNumber;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  // APPLICATION DARRTS
  getSubstanceParentConcept(
    substanceKey: string
  ): Observable<any> {
    const url = this.apiBaseUrlWithApplicationDarrtsEntityUrl + 'substanceparentconcept/' + substanceKey;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }


  // Changed, work Spring Boot and Play
  /*
  getSubstanceDetailsByAnyId(
    id: string
  ): Observable<any> {
    const url = this.apiBaseUrl + 'substances(' + id + ')';
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  // Changed, work Spring Boot and Play
  getSubstanceDetailsBySubstanceId(
    substanceId: string
  ): Observable<any> {
    // const url = this.apiBaseUrl + 'substances(' + substanceId + ')/codes'
    // const url = this.baseUrl + 'getSubstanceDetailsBySubstanceId?substanceId=' + substanceId;

    // TESTING TESTING
    this.apiBaseUrl = 'http://localhost:9000/ginas/app/api/v1/';

    const url = this.apiBaseUrl + 'substances(' + substanceId + ')';
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  // Changed, work Spring Boot and Play
  getSubstanceCodesBySubstanceUuid(
    substanceId: string
  ): Observable<any> {
    // const url = this.apiBaseUrl + 'substances(' + substanceId + ')/codes'
    // const url = this.baseUrl + 'getSubstanceDetailsBySubstanceId?substanceId=' + substanceId;

    // TESTING TESTING
    this.apiBaseUrl = 'http://localhost:9000/ginas/app/api/v1/';

    const url = this.apiBaseUrl + 'substances(' + substanceId + ')/codes';
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }
  */

  // 2.x play framework, Will REMOVE in Future
  getApplicationCenterByBdnum(
    bdnum: string
  ): Observable<any> {
    const url = this.baseUrl + 'getApplicationCenterByBdnum2?bdnum=' + bdnum;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  // 2.x play framework, Will REMOVE in Future
  getSubstanceRelationship(
    substanceId: string
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'getRelationshipBySubstanceId?substanceId=' + substanceId;
    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        return results['data'];
      })
    );
  }

  get isApplicationUpdated(): boolean {
    const applicationString = JSON.stringify(this.application);
    if (this._bypassUpdateCheck) {
      this._bypassUpdateCheck = false;
      return false;
    } else {
      return this.applicationStateHash !== this.utilsService.hashCode(applicationString);
    }
  }

  bypassUpdateCheck(): void {
    this._bypassUpdateCheck = true;
  }

  loadApplication(application?: Application): void {
    // if Update/Exist Application
    // setTimeout(() => {
    if (application != null) {
      this.application = application;

      // Add a new Indication if there is no indication record.
      if (this.application.applicationIndicationList.length < 1) {
        const newIndication: ApplicationIndication = {};
        this.application.applicationIndicationList.unshift(newIndication);
      }

      // Add a new Product Name if there is no Product Name record.
      /* if (this.application.applicationProductList[0].applicationProductNameList.length < 1) {
         const newProductNameSrs: ProductNameSrs = {};
         this.application.applicationProductList[0].applicationProductNameList.unshift(newProductNameSrs);
       }
      */
      //  console.log('AFTER' + JSON.stringify(this.application));
    } else {
      this.application = {
        applicationIndicationList: [{}],
        applicationProductList: [{
          applicationProductNameList: [{}],
          applicationIngredientList: [{}]
        }]
      };
    }
    //  });
  }

  saveApplication(): Observable<Application> {
    const url = this.apiBaseUrlWithApplicationEntityUrl;
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    // Update Application
    if ((this.application != null) && (this.application.id)) {
      return this.http.put<Application>(url, this.application, options);
    } else {
      // Save New Application
      return this.http.post<Application>(url, this.application, options);
    }
  }

  validateApplication(): Observable<ValidationResults> {
    return new Observable(observer => {
      this.validateApp().subscribe(results => {
        observer.next(results);
        observer.complete();
      }, error => {
        observer.error();
        observer.complete();
      });
    });
  }

  // Changed this function for GSRS 3.0 Spring Boot
  validateApp(): Observable<ValidationResults> {
    const url = this.apiBaseUrlWithApplicationEntityUrl + '@validate';
    return this.http.post(url, this.application);
  }

  deleteApplication(): Observable<any> {
    const url = this.apiBaseUrlWithApplicationEntityUrl + this.application.id;
    const params = new HttpParams();
    const options = {
    };
    const x = this.http.delete<Application>(url, options);
    return x;
  }

  addNewIndication(): void {
    const newIndication: ApplicationIndication = {};
    this.application.applicationIndicationList.unshift(newIndication);
  }

  deleteIndication(indIndex: number): void {
    this.application.applicationIndicationList.splice(indIndex, 1);
  }

  addNewProduct(): void {
    const newProduct: Product = {
      applicationProductNameList: [{}],
      applicationIngredientList: [{}]
    };

    this.application.applicationProductList.unshift(newProduct);
  }

  addNewProductName(prodIndex: number): void {
    const newProductName: ProductName = {};

    this.application.applicationProductList[prodIndex].applicationProductNameList.unshift(newProductName);
  }

  deleteProduct(prodIndex: number): void {
    this.application.applicationProductList.splice(prodIndex, 1);
  }

  deleteProductName(prodIndex: number, prodNameIndex: number): void {
    this.application.applicationProductList[prodIndex].applicationProductNameList.splice(prodNameIndex, 1);
  }

  copyProduct(product: any): void {
    const newProduct = JSON.parse(JSON.stringify(product));
    newProduct.reviewedBy = null;
    newProduct.reviewDate = null;
    this.application.applicationProductList.unshift(newProduct);
  }

  reviewProduct(prodIndex: number): void {
    //  this.application.applicationProductList[prodIndex].applicationIngredientList.unshift(newIngredient);
  }

  addNewIngredient(index: number): void {
    const newIngredient: ApplicationIngredient = {};
    this.application.applicationProductList[index].applicationIngredientList.unshift(newIngredient);
  }

  deleteIngredient(prodIndex: number, ingredIndex: number): void {
    this.application.applicationProductList[prodIndex].applicationIngredientList.splice(ingredIndex, 1);
  }

  copyIngredient(ingredient: any, prodIndex: number): void {
    const newIngredient = JSON.parse(JSON.stringify(ingredient));
    newIngredient.reviewedBy = null;
    newIngredient.reviewDate = null;
    this.application.applicationProductList[prodIndex].applicationIngredientList.unshift(newIngredient);
  }

  reviewIngredient(prodIndex: number, ingredIndex: number): void {
    //  this.application.applicationProductList[prodIndex].applicationIngredientList.unshift(newIngredient);
  }

  getJson() {
    return this.application;
  }

  getUpdateApplicationUrl(): string {
    return this.baseUrl + 'updateApplication?applicationId=';
  }

  getApplicationListExportUrl(bdnum: string): string {
    return this.baseUrl + 'applicationListExport?bdnum=' + bdnum;
  }

  /*
  getSubstanceCodeCodeSystemConfig(): string {
    let url = null;
    url = `${(this.configService.configData && this.configService.configData.substanceCodeCodeSystem)}`;
    return url;
  }

  getSubstanceCodeIdTypeConfig(): string {
    let url = null;
    url = `${(this.configService.configData && this.configService.configData.substanceCodeIdType)}`;
    return url;
  }
  */

} // class
