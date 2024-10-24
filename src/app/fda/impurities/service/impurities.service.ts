import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { Facet } from '@gsrs-core/facets-manager';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import {
  Impurities, ImpuritiesSubstance, ImpuritiesDetails, ImpuritiesTesting, ImpuritiesElutionSolvent,
  ImpuritiesSolution, ImpuritiesSolutionTable, ImpuritiesUnspecified, ImpuritiesResidualSolventsTest, ImpuritiesResidualSolvents, ImpuritiesInorganicTest,
  ImpuritiesInorganic, ImpuritiesTotal, ValidationResults, IdentityCriteria
} from '../model/impurities.model';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class ImpuritiesService extends BaseHttpService {

  private _bypassUpdateCheck = false;
  private impuritiesStateHash?: number;
  totalRecords: 0;
  impurities: Impurities;

  apiBaseUrlWithEntityContext = this.configService.configData.apiBaseUrl + 'api/v1/impurities' + '/';

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    public utilsService: UtilsService
  ) {
    super(configService);
  }

  get isImpuritiesUpdated(): boolean {
    const impuritiestring = JSON.stringify(this.impurities);
    if (this._bypassUpdateCheck) {
      this._bypassUpdateCheck = false;
      return false;
    } else {
      return this.impuritiesStateHash !== this.utilsService.hashCode(impuritiestring);
    }
  }

  bypassUpdateCheck(): void {
    this._bypassUpdateCheck = true;
  }

  getImpuritiesBySubstanceUuid(
    order: string,
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<any> {
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

    const options = {
      params: params
    };

    const query = 'search?q=root_impuritiesSubstanceList_substanceUuid:\"' + searchTerm + '"' +
      ' OR root_impuritiesSubstanceList_impuritiesTestList_impuritiesDetailsList_relatedSubstanceUuid:\"' + searchTerm + '"';
    const url = this.apiBaseUrlWithEntityContext + query;
    return this.http.get<Impurities>(url, options)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getImpuritiesByTestImpuritiesDetails(relatedSubstanceUuid: string): Observable<any> {
    const url = this.apiBaseUrlWithEntityContext + 'search?root_impuritiesSubstanceList_impuritiesTestList_impuritiesDetailsList_relatedSubstanceUuid:\"' + relatedSubstanceUuid + '"';
    return this.http.get<Impurities>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  searchImpurities(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<Impurities>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    const url = this.apiBaseUrlWithEntityContext + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<Impurities>>(url, options);
  }

  getApiExportUrl(etag: string, extension: string): string {
    const url = this.apiBaseUrlWithEntityContext + 'export/' + etag + '/' + extension;
    return url;
  }

  loadImpurities(impurities?: Impurities): void {
    // if Update/Exist Impurity
    if (impurities != null) {
      this.impurities = impurities;
    } else {
      this.impurities = {
        impuritiesSubstanceList: [],
        impuritiesTotal: {}
      };
    }
  }

  getImpurities(id: string): Observable<any> {
    const url = this.apiBaseUrlWithEntityContext + `${id}`;
    return this.http.get<Impurities>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  saveImpurities(): Observable<Impurities> {
    const url = this.apiBaseUrl + `impurities`;
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    // Update Impurity
    if ((this.impurities != null) && (this.impurities.id)) {
      return this.http.put<Impurities>(url, this.impurities, options);
    } else {
      // Save New Impurities
      return this.http.post<Impurities>(url, this.impurities, options);
    }
  }

  validateImpurities(): Observable<ValidationResults> {
    return new Observable(observer => {
      this.validateImpur().subscribe(results => {
        observer.next(results);
        observer.complete();
      }, error => {
        observer.error();
        observer.complete();
      });
    });
  }

  validateImpur(): Observable<ValidationResults> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/impurities/@validate`;
    return this.http.post(url, this.impurities);
  }

  getJson() {
    return this.impurities;
  }

  addNewImpuritiesSubstance(): void {
    //new 3.1
    const newSubstance: ImpuritiesSubstance = { impuritiesTestList: [], impuritiesResidualSolventsTestList: [], impuritiesInorganicTestList: [] };
    this.impurities.impuritiesSubstanceList.unshift(newSubstance);
  }

  addNewTest(impuritiesSubstanceIndex: number): void {
    const newTest: ImpuritiesTesting = { impuritiesElutionSolventList: [], impuritiesSolutionList: [], impuritiesSolutionTableList: [], impuritiesDetailsList: [], impuritiesUnspecifiedList: [] };
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList.unshift(newTest);
  }

  addNewImpuritiesElutionSolvent(impuritiesSubstanceIndex: number, impuritiesTestIndex: number) {
    const newElution: ImpuritiesElutionSolvent = {};
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex]
      .impuritiesTestList[impuritiesTestIndex]
      .impuritiesElutionSolventList.push(newElution);
  }

  addNewSolution(impuritiesSubstanceIndex: number, impuritiesTestIndex: number) {
    const newSolution: ImpuritiesSolution = {};
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex]
      .impuritiesTestList[impuritiesTestIndex]
      .impuritiesSolutionList.push(newSolution);
  }

  addNewSolutionTableDetails(impuritiesSubstanceIndex: number, impuritiesTestIndex: number) {
    const newSolutionTable: ImpuritiesSolutionTable = {};
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex]
      .impuritiesTestList[impuritiesTestIndex]
      .impuritiesSolutionTableList.push(newSolutionTable);
  }

  addNewImpuritiesDetails(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesDetails: ImpuritiesDetails): void {
    // const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex]
      .impuritiesTestList[impuritiesTestIndex]
      .impuritiesDetailsList.unshift(impuritiesDetails);
  }

  addNewImpuritiesUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex: number): void {
    const newImpuritiesUnspec: ImpuritiesUnspecified = { identityCriteriaList: [] };
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex]
      .impuritiesUnspecifiedList.unshift(newImpuritiesUnspec);
  }

  addNewIdentityCriteriaUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex, impuritiesUnspecifiedIndex: number) {
    const newIdentityCriteria: IdentityCriteria = {};
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex]
      .impuritiesUnspecifiedList[impuritiesUnspecifiedIndex].identityCriteriaList.push(newIdentityCriteria);
  }

  //new 3.1
  addNewResidualSolventsTest(impuritiesSubstanceIndex: number): void {
    const newTest: ImpuritiesResidualSolventsTest = { impuritiesResidualSolventsList: [] };
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesResidualSolventsTestList.unshift(newTest);
  }

  // new 3.1
  addNewInorganicTest(impuritiesSubstanceIndex: number): void {
    const newTest: ImpuritiesInorganicTest = { impuritiesInorganicList: [] };
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesInorganicTestList.unshift(newTest);
  }

  addNewImpuritiesResidualSolvents(impuritiesSubstanceIndex: number, impuritiesResidualTestIndex: number): void {
    const newImpuritiesResidual: ImpuritiesResidualSolvents = {};
    //new 3.1
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesResidualSolventsTestList[impuritiesResidualTestIndex].impuritiesResidualSolventsList.unshift(newImpuritiesResidual);
    // this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesResidualSolventsList.unshift(newImpuritiesResidual);
  }

  addNewImpuritiesInorganic(impuritiesSubstanceIndex: number, inorganicTestIndex: number): void {
    const newImpuritiesInorganic: ImpuritiesInorganic = {};
    //new 3.1
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesInorganicTestList[inorganicTestIndex].impuritiesInorganicList.unshift(newImpuritiesInorganic);
    // this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesInorganicList.unshift(newImpuritiesInorganic);
  }

  addNewImpuritiesTotal(): void {
    const newImpuritiesTotal: ImpuritiesTotal = {};
    //  this.impurities.impuritiesTotalList.unshift(newImpuritiesTotal);
  }

  deleteImpurities(): Observable<any> {
    const url = this.apiBaseUrlWithEntityContext + this.impurities.id;
    const params = new HttpParams();
    const options = {
      params: params
    };
    const x = this.http.delete<Impurities>(url, options);
    return x;
  }

  deleteImpuritiesSubstance(impuritiesSubstanceIndex: number): void {
    this.impurities.impuritiesSubstanceList.splice(impuritiesSubstanceIndex, 1);
  }

  deleteImpuritiesTest(impuritiesSubstanceIndex: number, impuritiesTestIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList.splice(impuritiesTestIndex, 1);
  }

  deleteImpuritiesSolution(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, solutionIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex].impuritiesSolutionList.splice(solutionIndex, 1);
  }

  deleteImpuritiesSolutionTable(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, solutionTableIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex].impuritiesSolutionTableList.splice(solutionTableIndex, 1);
  }

  deleteImpuritiesElutionSolvent(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, elutionIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex]
      .impuritiesElutionSolventList.splice(elutionIndex, 1);
  }

  deleteImpuritiesResdiualSolventTest(impuritiesSubstanceIndex: number, residualSolventsTestIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesResidualSolventsTestList.splice(residualSolventsTestIndex, 1);
  }

  deleteImpuritiesResidualSolvents(impuritiesSubstanceIndex: number, impuritiesResidualTestIndex: number, impuritiesResidualIndex: number): void {
    const impuritiesSub = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesResidualSolventsTestList[impuritiesResidualTestIndex];
    impuritiesSub.impuritiesResidualSolventsList.splice(impuritiesResidualIndex, 1);
  }

  deleteImpuritiesInorganicTest(impuritiesSubstanceIndex: number, impuritiesInorganicTestIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesInorganicTestList.splice(impuritiesInorganicTestIndex, 1);
  }

  deleteImpuritiesInorganic(impuritiesSubstanceIndex: number, impuritiesInorganicTestIndex: number, impuritiesInorganicIndex: number): void {
    const impuritiesSub = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesInorganicTestList[impuritiesInorganicTestIndex];
    impuritiesSub.impuritiesInorganicList.splice(impuritiesInorganicIndex, 1);
  }

  deleteImpuritiesDetails(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesDetailsIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex]
      .impuritiesDetailsList.splice(impuritiesDetailsIndex, 1);
  }

  deleteIdentityCriteria(impuritiesSubstanceIndex: number, impuritiesTestIndex: number,
    impuritiesDetailsIndex: number, identityCriteriaIndex: number): void {
    const impuritiesTest = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex];
    impuritiesTest.impuritiesDetailsList[impuritiesDetailsIndex].identityCriteriaList.splice(identityCriteriaIndex, 1);
  }

  deleteImpuritiesUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesUnspecifiedIndex: number): void {
    const impuritiesTest = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex]
      .impuritiesTestList[impuritiesTestIndex];
    impuritiesTest.impuritiesUnspecifiedList.splice(impuritiesUnspecifiedIndex, 1);
  }

  deleteIdentityCriteriaUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex: number,
    impuritiesUnspecifiedIndex: number, identityCriteriaIndex: number): void {
    const impuritiesTest = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex];
    impuritiesTest.impuritiesUnspecifiedList[impuritiesUnspecifiedIndex].identityCriteriaList.splice(identityCriteriaIndex, 1);
  }

  getSubstanceImpurities(
    substanceUuid: string, page: number, pageSize: number
  ): Observable<Array<any>> {

    const func = this.baseUrl + 'impuritiesListBySubstanceUuid?substanceUuid=';
    const url = func + substanceUuid + '&page=' + (page + 1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );
  }

  getRelationshipImpurity(
    substanceId: string
  ): Observable<any> {
    const url = this.apiBaseUrlWithEntityContext + 'subRelationship/' + substanceId;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  /*
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
  */

  getImpuritiesListExportUrl(substanceId: string): string {
    return this.baseUrl + 'impuritiesListExport?substanceId=' + substanceId;
  }

} // class
