import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { BulkQuery } from '../bulk-query.model';
import { BulkSearch } from '../bulk-search.model';

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
    const url = this.configService.configData.apiBaseUrl + 'api/v1/'+context+'/@bulkQuery';
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

  getBulkQuery(
    context: string,
    id: number,
    top: number = 10,
    skip: number = 0 
  ): Observable<BulkQuery> {
    const url = this.configService.configData.apiBaseUrl + 'api/v1/'+context+'/@bulkQuery';
    const options = {
      params: { 'top': top, 'skip': skip },
      type: 'JSON',
      headers: {}
    };
    return this.http.get<BulkQuery>(url+'?id='+id, options);
  }  
  
  getBulkSearch(
    context: string,
    id: number,
    searchOnIdentifiers: boolean = false
  ): Observable<BulkSearch> {
    const url = this.configService.configData.apiBaseUrl + 'api/v1/'+context+'/bulkSearch';
    let params = new HttpParams();
    params = params.append('bulkQID', id);
    params = params.append('searchOnIdentifiers', searchOnIdentifiers);

    params.append('simpleSearchOnly', null);
    const options = {
      params: params,
      type: 'JSON',
      headers: {}
    };
    return this.http.get<BulkSearch>(url, options);
  }


  getBulkSearchStatus(
    key: string,
  ): Observable<any> {
    const url = this.configService.configData.apiBaseUrl + 'api/v1/status/'+key;    
    let params = new HttpParams();
    const options = {
      type: 'JSON',
      headers: {}
    };
    return this.http.get<any>(url, options);
  }

  getBulkSearchStatusResults(
    key: string,
    top?: number,
    skip?: number,
    qTop?: number,
    qSkip?: number
  ): Observable<any> {
    const url = this.configService.configData.apiBaseUrl + 'api/v1/status/'+key+'/results';    
    let params = new HttpParams();
    const options = {
      params: {'top': top, 'skip': skip, 'qTop': qTop, 'qSkip': qSkip},
      type: 'JSON',
      headers: {}
    };
    return this.http.get<any>(url, options);
  }
}
