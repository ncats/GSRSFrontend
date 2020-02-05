import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { ApplicationSrs } from '../model/application.model';
import { SubstanceFacetParam } from '../../../core/substance/substance-facet-param.model';
import { SubstanceHttpParams } from '../../../core/substance/substance-http-params';
import { map } from 'rxjs/operators';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class ApplicationService extends BaseHttpService {

  totalRecords: 0;
  
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

  getClinicalTrialApplication(
    appType: string, appNumber: string
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'getClinicalTrialApplication?appType=' + appType + '&appNumber=' + appNumber;

    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceApplications(
    bdnum: string, page:number, pageSize: number
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'applicationListByBdnum?bdnum=' + bdnum + '&page=' + (page+1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );
  }

} //class
