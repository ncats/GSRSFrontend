import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { map } from 'rxjs/operators';

@Injectable()
export class GeneralService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getSearchCount(substanceUuid: string): Observable<any> {
    const url = this.baseUrl + 'getSubstanceSearchCountBySubstanceUuid?substanceUuid=' + substanceUuid;
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  /*
  isDisplayAppToMatchConfig(): Observable<any> {
    const url = this.baseUrl + 'isDisplayAppToMatchConfig2';
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  setDisplayAppToMatchSession(checkBoxValue: boolean): Observable<any> {
    const url = this.baseUrl + 'setDisplayAppToMatchSession' + '';
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getDisplayAppToMatchSession(): Observable<any> {
    const url = this.baseUrl + 'getDisplayAppToMatchSession2';
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res;
        })
      );
  }
  */

  getAppIngredtMatchListCount(substanceUuid: string): Observable<any> {
    const url = this.baseUrl + 'getAppIngredtMatchListCountJson?substanceId=' + substanceUuid + '&citation=';
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getApplicationIngredientMatchList(substanceUuid: string): Observable<any> {
    const url = this.baseUrl + 'getAppIngredMatchList2?substanceId=' + substanceUuid + '&citation=';
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res.data;
        })
      );
  }

  getSubstanceNames(substanceUuid: string): Observable<Array<any>> {
    const url = `${this.apiBaseUrl}substances(${substanceUuid})/names`;
    return this.http.get<Array<any>>(url);
  }

  appIngredMatchListAutoUpdateSave(applicationId: number, bdnum: string): Observable<any> {
    const url = this.baseUrl + 'appIngredMatchListAutoUpdateSaveJson?applicationId=' + applicationId + '&bdnum=' + bdnum;
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

}
