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

  getSubtances(viewFull?: boolean): Observable<PagingResponse<SubstanceDetail>> {

    const options = {
      params: new HttpParams()
    };

    if (viewFull) {
      options.params.set('view', 'full');
    }

    return this.http.get<PagingResponse<SubstanceDetail>>(this.apiBaseUrl + 'substances', options);
  }

  searchSubstances(searchTerm?: string, viewFull?: boolean): Observable<PagingResponse<SubstanceDetail>> {
    
    let options = {
      params: {}
    };

    if (searchTerm) {
      options.params['q'] = searchTerm;
    }

    if (viewFull) {
      options.params['view'] = 'full';
    }

    return this.http.get<PagingResponse<SubstanceDetail>>(this.apiBaseUrl + 'substances/search', options);
  }

}
