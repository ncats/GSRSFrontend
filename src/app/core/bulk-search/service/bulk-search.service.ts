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

  postOrPutBulkQuery(
    // id: number,
    context: string,
    queryText: string
  ): Observable<BulkQuery> {
    // NOTE PUTs are resulting in errors during search turning off for now.
    // All new queries are getting a new bulkQID   
    const url = this.configService.configData.apiBaseUrl + 'api/v1/'+context+'/@bulkQuery';
    let params = {};
    // if (id !== null && id !== undefined) { params['id'] = id };
    const options = {
      // eslint-disable-next-line object-shorthand
      params: params,
      type: 'JSON',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-type': 'text/plain'
      }
    };
    // if (id !== null && id !== undefined) {
    //  return this.http.put<BulkQuery>(url, queryText, options);
    // }
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
      // eslint-disable-next-line object-shorthand
      params: { top: top, skip: skip },
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
      // eslint-disable-next-line object-shorthand
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
    // let params = new HttpParams();
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
    qSkip?: number,
    qSort: string='',
    qFilter: string=''
  ): Observable<any> {
    const url = this.configService.configData.apiBaseUrl + 'api/v1/status/'+key+'/results';
    // let params = new HttpParams();
    const options = {
      // eslint-disable-next-line object-shorthand
      params: {top: top, skip: skip, qTop: qTop, qSkip: qSkip, qSort: qSort, qFilter: qFilter},
      type: 'JSON',
      headers: {}
    };
    return this.http.get<any>(url, options);
  }

  
  saveBulkSearch(list: string, name: string, etag?: string) {
    const url = this.apiBaseUrl + `substances/@userList/keys?listName=${name}`;
   
    return this.http.post<any>(url, list);
  }

  saveBulkSearchEtag(list: string, name: string, etag: string) {
    const url = this.apiBaseUrl + `substances/@userList/etag/${etag}?listName=${name}`;
   
    return this.http.post<any>(url, list);
  }

  getBulkSearchLists() {
    const url = this.apiBaseUrl + `substances/@userLists/currentUser`;
    return this.http.get<any>(url);
  }

  getUserBulkSearchLists(name: string) {
    // Get any users all saved lists.
    const url = this.apiBaseUrl + `substances/@userLists/otherUser?name=${name}`;
    return this.http.get<any>(url);
  }

  getSingleBulkSearchList(name: string) {
    // Get the keys and other fields of a list
    const url = this.apiBaseUrl + `substances/@userLists/${name}`;
    return this.http.get<any>(url);
  }

  editKeysBulkSearchLists(name: string, list: string, operation: string) {
    // Add or remove keys from a list
    const url = this.apiBaseUrl + `substances/@userList?listName=${name}&operation=${operation}`;
    return this.http.put<any>(url, list);
  }

  deleteBulkSearchList(name: string) {
    // Delete a list from current user
    const url = this.apiBaseUrl + `substances/@userList/currentUser?listName=${name}`;
    return this.http.delete<any>(url);
  }

  deleteUserBulkSearchList(listName: string, userName: string) {
    // Delete a list from any user
    const url = this.apiBaseUrl + `substances/@userList/otherUser?listName=${listName}&userName=${userName}`;
    return this.http.delete<any>(url);
  }

}
