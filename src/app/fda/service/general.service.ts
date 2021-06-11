import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { map } from 'rxjs/operators';
import { SubstanceRelationship } from '@gsrs-core/substance/substance.model';

@Injectable()
export class GeneralService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getSubstanceBySubstanceUuid(
    substanceUuid: string
  ): Observable<any> {

    const url = this.apiBaseUrl + 'substances(' + substanceUuid + ')';
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceCodesBySubstanceUuid(
    substanceUuid: string
  ): Observable<any> {
    // const url = this.apiBaseUrl + 'substances(' + substanceUuid + ')/codes'
    // const url = this.baseUrl + 'getSubstanceDetailsBySubstanceId?substanceId=' + substanceId;

    const url = this.apiBaseUrl + 'substances(' + substanceUuid + ')/codes';
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceNamesBySubstanceUuid(substanceUuid: string): Observable<Array<any>> {

    const url = this.apiBaseUrl + 'substances(' + substanceUuid + ')/names';
    // const url = `${this.apiBaseUrl}substances(${substanceUuid})/names`;
    return this.http.get<Array<any>>(url);
  }

  getSubstanceByAnyId(
    id: string
  ): Observable<any> {

    const url = this.apiBaseUrl + 'substances(' + id + ')';
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceRelationships(substanceUuid: string): Observable<Array<SubstanceRelationship>> {

    const url = `${this.apiBaseUrl}substances(${substanceUuid})/relationships`;
    return this.http.get<Array<SubstanceRelationship>>(url);
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

  appIngredMatchListAutoUpdateSave(applicationId: number, bdnum: string): Observable<any> {
    const url = this.baseUrl + 'appIngredMatchListAutoUpdateSaveJson?applicationId=' + applicationId + '&bdnum=' + bdnum;
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getApiExportUrl(etag: string, extension: string): string {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/applicationssrs/export/${etag}/${extension}`;
    return url;
  }

  getEtagDetails(etag: string, fullname: string, source: string): Observable<any> {
    const url = this.baseUrl + 'getEtagDetails?etagId=' + etag + '&filename=' + fullname + '&source=' + source;
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getManualFile(): Observable<any> {
    const url = this.baseUrl + 'manual';
    return this.http.get<any>(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, responseType: 'blob' as 'json', observe: 'response'
    })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getManualUrl(): string {
    const url = this.baseUrl + 'manual';
    return url;
  }

  getSubstanceKeyType(): string {
    let key = null;
    if (this.configService.configData && this.configService.configData.substance) {
      const substanceConfig = this.configService.configData && this.configService.configData.substance;
      key = substanceConfig.linking.keyType.default;
    }
    return key;
  }

}
