import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { ApplicationSrs, ValidationResults, ApplicationIngredient } from '../model/application.model';
import { ApplicationIndicationSrs, ProductSrs, ProductNameSrs } from '../model/application.model';
import { SubstanceFacetParam } from '../../../core/substance/substance-facet-param.model';
import { SubstanceHttpParams } from '../../../core/substance/substance-http-params';
import { map, switchMap, tap } from 'rxjs/operators';
import { Facet } from '@gsrs-core/utils';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class ApplicationService extends BaseHttpService {

  totalRecords: 0;
  application: ApplicationSrs;

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getApplications(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: SubstanceFacetParam
  ): Observable<PagingResponse<ApplicationSrs>> {
    let params = new SubstanceHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    const url = `${this.apiBaseUrl}applicationssrs/search`;
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<ApplicationSrs>>(url, options);
  }

  exportBrowseApplicationsUrl(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: SubstanceFacetParam
  ): string {
    let params = new SubstanceHttpParams();
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

  filterFacets(name: string, category: string): Observable<any> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/applicationssrs/search/@facets?wait=false&kind=ix.srs.models.ApplicationSrs&skip=0&fdim=200&sideway=true&field=${category}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${name}`;
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

  getApplicationDetails(
    id: number
  ): Observable<any> {
    const url = this.baseUrl + 'applicationDetails2?id=' + id;

    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getApplicationDarrtsDetails(
    appType: string, appNumber: string
  ): Observable<any> {
    const url = this.baseUrl + 'applicationDarrtsDetails2?appType=' + appType + '&appNumber=' + appNumber;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceDetailsByBdnum(
    bdnum: string
  ): Observable<any> {
    const url = this.baseUrl + 'getSubstanceDetailsByBdnum?bdnum=' + bdnum;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceDetailsBySubstanceId(
    substanceId: string
  ): Observable<any> {
    const url = this.baseUrl + 'getSubstanceDetailsBySubstanceId?substanceId=' + substanceId;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

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

  loadApplication(application?: ApplicationSrs): void {
    // if Update/Exist Application
    // setTimeout(() => {
    if (application != null) {
      this.application = application;

      // Add a new Indication if there is no indication record.
      if (this.application.applicationIndicationList.length < 1) {
        const newIndication: ApplicationIndicationSrs = {};
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

  saveApplication(): Observable<ApplicationSrs> {
    const url = this.apiBaseUrl + `applicationssrs`;
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
  //  console.log('APP: ' + this.application);

    // Update Application
    if ((this.application != null) && (this.application.id)) {
      return this.http.put<ApplicationSrs>(url, this.application, options);
    } else {
      // Save New Application
      return this.http.post<ApplicationSrs>(url, this.application, options);
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

  validateApp(): Observable<ValidationResults> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/applicationssrs/@validate`;
    return this.http.post(url, this.application);
  }

  addNewIndication(): void {
    const newIndication: ApplicationIndicationSrs = {};
    this.application.applicationIndicationList.unshift(newIndication);
  }

  deleteIndication(indIndex: number): void {
    this.application.applicationIndicationList.splice(indIndex, 1);
  }

  addNewProduct(): void {
    const newProduct: ProductSrs = {
      applicationProductNameList: [{}],
      applicationIngredientList: [{}]
    };

    this.application.applicationProductList.unshift(newProduct);
  }

  addNewProductName(prodIndex: number): void {
    const newProductName: ProductNameSrs = {};

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

} // class
