import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { ClinicalTrial } from './clinical-trial.model';
import { BdnumNameAll } from './clinical-trial.model';
import { PagingResponse } from '@gsrs-core/utils';
import { map } from 'rxjs/operators';
import { ClinicalTrialFacetParam } from '../misc/clinical-trial-facet-param.model';
import { ClinicalTrialHttpParams } from '../misc/clinical-trial-http-params';

@Injectable()
export class ClinicalTrialService extends BaseHttpService {

  totalRecords: 0;

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getClinicalTrials(
    args: {
      searchTerm?: string,
      cutoff?: number,
      type?: string,
      pageSize?: number,
      order?: string,
      facets?: ClinicalTrialFacetParam,
      skip?: number
    } = {}): Observable<PagingResponse<ClinicalTrial>> {
    if (!args.searchTerm) {  args.searchTerm = ''; }
    if (!args.pageSize) {  args.pageSize = 10; }
    if (!args.skip) {  args.skip = 0; }
    let params = new ClinicalTrialHttpParams();
    params = params.append('skip', args.skip.toString());
    params = params.append('top', args.pageSize.toString());
    if (args.searchTerm !== null && args.searchTerm !== '') {
      if (args.type !== null && args.type !== '') {
        if (args.type === 'nctNumber' ) {
          // not working yet
          params = params.append('q', 'root_ctId:\"^' + args.searchTerm + '$\"');
        } else if (args.type === 'substanceUuid' ) {
          // not working yet
          params = params.append('q', 'root_clinicalTrialDrug_substanceUuid:\"^' + args.searchTerm + '$\"');
        } else if (args.type === 'title') {
          params = params.append('q', 'root_title:\"' + args.searchTerm + '\"');
        } else {
          params = params.append('q', args.searchTerm);
        }
      } else {
        params = params.append('q', args.searchTerm);
      }
    }
    if (args.facets !== null) {
      params = params.appendFacetParams(args.facets);
    }
    const url = `${this.apiBaseUrl}ctclinicaltrial/search`;
    const options = {
      params: params
    };
    return this.http.get<PagingResponse<ClinicalTrial>>(url, options);
  }


 // need to resolve
 getClinicalTrials_archana (
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

  getSubstanceClinicalTrials(
    bdnum: string, page: number, pageSize: number
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'clinicalTrialListByBdnum?bdnum=' + bdnum + '&page=' + (page + 1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );
  }

  getClinicalTrialDetails(
    nctNumber: string, src: string
  ): Observable<any> {
    const url = this.baseUrl + 'clinicalTrialDetails2?nctNumber=' + nctNumber + '&src=' + src;

    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

}
