import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import {
  Impurities, ImpuritiesSubstance, ImpuritiesDetails, ImpuritiesTesting, ImpuritiesUnspecified, ImpuritiesResidualSolvents, ImpuritiesInorganic,
  ImpuritiesTotal, ValidationResults, IdentityCriteria } from '../model/impurities.model';
import { map, switchMap } from 'rxjs/operators';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class ImpuritiesService extends BaseHttpService {

  totalRecords: 0;
  impurities: Impurities;

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
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
    const url = this.apiBaseUrl + `impurities(${id})`;
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
    const newSubstance: ImpuritiesSubstance = { impuritiesTestList: [] };
    this.impurities.impuritiesSubstanceList.unshift(newSubstance);
  }

  addNewTest(impuritiesSubstanceIndex: number): void {
    const newTest: ImpuritiesTesting = { impuritiesDetailsList: [], impuritiesUnspecifiedList: [], impuritiesResidualSolventsList: [], impuritiesInorganicList: [] };
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList.unshift(newTest);
  }

  addNewImpuritiesDetails(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesDetails: ImpuritiesDetails): void {
      // const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
      this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex].impuritiesDetailsList.unshift(impuritiesDetails);
  }
  
  addNewImpuritiesUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex: number): void {
    const newImpuritiesUnspec: ImpuritiesUnspecified = { identityCriteriaList: [] };
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex].impuritiesUnspecifiedList.unshift(newImpuritiesUnspec);
  }

  addNewIdentityCriteriaUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex, impuritiesUnspecifiedIndex: number) {
    const newIdentityCriteria: IdentityCriteria = {};
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex].impuritiesUnspecifiedList[impuritiesUnspecifiedIndex].identityCriteriaList.unshift(newIdentityCriteria);
  }

  addNewImpuritiesResidualSolvents(impuritiesSubstanceIndex: number, impuritiesTestIndex: number): void {
    const newImpuritiesResidual: ImpuritiesResidualSolvents = {};
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex].impuritiesResidualSolventsList.unshift(newImpuritiesResidual);
  }

  addNewImpuritiesInorganic(impuritiesSubstanceIndex: number, impuritiesTestIndex: number): void {
    const newImpuritiesInorganic: ImpuritiesInorganic = {};
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex].impuritiesInorganicList.unshift(newImpuritiesInorganic);
  }

  addNewImpuritiesTotal(): void {
    const newImpuritiesTotal: ImpuritiesTotal = {};
    //  this.impurities.impuritiesTotalList.unshift(newImpuritiesTotal);
  }

  deleteImpurities(): Observable<any> {
    const url = this.apiBaseUrl + 'impurities(' + this.impurities.id + ')';
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

  deleteImpuritiesDetails(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesDetailsIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex].impuritiesDetailsList.splice(impuritiesDetailsIndex, 1);
  }

  deleteIdentityCriteria(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesDetailsIndex: number, identityCriteriaIndex: number): void {
    const impuritiesTest = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex];
    impuritiesTest.impuritiesDetailsList[impuritiesDetailsIndex].identityCriteriaList.splice(identityCriteriaIndex, 1);
  }

  deleteImpuritiesUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesUnspecifiedIndex: number): void {
    const impuritiesTest = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex];
    impuritiesTest.impuritiesUnspecifiedList.splice(impuritiesUnspecifiedIndex, 1);
  }

  deleteIdentityCriteriaUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesUnspecifiedIndex: number, identityCriteriaIndex: number): void {
    const impuritiesTest = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex];
    impuritiesTest.impuritiesUnspecifiedList[impuritiesUnspecifiedIndex].identityCriteriaList.splice(identityCriteriaIndex, 1);
  }

  deleteImpuritiesResidualSolvents(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesResidualIndex: number): void {
    const impuritiesTest = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex];
    impuritiesTest.impuritiesResidualSolventsList.splice(impuritiesResidualIndex, 1);
  }
  
  deleteImpuritiesInorganic(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesInorganicIndex: number): void {
    const impuritiesTest = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex];
    impuritiesTest.impuritiesInorganicList.splice(impuritiesInorganicIndex, 1);
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
    const url = this.baseUrl + 'getRelationshipImpurity?substanceId=' + substanceId;
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

  getImpuritiesListExportUrl(substanceId: string): string {
    return this.baseUrl + 'impuritiesListExport?substanceId=' + substanceId;
  }

} // class
