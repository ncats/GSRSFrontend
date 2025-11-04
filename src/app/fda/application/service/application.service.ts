import { Injectable } from '@angular/core';
import { HttpClient, HttpParameterCodec, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of, Observer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Location } from '@angular/common';
//import { URL } from 'url';

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
import { BulkSearch } from '@gsrs-core/bulk-search/bulk-search.model';

// import { SubstanceFacetParam } from '../../../core/substance/substance-facet-param.model';
// import { SubstanceHttpParams } from '../../../core/substance/substance-http-params';

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

@Injectable(
  {
    providedIn: 'root',
  }
)

export class ApplicationService extends BaseHttpService {

  entity = 'applications';
  private _bypassUpdateCheck = false;
  private applicationStateHash?: number;
  totalRecords = 0;
  application: Application;
  public showDeprecated = false;
  private searchKeys: { [structureSearchTerm: string]: string } = {};

  apiBaseUrlWithApplicationEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applications' + '/';
  apiBaseUrlWithApplicationAllEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applicationsall' + '/';
  //TODO: remove explicit references like this if at all possible
  apiBaseUrlWithApplicationDarrtsEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applicationsdarrts' + '/';

  APPALL_SEARCH_SUBSTANCE_KEY = 'root_applicationProductList_applicationIngredientList_substanceKey:';

  // get service prefix url
  restApiPrefix = this.configService.configData && this.configService.configData.restApiPrefix || '';

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    public utilsService: UtilsService
  ) {
    super(configService);
  }

  getBulkSearchUrl(searchEntity: string, useServiceInUrl: boolean = false): string {

    let url = this.apiBaseUrl;

    let apiAddUrlPrefixToBackendUrls = '';

    if (searchEntity !== 'substances') {
      if (useServiceInUrl == true) {

        if (url.indexOf(this.restApiPrefix) > 0) {
          apiAddUrlPrefixToBackendUrls = '';
        } else {
          apiAddUrlPrefixToBackendUrls = this.restApiPrefix;
        }
        url = url.replace('/api/v1/', apiAddUrlPrefixToBackendUrls + '/service/' + searchEntity + '/api/v1/');
      }
    }
    return url;
  }

  getApplications(
    order: string,
    skip: number = 0,
    pageSize: number = 10,
    fdim: number = 10,
    searchTerm?: string,
    facets?: FacetParam,
    bulkQID?: number,
    view?: string,
    viewfield?: string,
    facetlabel?: string
  ): Observable<PagingResponse<Application>> {
    return new Observable(observer => {

      if (bulkQID != null && bulkQID.toString() != '') {

        /*
        // Need this due to hostname issue. The Bulk Search MUST execute using 8083 locally for 
        // bulk Search Result Status to work.
        let url = this.apiBaseUrlWithApplicationEntityUrl + `bulkSearch`;

        let generatingUrl = null;
        let isHostDifferent: boolean = false;

        let genUrl = null;
        this.getBulkSearch('applications', bulkQID, false).subscribe(response => {
          if (response) {
            if (response.generatingUrl) {
              generatingUrl = response.generatingUrl;
              let genUrl = new URL(generatingUrl);
              let origUrl = new URL(url);

              if (origUrl.host !== genUrl.host) {
                isHostDifferent = true;
              }
            }
          }
        */

        // if (isHostDifferent) {
        this.applicationBulkSearch(
          searchTerm,
          bulkQID,
          false,
          this.entity,
          pageSize,
          facets,
          order,
          skip
        ).subscribe(response => {
          observer.next(response);
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        });

        // }); // subscribe

      } else {
        const url = this.apiBaseUrlWithApplicationEntityUrl + 'search';

        let params = new FacetHttpParams();

        params = params.append('skip', skip.toString());
        params = params.append('top', pageSize.toString());
        params = params.append('fdim', fdim.toString());

        if (view) {
          params = params.append('view', view); // setting view=key or full, faster result
        }

        if (viewfield) {
          params = params.append('viewfield', viewfield); // setting viewfield=id or facet, faster result
        }

        if (facetlabel) {
          params = params.append('facetlabel', facetlabel); // setting facetlabel=FDA UNII, faster result, no content
        }

        if (searchTerm) {
          params = params.append('q', searchTerm);
        }

        params = params.appendFacetParams(facets);

        if (order) {
          params = params.append('order', order);
        }

        const options = {
          params: params
        };

        return this.http.get<PagingResponse<Application>>(url, options).subscribe(
          response => {
            if (response) {
              observer.next(response);
              observer.complete();
            }
          }, error => {
            observer.error(error);
            observer.complete();
          });
      } // else search

    });  // Observable(observer) 
  }

  applicationBulkSearch(
    querySearchTerm,
    bulkQID?: number,
    searchOnIdentifiers?: boolean,
    searchEntity?: string,
    pageSize: number = 10,
    facets?: FacetParam,
    order?: string,
    skip: number = 0
  ): Observable<PagingResponse<Application>> {

    return new Observable(observer => {

      let params = new FacetHttpParams({ encoder: new CustomEncoder() });
      let bulkFacetsKey: number;

      let url = this.getBulkSearchUrl(searchEntity, true);

      if (url) {
        url = url + `${this.entity}/bulkSearch`;
      } else {
        url = this.configService.configData.apiBaseUrl + 'api/v1/' + this.entity + '/bulkSearch';
      }

      params = params.append('bulkQID', bulkQID.toString());
      let v = "false";
      if (searchOnIdentifiers === true) { v = "true"; }
      params = params.append('searchOnIdentifiers', v);
      params = params.append('searchEntity', searchEntity);


      const options = {
        params: params
      };

      // Get Results
      this.http.get<any>(url, options).subscribe(
        response => {
          // call async
          if (response.results) {
            const resultKey = response.key;
            this.searchKeys[bulkFacetsKey] = resultKey;

            this.processAsyncSearchResults(
              searchEntity,
              querySearchTerm,
              url,
              response,
              observer,
              resultKey,
              options,
              pageSize,
              facets,
              skip,
              order
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
    searchEntity,
    querySearchTerm: string,
    url: string,
    bulkSearchResponse: any,
    observer: Observer<PagingResponse<Application>>,
    searchKey: string,
    httpCallOptions: any,
    pageSize?: number,
    facets?: FacetParam,
    skip?: number,
    order?: string,
    view?: string
  ): void {
    // Call Bulk Search Result
    this.getAsyncSearchResults(
      searchEntity,
      querySearchTerm,
      searchKey,
      pageSize,
      facets,
      skip,
      view,
      bulkSearchResponse.results,
      order
    )
      .subscribe(bulkSearchStatusResponse => {
        // consider making API backend provide statusKey in JSON
        bulkSearchStatusResponse.statusKey = searchKey;

        // Get search status results url
        let statusUrl = this.getBulkSearchUrl(searchEntity, true);
        bulkSearchStatusResponse.searchStatusUrl = statusUrl;
        bulkSearchStatusResponse.finished = bulkSearchResponse.finished;

        // Send this to subscribe
        observer.next(bulkSearchStatusResponse);

        // if Bulk Search is not finished, call bulk search API again
        if (!bulkSearchResponse.finished) {

          // Call Bulk Search again if NOT finished
          this.http.get<any>(url, httpCallOptions).subscribe(searchResponse => {

            // Call Bulk Search Results
            setTimeout(() => {
              this.processAsyncSearchResults(
                searchEntity,
                querySearchTerm,
                url,
                searchResponse,
                observer,
                searchKey,
                httpCallOptions,
                pageSize,
                facets,
                skip,
                order,
                view
              );
            });

          }, error => {
            observer.error(error);
            observer.complete();
          });
        } else {
          // If bulk Search is finished
          observer.complete();
        }
      }, error => {
        observer.error(error);
        observer.complete();
      });

  }

  private getAsyncSearchResults(
    searchEntity: string,
    querySearchTerm: string,
    // this is a status
    searchKey: string,
    pageSize?: number,
    facets?: FacetParam,
    skip?: number,
    view?: string,
    url?: string,
    order?: string
  ): any {

    url = this.getBulkSearchUrl(searchEntity, true);

    if (url) {
      url = `${url}status(${searchKey})/results`;
    } else {
      url = `${this.configService.configData.apiBaseUrl}api/v1/status(${searchKey})/results`;
    }

    let params = new FacetHttpParams({ encoder: new CustomEncoder() });

    params = params.appendFacetParams({ facet: { isAllMatch: false, params: { cache: false } } }, this.showDeprecated);

    params = params.appendDictionary({
      top: pageSize.toString(),
      skip: skip.toString(),
      view: view || ''
    });

    if (querySearchTerm != null && querySearchTerm !== '') {
      params = params.append('q', querySearchTerm);
    }

    if (order != null && order !== '') {
      params = params.append('order', order);
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<Application>>(url, options);
  }

  /*
  getBulkSearchStatus(
    key: string,
    url?: string
  ): Observable<any> {
    // the host in url can be different for non-substance, so need to pass the correct url
    if (!url) {
      url = this.configService.configData.apiBaseUrl + 'api/v1/status/' + key;
    }
    // let params = new HttpParams();
    const options = {
      type: 'JSON',
      headers: {}
    };
    return this.http.get<any>(url, options);
  }
  */

  getApplicationFacetWithSearchCriteria(facetName?: string, facets?: FacetParam, querySearchTerm?: string, fdim?: number): Observable<FacetQueryResponse> {
    let url: string;

    let params = new FacetHttpParams({ encoder: new CustomEncoder() });
    params = params.appendFacetParams(facets);

    if (querySearchTerm != null && querySearchTerm !== '') {
      params = params.append('q', querySearchTerm);
    }

    url = `${this.configService.configData.apiBaseUrl}api/v1/applications/search/@facets?wait=false&kind=gov.hhs.gsrs.application.application.models.Application&skip=0&fdim=${fdim}&field=${facetName.replace(' ', '+')}&top=10&fskip=0&fetch=1000000`;

    const options = {
      params: params
    };

    return this.http.get<FacetQueryResponse>(url, options);
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
