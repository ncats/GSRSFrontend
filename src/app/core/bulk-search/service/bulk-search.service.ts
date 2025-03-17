import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpParameterCodec } from '@angular/common/http';
import { Observable, Observer, Subject, BehaviorSubject } from 'rxjs';
import { switchMap, map, catchError, takeWhile } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { FacetParam } from '@gsrs-core/facets-manager/facet.model';
import { FacetHttpParams } from '@gsrs-core/facets-manager/facet-http-params';
import { PagingResponse } from '@gsrs-core/utils/paging-response.model';
import { BulkQuery } from '../bulk-query.model';
import { BulkSearch } from '../bulk-search.model';

class CustomEncoder implements HttpParameterCodec {
  encodeKey(key: string): string {
    return encodeURIComponent(key);
  }

  encodeValue(value: string): string {
    return encodeURIComponent(value);
  }

  decodeKey(key: string): string {
    return decodeURIComponent(key);
  }

  decodeValue(value: string): string {
    return decodeURIComponent(value);
  }
}

@Injectable(
  { providedIn: 'root' }
)

export class BulkSearchService extends BaseHttpService {

  totalRecords: 0;
  baseHref: '';
  showDeprecated = false;

  private tempObject: any;
  public listEmitter = new Subject<any>();
  private searchKeys: { [structureSearchTerm: string]: string } = {};
  private pauseSubject = new BehaviorSubject<boolean>(false);

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    private utilsService: UtilsService
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
    const url = this.configService.configData.apiBaseUrl + 'api/v1/' + context + '/@bulkQuery';
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
    const url = this.configService.configData.apiBaseUrl + 'api/v1/' + context + '/@bulkQuery';
    const options = {
      // eslint-disable-next-line object-shorthand
      params: { top: top, skip: skip },
      type: 'JSON',
      headers: {}
    };
    return this.http.get<BulkQuery>(url + '?id=' + id, options);
  }

  getBulkSearch(
    context: string,
    id: number,
    searchOnIdentifiers: boolean = false
  ): Observable<BulkSearch> {
    const url = this.configService.configData.apiBaseUrl + 'api/v1/' + context + '/bulkSearch';
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
    url?: string
  ): Observable<any> {
    // the host in url can be different for non-substance, so need to pass the correct url
    if (!url) {
      url = this.configService.configData.apiBaseUrl + 'api/v1/status/' + key;
    } else {
      url = url + 'status/' + key;
    }

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
    qSort: string = '',
    qFilter: string = '',
    url: string = null
  ): Observable<any> {
    // the host in url can be different for non-substance, so need to pass the correct url
    //if (url === null || url === undefined || url === '') {
    if (!url) {
      url = this.configService.configData.apiBaseUrl + 'api/v1/status/' + key + '/results';
    } else {
      url = url + 'status/' + key + '/results';
    }
    // let params = new HttpParams();
    const options = {
      // eslint-disable-next-line object-shorthand
      params: { top: top, skip: skip, qTop: qTop, qSkip: qSkip, qSort: qSort, qFilter: qFilter },
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
    // save search results as a list by etag
    const url = this.apiBaseUrl + `substances/@userList/etag/${etag}?listName=${name}`;

    return this.http.post<any>(url, null);
  }

  getSaveBulkListStatus(id: string) {
    // get the status of a call to add a new list.
    const url = this.apiBaseUrl + `substances/@userList/status/${id}`;
    return this.http.get<any>(url);
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

  getSingleBulkSearchList(name: string, user?: string) {
    // Get the keys and other fields of a list. default to active user if not specified
    let url = this.apiBaseUrl + `substances/@userList/${name}`;

    if (user && user !== null) {
      url = this.apiBaseUrl + `substances/@userList/${user}/${name}`;

    }
    return this.http.get<any>(url);
  }

  editKeysBulkSearchLists(name: string, list: string, operation: string, userName?: string) {
    // Add or remove keys from a list
    let type = "currentUser";
    if (userName) {
      type = "otherUser";
    }
    let url = this.apiBaseUrl + `substances/@userList/${type}?keys=${list}&listName=${name}&operation=${operation}`;
    if (userName) {
      url +=  "&userName=" + userName;
    }
    return this.http.put<any>(url, list);
  }

  editEtagBulkSearchLists(name: string, etag: string, operation: string) {
    // Add or remove keys from a list
    const url = this.apiBaseUrl + `substances/@userList/currentUser/etag/${etag}?listName=${name}&operation=${operation}`;
    return this.http.put<any>(url, null);
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