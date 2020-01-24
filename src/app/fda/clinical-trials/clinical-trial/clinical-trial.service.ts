import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { ClinicalTrial } from './clinical-trial.model';
import { BdnumNameAll } from './clinical-trial.model';
import { PagingResponse } from '@gsrs-core/utils';
import { map } from 'rxjs/operators';

@Injectable()
export class ClinicalTrialService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getClinicalTrials(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string
  ): Observable<PagingResponse<ClinicalTrial>> {
    let params = new HttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }
    const url = `${this.apiBaseUrl}ctclinicaltrial/search`;
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
    const params = new HttpParams();
    // params = params.append('view', 'full');
    const options = {
      params: params
    };
    const x = this.http.get<any>(url);
    return x;
  }

  addClinicalTrial(body): Observable<ClinicalTrial> {
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

  getSubstanceClinicalTrials(substanceId: string
    ): Observable<Array<any>> {
      const url = 'http://localhost:9000/ginas/app/clinicalTrialListByBdnum?bdnum=0249729AA';
  
      return this.http.get<Array<any>>(url).pipe(
        map(clinicaltrials => {
          console.log("Clinical Trials Length: " + clinicaltrials.length);
         return clinicaltrials;
        })
      );
    }
}
