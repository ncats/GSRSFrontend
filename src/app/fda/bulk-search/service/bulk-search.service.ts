import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { BulkQuery } from '../bulk-search.model';

@Injectable(
  { providedIn: 'root' }
)

export class BulkSearchService extends BaseHttpService {

  totalRecords: 0;
  baseHref: '';

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getBaseHref(): string {
    return this.configService.environment.baseHref;
  }

  postBulkQuery(
    context: string,
    queryText: string
  ): Observable<BulkQuery> {
    const url = this.configService.configData.apiBaseUrl + 'api/v1/@bulkQuery';
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'text/plain'
      }
    };
    return this.http.post<BulkQuery>(url, queryText, options);

  }
}
