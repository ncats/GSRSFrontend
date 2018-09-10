import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { BaseHttpService } from '../base/base-http.service';
import { SubstanceSummary, SubstanceDetail } from './substance.model';
import { PagingResponse } from '../utils/paging-response.model';

@Injectable({
  providedIn: 'root'
})
export class SubstanceService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getSubtanceDetails(searchTerm?: string, getFacets?: boolean): Observable<PagingResponse<SubstanceDetail>> {

    const options = {
      params: {
        view: 'full'
      }
    };

    if (searchTerm) {
      options.params['q'] = searchTerm;
    }

    let url = this.apiBaseUrl + 'substances/';

    if (searchTerm != null || getFacets === true) {
      url += 'search';
    }

    return this.http.get<PagingResponse<SubstanceDetail>>(url, options);
  }

  getSubstanceSummaries(searchTerm?: string, getFacets?: boolean): Observable<PagingResponse<SubstanceSummary>> {

    const options = {
      params: {}
    };

    let url = this.apiBaseUrl + 'substances/';

    if (searchTerm) {
      options.params['q'] = searchTerm;
    }

    if (searchTerm != null || getFacets === true) {
      url += 'search';
    }

    return this.http.get<PagingResponse<SubstanceSummary>>(url, options);
  }

}
