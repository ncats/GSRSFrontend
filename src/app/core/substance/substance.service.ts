import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpClientJsonpModule } from '@angular/common/http';
import { Observable, Observer } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { BaseHttpService } from '../base/base-http.service';
import {
  SubstanceSummary,
  SubstanceDetail,
  SubstanceEdit,
  SubstanceName,
  SubstanceCode,
  SubstanceRelationship,
  SubstanceRelated,
  SubstanceReference
} from './substance.model';
import { PagingResponse } from '../utils/paging-response.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FacetParam } from '../facets-manager/facet.model';
import { FacetHttpParams } from '../facets-manager/facet-http-params';
import { UtilsService } from '../utils/utils.service';
import { switchMap } from 'rxjs/operators';
import { ValidationResults} from '@gsrs-core/substance-form/substance-form.model';
import {Facet, FacetQueryResponse} from '@gsrs-core/facets-manager';
import {HierarchyNode} from '@gsrs-core/substances-browse/substance-hierarchy/hierarchy.model';
import { catchError } from 'rxjs/operators';
import { stringify } from 'querystring';

@Injectable({
  providedIn: 'root'
})
export class SubstanceService extends BaseHttpService {
  private searchKeys: { [structureSearchTerm: string]: string } = {};

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
  ) {
    super(configService);
  }

  getSubstancesSummaries(args: {
    searchTerm?: string,
    structureSearchTerm?: string,
    sequenceSearchTerm?: string,
    cutoff?: number,
    type?: string,
    seqType?: string,
    pageSize?: number,
    order?: string,
    facets?: FacetParam,
    skip?: number,
    sequenceSearchKey?: string
  } = {}): Observable<PagingResponse<SubstanceSummary>> {
    return new Observable(observer => {

      if (args.structureSearchTerm != null && args.structureSearchTerm !== '') {
        this.searchSubstanceStructures(
          args.structureSearchTerm,
          args.cutoff,
          args.type,
          args.pageSize,
          args.facets,
          args.order,
          args.skip
        ).subscribe(response => {
          observer.next(response);
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        });
      } else if ((args.sequenceSearchKey != null && args.sequenceSearchTerm !== '') ||
      (args.sequenceSearchTerm != null && args.sequenceSearchTerm !== '')) {
        this.searchSubstanceSequences(
          args.sequenceSearchTerm,
          args.sequenceSearchKey,
          args.cutoff,
          args.type,
          args.seqType,
          args.pageSize,
          args.facets,
          args.order,
          args.skip
        ).subscribe(response => {
          observer.next(response);
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        });
      } else {

        this.searchSubstances(
          args.searchTerm,
          args.pageSize,
          args.facets,
          args.order,
          args.skip
        ).subscribe(response => {
          observer.next(response);
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        });

      }
    });
  }


  searchSubstances(
    searchTerm?: string,
    pageSize: number = 10,
    facets?: FacetParam,
    order?: string,
    skip: number = 0
  ): Observable<PagingResponse<SubstanceSummary>> {

    let params = new FacetHttpParams();
    let url = this.apiBaseUrl;

    url += 'substances/search';
    if (searchTerm != null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    params = params.appendDictionary({
      top: pageSize && pageSize.toString(),
      skip: skip && skip.toString()
    });

    if (order != null && order !== '') {
      params = params.append('order', order);
    }
    params = params.append('fdim', '10');

    const options = {
      params: params
    };
    return this.http.get<PagingResponse<SubstanceSummary>>(url, options);
  }

  searchSubstanceStructures(
    searchTerm: string,
    cutoff?: number,
    type: string = 'substructure',
    pageSize: number = 10,
    facets?: FacetParam,
    order?: string,
    skip: number = 0,
    sync: boolean = false
  ): Observable<PagingResponse<SubstanceSummary>> {
    return new Observable(observer => {
      let params = new FacetHttpParams();
      let url = this.apiBaseUrl;
      let structureFacetsKey: number;

      structureFacetsKey = this.utilsService.hashCode(searchTerm, type, cutoff);

      if (!sync && this.searchKeys[structureFacetsKey]) {

        url += `status(${this.searchKeys[structureFacetsKey]})/results`;
        params = params.appendFacetParams(facets);
        params = params.appendDictionary({
          top: pageSize.toString(),
          skip: skip.toString()
        });
        if (order != null && order !== '') {
          params = params.append('order', order);
        }

      } else {
        params = params.append('q', searchTerm);
        if (type) {
          params = params.append('type', type);
          if (type === 'similarity') {
            cutoff = cutoff || 0;
            params = params.append('cutoff', cutoff.toString());
          }
        }
        if (sync) {
          params = params.append('sync', sync.toString());
        }
        url += 'substances/structureSearch';
      }

      const options = {
        params: params
      };

      this.http.get<any>(url, options).subscribe(
        response => {
          // call async
          if (response.results) {
            const resultKey = response.key;
            this.searchKeys[structureFacetsKey] = resultKey;
            this.processAsyncSearchResults(
              url,
              response,
              observer,
              resultKey,
              options,
              pageSize,
              facets,
              skip
            );
          } else {
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

  searchSubstanceSequences(
    searchTerm?: string,
    searchKey?: string,
    cutoff: number = 0.5,
    type?: string,
    seqType?: string,
    pageSize: number = 10,
    facets?: FacetParam,
    order?: string,
    skip: number = 0,
    sync: boolean = false
  ): Observable<PagingResponse<SubstanceSummary>> {
    return new Observable(observer => {
      let params = new FacetHttpParams();
      let url = this.apiBaseUrl;
      let structureFacetsKey;

      structureFacetsKey = this.utilsService.hashCode(searchTerm, cutoff, type, seqType);
      if ((searchKey && searchKey.length > 30) || (!sync && this.searchKeys[structureFacetsKey])) {
        if (!sync && this.searchKeys[structureFacetsKey]) {
          url += `status(${this.searchKeys[structureFacetsKey]})/results`;
        } else {
          url += `status(${searchKey})/results`;
        }
        params = params.appendFacetParams(facets);
        params = params.appendDictionary({
          top: pageSize.toString(),
          skip: skip.toString()
        });
        if (order != null && order !== '') {
          params = params.append('order', order);
        }

      } else {
        params = params.appendDictionary({
          q: searchTerm,
          type: type,
          cutoff: cutoff.toString(),
          seqType: seqType
        });

        if (sync) {
          params = params.append('sync', sync.toString());
        }
        url += 'substances/sequenceSearch';
      }

      const options = {
        params: params
      };
      this.http.get<any>(url, options).subscribe(
        response => {
          // call async
          if (response.results) {
            const resultKey = response.key;
            this.searchKeys[structureFacetsKey] = resultKey;
            this.processAsyncSearchResults(
              url,
              response,
              observer,
              resultKey,
              options,
              pageSize,
              facets,
              skip
            );
          } else {
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
    url: string,
    asyncCallResponse: any,
    observer: Observer<PagingResponse<SubstanceDetail>>,
    searchKey: string,
    httpCallOptions: any,
    pageSize?: number,
    facets?: FacetParam,
    skip?: number,
    view?: string
  ): void {
    this.getAsyncSearchResults(
      searchKey,
      pageSize,
      facets,
      skip,
      view
    )
      .subscribe(response => {
        observer.next(response);
        if (!asyncCallResponse.finished) {
          this.http.get<any>(url, httpCallOptions).subscribe(searchResponse => {
            setTimeout(() => {
              this.processAsyncSearchResults(
                url,
                searchResponse,
                observer,
                searchKey,
                httpCallOptions,
                pageSize,
                facets,
                skip,
                view
              );
            });
          }, error => {
            observer.error(error);
            observer.complete();
          });
        } else {
          observer.complete();
        }
      }, error => {
        observer.error(error);
        observer.complete();
      });

  }

  private getAsyncSearchResults(
    structureSearchKey: string,
    pageSize?: number,
    facets?: FacetParam,
    skip?: number,
    view?: string
  ): any {
    const url = `${this.apiBaseUrl}status(${structureSearchKey})/results`;
    let params = new FacetHttpParams();

    params = params.appendFacetParams(facets);

    // remove this when async backend issue is fixed
    const random_key = Math.random().toString(36).replace('0.', '');
    params = params.appendFacetParams({ facet: { isAllMatch: false, params: { cache: false } } });

    params = params.appendDictionary({
      top: pageSize.toString(),
      skip: skip.toString(),
      view: view || ''
    });

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceSummary>>(url, options);
  }

  getQuickSubstancesSummaries(
    searchTerm?: string,
    getFacets?: boolean,
    facets?: FacetParam
  ): Observable<PagingResponse<SubstanceSummary>> {

    let params = new FacetHttpParams();

    let url = this.apiBaseUrl + 'substances/';

    if (searchTerm) {
      params = params.append('q', searchTerm);
    }

    if (searchTerm != null || getFacets === true) {
      url += 'search';
    }

    if (facets != null) {
      params = params.appendFacetParams(facets);
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceSummary>>(url, options);
  }

  getFasta(id: string): Observable<any> {
    const url = `${this.configService.configData.apiBaseUrl}export/${id}.fas`;
    return this.http.get(url, { responseType: 'blob' as 'json' });
  }

  getSubstanceSummary(id: string): Observable<SubstanceSummary> {
    const url = `${this.apiBaseUrl}substances(${id})`;
    return this.http.get<any>(url);
  }

  getEdits(id: string): Observable<Array<SubstanceEdit>> {
    const url = `${this.apiBaseUrl}substances(${id})/@edits`;
    return this.http.get<Array<SubstanceEdit>>(url, { withCredentials: true });
  }

  getSubstanceDetails(id: string, version?: string): Observable<SubstanceDetail> {
    const url = `${this.apiBaseUrl}substances(${id})`;
    let params = new HttpParams();
    params = params.append('view', 'full');
    const options = {
      params: params
    };
    if (version) {

      const editurl = `${this.apiBaseUrl}substances(${id})/@edits`;

      return this.http.get<any>(editurl, { withCredentials: true }).pipe(
        switchMap(response => {
          response = response.filter(resp => resp.version === version);
          return this.http.get<SubstanceDetail>(response[0].oldValue, options);
        }));

    } else {
      return this.http.get<SubstanceDetail>(url, options);
    }
  }

  getSubstanceNames(id: string): Observable<Array<SubstanceName>> {
    const url = `${this.apiBaseUrl}substances(${id})/names`;
    return this.http.get<Array<SubstanceName>>(url);
  }

  getSubstanceCodes(id: string): Observable<Array<SubstanceCode>> {
    const url = `${this.apiBaseUrl}substances(${id})/codes`;
    return this.http.get<Array<SubstanceCode>>(url);
  }

  getSubstanceRelationships(id: string): Observable<Array<SubstanceRelationship>> {
    const url = `${this.apiBaseUrl}substances(${id})/relationships`;
    return this.http.get<Array<SubstanceRelationship>>(url);
  }

  checkVersion(id: string): any {
    const verurl = `${this.apiBaseUrl}substances(${id})/version`;
    return this.http.get<any>(verurl);
  }

  getSafeIconImgUrl(substance: SubstanceDetail , size?: number): SafeUrl {
    let imgUrl = `${this.configService.configData.apiBaseUrl}assets/ginas/images/noimage.svg`;
    const substanceType = substance.substanceClass;
    if ((substanceType === 'chemical') && (substance.structure.id)) {
      const structureId = substance.structure.id;
      imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg`;
    } else if ((substanceType === 'polymer') && (substance.polymer.displayStructure.id)) {
      const structureId = substance.polymer.displayStructure.id;
      imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg`;
    } else {
      imgUrl = `assets/images/${substanceType}.svg`;
    }

    if (size != null) {
      imgUrl += `?size=${size.toString()}`;
    }

    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  getIconFromUuid(uuid: string): SafeUrl {
    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${uuid}.svg`;
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);

  }

  saveSubstance(substance: SubstanceDetail): Observable<SubstanceDetail> {
    const url = `${this.apiBaseUrl}substances`;
    const method = substance.uuid ? 'PUT' : 'POST';
    const options = {
      body: substance
    };
    return this.http.request(method, url, options);
  }

  validateSubstance(substance: SubstanceDetail): Observable<ValidationResults> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/@validate`;
    return this.http.post(url, substance);
  }

  getHierarchy(id: string): Observable<Array<HierarchyNode>> {
    const url = `${this.apiBaseUrl}substances(${id})/@hierarchy`;
    return this.http.get<any>(url);
  }

  approveSubstance(keyid: string): Observable<ValidationResults> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances(${keyid})/@approve`;
    return this.http.get(url);
  }

  oldSiteRedirect(page: string, uuid: string) {
    let url = this.baseUrl + 'substance/' + uuid;
    if (page === 'edit') {
      url = url +  '/edit';
    }
  return url;
  }

  getSequenceByID(substance: string, unit: string, type: string): Observable<any> {
    const url = `${this.apiBaseUrl}substances(${substance})/${type}/subunits(uuid:${unit})`;
    return this.http.get<any>(url);
  }

  getSubstanceSequenceResults(
    searchTerm?: string,
    cutoff: number = 0.5,
    type?: string,
    seqType?: string,
  ): Observable<any> {
      let params = new FacetHttpParams();
      const url = this.apiBaseUrl + 'substances/sequenceSearch';

        params = params.appendDictionary({
          q: searchTerm,
          type: type,
          cutoff: cutoff.toString(),
          seqType: seqType
        });

     return this.http.post(url, params);
  }

  oldLinkFix(link: string): string {
    if (link && link.length > 10) {
      const oid = link.split('/');
      const link3 = this.baseUrl + 'beta/substances/' + oid[oid.length - 1];
      return link3;
    } else {
      return link;
    }
  }

  getBDNUM(reference: SubstanceRelated ): Observable<string> {
    const refuuid = `${this.apiBaseUrl}substances(${reference.refuuid })/codes(codeSystem:BDNUM)(type:PRIMARY)($0)/code`;
    const refPname = `${this.apiBaseUrl}substances(${ reference.refPname  })/codes(codeSystem:BDNUM)(type:PRIMARY)($0)/code`;
        return this.http.get<any>(refuuid).pipe(
          catchError(error => this.http.get(refPname))
        );
  }

  getSubstanceFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = `${this.configService.configData.apiBaseUrl}api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }


  getSubstanceReferences(top: number = 10, skip: number = 0): Observable<any> {

  const url = `${this.configService.configData.apiBaseUrl}api/v1/references?top=${top}&skip=${skip}&order=lastEdited`;
    return this.http.get< any>(url);
  }

  hasInxightLink(ID: string): Observable<any> {
    const url = `https://drugs.ncats.io/api/v1/substances/search?q=root_approvalID:${ID}&fdim=1`;
    return this.http.jsonp(url, 'callback' );

  }
}

