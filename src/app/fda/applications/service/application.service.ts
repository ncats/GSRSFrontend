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

  getSubstanceApplications(
    substanceId: string
  ): Observable<Array<any>> {

    console.log('getSubApp');
    let params = new SubstanceHttpParams();

    substanceId = '0052175AA';

    // params = params.appendFacetParams(facets);

    const url = `${this.apiBaseUrl}applicationssrs/search?q=0052175AA`;
    //const url = `${this.apiBaseUrl}applicationssrs/search?q=0052175AA`;
     // + encodeURIComponent(substanceId) + '$"&fdim=1';

    //const url = `${this.apiBaseUrl}applicationssrs/search`;
    const options = {
      params: params
    };
    return this.http.get<Array<any>>(url).pipe(
      map(products => {
        console.log("AAA: " + products.content.length);
        return products.content;
      })
    );
  
  }
  
} //class
