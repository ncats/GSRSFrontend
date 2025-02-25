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
      url = url + '/results';
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

  // Using this for Cross Entity Search
  getBulkSearchWithFacets(
    searchEntity?: string,
    bulkQID?: number,
    url?: string,
    searchOnIdentifiers?: boolean,
    facets?: FacetParam,
    view?: string,
    querySearchTerm?: string,
    pageSize: number = 10,
    skip: number = 0,
    order?: string
  ): Observable<PagingResponse<any>> {
    return new Observable(observer => {

      console.log("INSIDE getAsynBUlkSearch **** " + JSON.stringify(facets));

      if (!url) {
        url = this.apiBaseUrl + searchEntity + `/bulkSearch`;
      }

      let params = new FacetHttpParams({ encoder: new CustomEncoder() });
      
      // Append Facets if exists
      params = params.appendFacetParams(facets, this.showDeprecated);
      

      // call entity/bulkSearch
      params = params.append('bulkQID', bulkQID.toString());
      let v = "false";
      if (searchOnIdentifiers === true) { v = "true"; }
      params = params.append('searchOnIdentifiers', v);
      params = params.append('searchEntity', searchEntity);
      
 
      const options = {
        params: params
      };

      // RETURN RESULTS for either API call bulkSearch or status(<key>)/results
      this.http.get<any>(url, options).subscribe(
        response => {
          // call async until finished is not equal to true
          if (response.results) {
            console.log("RESPONSE RESPONSE " + JSON.stringify(response));
            const resultKey = response.key;
            const resultUrl = response.results;
            const resultFinished = response.finished;

            if (resultFinished == false) {
              console.log("NOT FINISHED ***********")
            } // if search not finished

            else if (resultFinished) {
              console.log("FINISHED FINISHED @@@@@@@@@@@@@@@@@@@@@ ");
            }

            observer.next(response);
            observer.complete();

          }
        }, error => {
          observer.error(error);
          observer.complete();
        }
      );  // subscribe 
    });
  }

  getBulkSearchOrStatusResults(
    searchEntity?: string,
    bulkQID?: number,
    searchOnIdentifiers?: boolean,
    facets?: FacetParam,
    view?: string,
    querySearchTerm?: string,
    pageSize: number = 10,
    skip: number = 0,
    order?: string
  ): Observable<PagingResponse<any>> {
    return new Observable(observer => {

      let params = new FacetHttpParams({ encoder: new CustomEncoder() });
      let url = this.apiBaseUrl;
      let bulkFacetsKey: number;

      bulkFacetsKey = this.utilsService.hashCode(searchEntity, bulkQID, searchOnIdentifiers);

      console.log("BULK FACETS KEY USING UTIL SERVICE " + bulkFacetsKey);
      if (this.searchKeys[bulkFacetsKey]) {

        // Call API status(<Key>)/results
        //  url += `status(${this.searchKeys[bulkFacetsKey]})/results`;

        url = this.searchKeys[bulkFacetsKey];

        params = params.appendFacetParams(facets, this.showDeprecated);

        if (querySearchTerm && querySearchTerm.length > 0) {
          params = params.appendDictionary({
            top: pageSize.toString(),
            skip: skip.toString(),
            q: querySearchTerm.toString()
          });
        } else {
          params = params.appendDictionary({
            top: pageSize.toString(),
            skip: skip.toString()
          });
        }

        if (order != null && order !== '') {
          params = params.append('order', order);
        }
      } else {
        // call entity/bulkSearch
        params = params.append('bulkQID', bulkQID.toString());
        let v = "false";
        if (searchOnIdentifiers === true) { v = "true"; }
        params = params.append('searchOnIdentifiers', v);
        params = params.append('searchEntity', searchEntity);

        url += searchEntity + `/bulkSearch`;
      }

      const options = {
        params: params
      };

      // RETURN RESULTS for either API call bulkSearch or status(<key>)/results
      this.http.get<any>(url, options).subscribe(
        response => {
          // call async until finished is not equal to true
          if (response.results) {
            console.log("RESPONSE RESPONSE " + JSON.stringify(response));
            const resultKey = response.key;
            const resultUrl = response.results;

            this.searchKeys[bulkFacetsKey] = response.results;

            this.processAsyncSearchResults(
              querySearchTerm,
              url,
              response,
              observer,
              resultKey,
              options,
              pageSize,
              facets,
              skip,
              resultUrl,
              view
            );

          } else {
            // consider making API backend provide statusKey in JSON
            if (this.searchKeys && this.searchKeys[bulkFacetsKey]) {
              response.statusKey = this.searchKeys[bulkFacetsKey];
            }
            observer.next(response);
            observer.complete();
          }
        }, error => {
          observer.error(error);
          observer.complete();
        }
      );
    });
  }

  private processAsyncSearchResults(
    querySearchTerm: string,
    url: string,
    asyncCallResponse: any,
    observer: Observer<PagingResponse<any>>,
    searchKey: string,
    httpCallOptions: any,
    pageSize?: number,
    facets?: FacetParam,
    skip?: number,
    resultUrl?: string,
    view?: string,
  ): void {

    /*
    this.tempObject = {
      querySearchTerm: querySearchTerm,
      url: url,
      asyncCallResponse: asyncCallResponse,
      observer: observer,
      searchKey: searchKey,
      httpCallOptions: httpCallOptions,
      pageSize: pageSize ? pageSize : 0,
      facets: facets ? facets : null,
      skip: skip ? skip : 0,
      view: view ? view : null,
      resultUrl: resultUrl
    }
    */


    /*
    this.getAsyncSearchResults(querySearchTerm, searchKey, pageSize, facets, skip, view, resultUrl)
      .pipe(
        switchMap(response => {
          let temp: any = response;
          temp.statusKey = searchKey;
          temp.finished = asyncCallResponse.finished;
          temp.url = asyncCallResponse.url;
          observer.next(temp);

          if (asyncCallResponse.finished) {
            observer.complete();
            return [];
          }

          return this.http.get<any>(url, httpCallOptions).pipe(
            takeWhile(() => !this.pauseSubject.getValue()) // Pause search in browse
          );
        })
      )
      .subscribe(
        searchResponse => {
          console.log("SEARCH RESPONSE @@@@@@@@@@@@ " + JSON.stringify(searchResponse));
          setTimeout(() => {
            this.processAsyncSearchResults(
              querySearchTerm,
              url,
              searchResponse,
              observer,
              searchKey,
              httpCallOptions,
              pageSize,
              facets,
              skip,
              resultUrl,
              view
            );
          });
        },
        error => {
          observer.error(error);
          observer.complete();
        }
      );
    */
  }

  public getBulkSearchResults(
    key?: number,
    url?: string,
    fdim: number = 10,
    view?: string,
    viewfield?: string,
    facetlabel?: string,
    simpleSearchOnly?: string,
    pageSize: number = 10,
    skip: number = 0
  ): any {

    // if no url value passed in the parameter, use the default url
    if (!url) {
      url = `${this.apiBaseUrl}status(${key})/results`;
    }

    let params = new FacetHttpParams({ encoder: new CustomEncoder() });

    // params = params.appendFacetParams(facets, this.showDeprecated);

    // remove this when async backend issue is fixed
    // const random_key = Math.random().toString(36).replace('0.', '');

    params = params.appendFacetParams({ facet: { isAllMatch: false, params: { cache: false } } }, this.showDeprecated);

    //params = params.appendFacetParams(facets);

    params = params.appendDictionary({
      top: pageSize.toString(),
      skip: skip.toString(),
      fdim: fdim.toString(),
    });

    if (simpleSearchOnly) {
      params = params.append('simpleSearchOnly', simpleSearchOnly.toString()); // setting simpleSearchOnly=true, faster result, no facets
    }

    if (view && view !== '') {
      params = params.append('view', view); // setting view=key or full, faster result
    }

    if (viewfield && viewfield !== '') {
      params = params.append('viewfield', viewfield); // setting viewfield=id or facet, faster result
    }

    if (facetlabel && facetlabel !== '') {
      params = params.append('facetlabel', facetlabel); // setting facetlabel=FDA UNII, faster result, no content
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<any>>(url, options);
  }

  clearSearchKey() {
    Object.keys(this.searchKeys).forEach(key => {
      this.searchKeys[key] = undefined;
    });
  }

  /*********************************************** */

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

  editKeysBulkSearchLists(name: string, list: string, operation: string) {
    // Add or remove keys from a list
    const url = this.apiBaseUrl + `substances/@userList/currentUser?keys=${list}&listName=${name}&operation=${operation}`;
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