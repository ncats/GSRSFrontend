import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { BaseHttpService } from '../base/base-http.service';
import { SubstanceSummary } from './substance.model';
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

  getSubtances(): Observable<PagingResponse<SubstanceSummary>> {
    return this.http.jsonp<PagingResponse<SubstanceSummary>>(this.apiBaseUrl + 'substances', 'callback');
  }

}
