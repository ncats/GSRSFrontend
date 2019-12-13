import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { ApplicationSrs } from '../model/application.model';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class ApplicationService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  } 

  getApplications(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string
  ): Observable<PagingResponse<ApplicationSrs>> {
    let params = new HttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }
    const url = `${this.apiBaseUrl}applicationssrs/search`;
    const options = {
      params: params
    };
    return this.http.get<PagingResponse<ApplicationSrs>>(url, options);
  }
  

} //class
