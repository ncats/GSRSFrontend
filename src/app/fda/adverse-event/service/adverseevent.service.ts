import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { BaseHttpService } from '@gsrs-core/base';
import { ConfigService } from '@gsrs-core/config';
import { PagingResponse } from '@gsrs-core/utils';
import { Facet } from '@gsrs-core/facets-manager';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { AdverseEventPt, AdverseEventDme, AdverseEventCvm } from '../model/adverse-event.model';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';

// import { SubstanceFacetParam } from '../../../core/substance/substance-facet-param.model';
// import { SubstanceHttpParams } from '../../../core/substance/substance-http-params';


@Injectable(
  {
    providedIn: 'root',
  }
)

export class AdverseEventService extends BaseHttpService {

  totalRecords = 0;

  apiBaseUrlWithEntityPtContext = this.configService.configData.apiBaseUrl + 'api/v1/adverseeventpt' + '/';
  apiBaseUrlWithEntityDmeContext = this.configService.configData.apiBaseUrl + 'api/v1/adverseeventdme' + '/';
  apiBaseUrlWithEntityCvmContext = this.configService.configData.apiBaseUrl + 'api/v1/adverseeventcvm' + '/';

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getAdverseEventPt(
    order: string,
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam,
    adverseEventType?: string,
  ): Observable<PagingResponse<AdverseEventPt>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    if (order != null && order !== '') {
      params = params.append('order', order);
    }

    /*
    let selectedTypeContext = this.apiBaseUrlWithEntityPtContext;

    if (adverseEventType) {
      if (adverseEventType === 'pt') {
        selectedTypeContext = this.apiBaseUrlWithEntityPtContext;
      } else if (adverseEventType === 'dme') {
        selectedTypeContext = this.apiBaseUrlWithEntityDmeContext;
      } else if (adverseEventType === 'cvm') {
        selectedTypeContext = this.apiBaseUrlWithEntityCvmContext;
      }
    }
    */
    const url = this.apiBaseUrlWithEntityPtContext + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<AdverseEventPt>>(url, options);
  }

  getAdverseEventDme(
    order: string,
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam,
    adverseEventType?: string,
  ): Observable<PagingResponse<AdverseEventDme>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    if (order != null && order !== '') {
      params = params.append('order', order);
    }

    const url = this.apiBaseUrlWithEntityDmeContext + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<AdverseEventDme>>(url, options);
  }

  getAdverseEventCvm(
    order: string,
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam,
    adverseEventType?: string,
  ): Observable<PagingResponse<AdverseEventCvm>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    if (order != null && order !== '') {
      params = params.append('order', order);
    }

    const url = this.apiBaseUrlWithEntityCvmContext + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<AdverseEventCvm>>(url, options);
  }

  getAdverseEventPtFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = `${this.configService.configData.apiBaseUrl}api/v1/adverseeventpt/search/@facets?wait=false&kind=gov.hhs.gsrs.adverseevents.adverseeventpt.models.AdverseEventPt&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }

  getAdverseEventDmeFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = `${this.configService.configData.apiBaseUrl}api/v1/adverseeventdme/search/@facets?wait=false&kind=gov.hhs.gsrs.adverseevents.adverseeventdme.models.AdverseEventDme&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }

  getAdverseEventCvmFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = `${this.configService.configData.apiBaseUrl}api/v1/adverseeventcvm/search/@facets?wait=false&kind=gov.hhs.gsrs.adverseevents.adverseeventcvm.models.AdverseEventCvm&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }

  exportBrowseApplicationsUrl(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): string {
    let params = new FacetHttpParams();
    //  params = params.append('skip', skip.toString());
    //  params = params.append('top', '1000');
    params = params.append('page', '1');
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    const url = this.baseUrl + 'exportApplications?' + params;
    const options = {
      params: params
    };

    return url;
  }

  getAdverseEventSearchSuggestions(searchTerm: string, eventCategory: string): Observable<SubstanceSuggestionsGroup> {
    if (eventCategory && eventCategory === 'adverseEventPtSearch') {
      return this.http.get<SubstanceSuggestionsGroup>(this.apiBaseUrlWithEntityPtContext + 'suggest?q=' + searchTerm);
    } else if (eventCategory && eventCategory === 'adverseEventDmeSearch') {
      return this.http.get<SubstanceSuggestionsGroup>(this.apiBaseUrlWithEntityDmeContext + 'suggest?q=' + searchTerm);
    } else if (eventCategory && eventCategory === 'adverseEventCvmSearch') {
      return this.http.get<SubstanceSuggestionsGroup>(this.apiBaseUrlWithEntityCvmContext + 'suggest?q=' + searchTerm);
    } else {
      return null;
    }
  }

  getSubstanceAdverseEventPt(
    bdnum: string, page: number, pageSize: number, orderBy: string, ascDescDir: string
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'adverseEventPtListByBdnum?bdnum=' + bdnum + '&page=' + (page + 1) + '&pageSize='
      + pageSize + '&orderBy=' + orderBy + '&ascDescDir=' + ascDescDir;

    return this.http.get<Array<any>>(url)
      .pipe(
        map(results => {
          this.totalRecords = results['totalRecords'];
          return results['data'];
        })
      );
  }

  getSubstanceAdverseEventPtAdv(
    bdnum: string, page: number, pageSize: number, orderBy: number, ascDescDir: string
  ): Observable<Array<any>> {
    const orderByParam = 'order[0][column]=' + orderBy;
    const ascDescDirParam = 'order[0][dir]=' + ascDescDir;
    const start = 'start=' + '0';
    const length = 'length=' + pageSize;
    const url = this.baseUrl + 'advSearchResult?searchCategory=adversept&searchBy=bdnum&matchType=IN&q=' + bdnum + '&disp=d&dispFrom=detail&' + start + '&' + length + '&' + orderByParam + '&' + ascDescDirParam;

    // const url = this.baseUrl + 'adverseEventPtListByBdnum?bdnum=' + bdnum + '&page=' + (page + 1) + '&pageSize='
    // + pageSize + '&orderBy=' + orderBy + '&ascDescDir=' + ascDescDir;

    return this.http.get<Array<any>>(url)
      .pipe(
        map(results => {
          this.totalRecords = results['recordsTotal'];
          return results['data'];
        })
      );
  }

  getSubstanceAdverseEventDme(
    bdnum: string, page: number, pageSize: number
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'adverseEventDmeListByBdnum?bdnum=' + bdnum + '&page=' + (page + 1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url)
      .pipe(
        map(results => {
          this.totalRecords = results['totalRecords'];
          return results['data'];
        })
      );

  }

  getSubstanceAdverseEventCvm(
    bdnum: string, page: number, pageSize: number
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'adverseEventCvmListByBdnum?bdnum=' + bdnum + '&page=' + (page + 1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url)
      .pipe(
        map(results => {
          this.totalRecords = results['totalRecords'];
          return results['data'];
        })
      );

  }

  getFaersDashboardRecordByName(
    name: string
  ): Observable<any> {
    const url = this.apiBaseUrlWithEntityPtContext + 'faersdashboard/' + name;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getApiExportUrlPt(etag: string, extension: string): string {
    const url = this.apiBaseUrlWithEntityPtContext + 'export/' + etag + '/' + extension;
    return url;
  }

  getApiExportUrlDme(etag: string, extension: string): string {
    const url = this.apiBaseUrlWithEntityDmeContext + 'export/' + etag + '/' + extension;
    return url;
  }

  getApiExportUrlCvm(etag: string, extension: string): string {
    const url = this.apiBaseUrlWithEntityCvmContext + 'export/' + etag + '/' + extension;
    return url;
  }

  getAdverseEventPtListExportUrl(bdnum: string): string {
    return this.baseUrl + 'adverseEventPtListExport?bdnum=' + bdnum;
  }

  getAdverseEventDmeListExportUrl(bdnum: string): string {
    return this.baseUrl + 'adverseEventDmeListExport?bdnum=' + bdnum;
  }

  getAdverseEventCvmListExportUrl(bdnum: string): string {
    return this.baseUrl + 'adverseEventCvmListExport?bdnum=' + bdnum;
  }

} // class
