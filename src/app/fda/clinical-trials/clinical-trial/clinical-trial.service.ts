import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { ClinicalTrial } from './clinical-trial.model';
import { BdnumNameAll } from './clinical-trial.model';
import { PagingResponse } from '@gsrs-core/utils';

@Injectable()
export class ClinicalTrialService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }
  getClinicalTrialsTest() {
    return [
      { 'id': 1, ctNumber: 'NCT01', substanceUuid: 'xyz1' },
      { 'id': 2, ctNumber: 'NCT02', substanceUuid: 'xyz2' },
      { 'id': 3, ctNumber: 'NCT03', substanceUuid: 'xyz3' },
      { 'id': 4, ctNumber: 'NCT04', substanceUuid: 'xyz4' }
    ];
  }
  getClinicalTrialsTest2(
  ): Observable<Array<ClinicalTrial>> {
    const url = this.apiBaseUrl + 'ctclinicaltrial';
    // let url = this.apiBaseUrl + 'clinical-trial/';
    const x = this.http.get<any>(url);
    // console.log(JSON.stringify(x));
    return x;
  }

  getClinicalTrials(
    skip: number = 0,
    pageSize: number = 10
  ): Observable<PagingResponse<ClinicalTrial>> {
    // console.log('skip: ' + skip);
    let params = new HttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    const url = `${this.apiBaseUrl}ctclinicaltrial`;
    const options = {
      params: params
    };
    return this.http.get<PagingResponse<ClinicalTrial>>(url, options);
  }

  deleteClinicalTrial(id: string): Observable<any> {
    const url = `${this.apiBaseUrl}ctclinicaltrial(${id})`;
    const params = new HttpParams();
    // params = params.append('view', 'full');
    const options = {
      params: params
    };
    const x = this.http.delete<ClinicalTrial>(url, options);
    return x;
  }



  getClinicalTrial(id: string): Observable<ClinicalTrial> {
    const url = this.apiBaseUrl + `ctclinicaltrial(${id})`;
    const params = new HttpParams();
    // params = params.append('view', 'full');
    const options = {
      params: params
    };
    const x = this.http.get<ClinicalTrial>(url, options);
    return x;
  }

  getBdnumNameAll(ingredientName: string): Observable<BdnumNameAll> {
    // const url = `${this.apiBaseUrl}clinicaltrial(${id})`;
    const url = this.apiBaseUrl + `bdnumnameall?ingredientName=` + encodeURIComponent(ingredientName);
    const params = new HttpParams();
    // params = params.append('view', 'full');
    const options = {
      params: params
    };
    const x = this.http.get<BdnumNameAll>(url, options);
    // console.log(JSON.stringify(x));
    return x;
  }

  getSubstanceDetailsFromName(name: string): Observable<any> {
    const url = this.apiBaseUrl + 'substances/search?q=root_names_name:"^'
      + encodeURIComponent(name) + '$"&fdim=1';

    const params = new HttpParams();
    // params = params.append('view', 'full');
    const options = {
      params: params
    };
    // let headers: HttpHeaders = new HttpHeaders();
    // headers = headers.append('Accept', 'application/json');
    const x = this.http.get<any>(url);
    return x;
  }

  getSubstanceDetailsFromUUID(uuid: string): Observable<any> {

    const url = this.apiBaseUrl + 'substances(' + encodeURIComponent(uuid) + ')';
    // console.log('url: ' + url);

    const params = new HttpParams();
    // params = params.append('view', 'full');
    const options = {
      params: params
    };
    const x = this.http.get<any>(url);
    return x;
  }

  getSubstanceDetailsFromName_(name: string) {
    const url = this.apiBaseUrl + 'substances(' + encodeURIComponent(name) + ')';
    const params = new HttpParams();
    // params = params.append('root_names_name', '"^'+name+'$"');
    const options = {
      params: params
    };
    let x = null;
    this.http.get(url).subscribe((res) => {
      // console.log("trying getSubstanceDetailsFromName");
      // console.log(res);
      x = res;
    });
    // console.log(x);
    return x;
  }

  addClinicalTrial(body): Observable<ClinicalTrial> {
    // const url = `${this.apiBaseUrl}ctclinicaltrial(${id})`;
    const url = this.apiBaseUrl + `ctclinicaltrial`;
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    const x = this.http.post<ClinicalTrial>(url, body, options);
    return x;
  }

  updateClinicalTrial(body): Observable<ClinicalTrial> {
    // const url = `${this.apiBaseUrl}ctclinicaltrial(${id})`;
    const url = this.apiBaseUrl + `ctclinicaltrial`;
    const params = new HttpParams();
    // params = params.append('view', 'full');
    const options = {
      params: params,
      headers: {
        'Content-type': 'application/json'
      }

    };
    // this is actually geting the data from the PUT, but that gets lost in the subscribe routine.
    // letting the prevous data remain; very annoying. Could this have something to do with const declarations?
    const x = this.http.put<ClinicalTrial>(url, body, options);
    return x;
  }

}
