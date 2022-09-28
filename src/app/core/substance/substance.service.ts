import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpClientJsonpModule, HttpParameterCodec } from '@angular/common/http';
import { Observable, Observer, Subject } from 'rxjs';
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
import { PagingResponse, ShortResult } from '../utils/paging-response.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FacetParam } from '../facets-manager/facet.model';
import { FacetHttpParams } from '../facets-manager/facet-http-params';
import { UtilsService } from '../utils/utils.service';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ValidationResults} from '@gsrs-core/substance-form/substance-form.model';
import {Facet, FacetQueryResponse} from '@gsrs-core/facets-manager';
import { StructuralUnit } from '@gsrs-core/substance';
import {HierarchyNode} from '@gsrs-core/substances-browse/substance-hierarchy/hierarchy.model';
import { stringify } from 'querystring';
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
@Injectable({
  providedIn: 'root'
})
export class SubstanceService extends BaseHttpService {
  private searchKeys: { [structureSearchTerm: string]: string } = {};
  public showDeprecated = false;
  private resultEmitter = new Subject<any>();
  showImagePopup = new Subject<boolean>();
  imagePopupUnit = new Subject<StructuralUnit>();
  private searchResult: any;
  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
  ) {
    super(configService);
  }

  get searchResults(): Observable<ShortResult> {
    return new Observable(observer => {
      if (!this.searchResult) {
        this.searchResult = { etag: '', uuids: [], total: 0};
      }
      observer.next(this.searchResult);
      this.resultEmitter.subscribe(sites => {
        observer.next(this.searchResult);
      });
    });
  }

  setResult(result: string, content: Array<any>, total: number) {
    const uuid = [];
    if (content && content.length > 0) {
      content.forEach(substance => {
          uuid.push(substance.uuid);
      });
    }
    this.searchResult = {etag: result, uuids: uuid, total: total };
    this.resultEmitter.next(this.searchResult);
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
    sequenceSearchKey?: string,
    deprecated?: boolean
  } = {}): Observable<PagingResponse<SubstanceSummary>> {
    if (args.deprecated) {
      this.showDeprecated = true;
    } else {
      this.showDeprecated = false;
    }
    return new Observable(observer => {
      if (args.structureSearchTerm != null && args.structureSearchTerm !== '') {
        this.searchSubstanceStructures(
          args.structureSearchTerm,
          args.searchTerm,
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
      } else if ((args.sequenceSearchKey != null && args.sequenceSearchKey !== '') ||
      (args.sequenceSearchTerm != null && args.sequenceSearchTerm !== '')) {
        this.searchSubstanceSequences(
          args.sequenceSearchTerm,
          args.sequenceSearchKey,
          args.searchTerm,
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

    let params = new FacetHttpParams({encoder: new CustomEncoder()});
    let url = this.apiBaseUrl;

    url += 'substances/search';
    if (searchTerm != null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets, this.showDeprecated);

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
    querySearchTerm?: string,
    cutoff?: number,
    type: string = 'substructure',
    pageSize: number = 10,
    facets?: FacetParam,
    order?: string,
    skip: number = 0,
    sync: boolean = false
  ): Observable<PagingResponse<SubstanceSummary>> {
    return new Observable(observer => {
      let params = new FacetHttpParams({encoder: new CustomEncoder()});
      let url = this.apiBaseUrl;
      let structureFacetsKey: number;
      structureFacetsKey = this.utilsService.hashCode(searchTerm, type, cutoff);

      if (type && (type === 'flex' || type === 'exact')) {
        sync = true;
      }
      if (!sync && this.searchKeys[structureFacetsKey]) {
        url += `status(${this.searchKeys[structureFacetsKey]})/results`;
        params = params.appendFacetParams(facets, this.showDeprecated);
        if(querySearchTerm.length > 0) {
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
        params = params.append('q', (searchTerm));
        if (type) {
          params = params.append('type', type);
          if (type === 'similarity') {
            cutoff = cutoff || 0;
            params = params.append('cutoff', cutoff.toString());
          }
        }
        if (sync) {
          // Do text search along with Exact and Flex Structure search
          if (querySearchTerm) {
            params = params.append('qText', querySearchTerm);
          }
          params = params.append('sync', sync.toString());
          params = params.appendFacetParams(facets, this.showDeprecated);
          params = params.appendDictionary({
            top: pageSize.toString(),
            skip: skip.toString()
          });
          if (order != null && order !== '') {
            params = params.append('order', order);
          }
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
              querySearchTerm,
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
    querySearchTerm?: string,
    cutoff: number = 0.5,
    type?: string,
    seqType?: string,
    pageSize: number = 10,
    facets?: FacetParam,
    order?: string,
    skip: number = 0,
    sync: boolean = true
  ): Observable<PagingResponse<SubstanceSummary>> {
    return new Observable(observer => {
      let params = new FacetHttpParams({encoder: new CustomEncoder()});
      let url = this.apiBaseUrl;
      let structureFacetsKey;

      structureFacetsKey = this.utilsService.hashCode(searchTerm, cutoff, type, seqType);
      if ((searchKey && searchKey.length > 30) || (!sync && this.searchKeys[structureFacetsKey])) {
        if (!sync && this.searchKeys[structureFacetsKey]) {
          url += `status(${this.searchKeys[structureFacetsKey]})`;
        } else {
          url += `status(${searchKey})`;
        }
        params = params.appendFacetParams(facets, this.showDeprecated);
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
              querySearchTerm,
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
    querySearchTerm: string,
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
      querySearchTerm,
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
                querySearchTerm,
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
    querySearchTerm: string,
    structureSearchKey: string,
    pageSize?: number,
    facets?: FacetParam,
    skip?: number,
    view?: string
  ): any {
    const url = `${this.apiBaseUrl}status(${structureSearchKey})/results`;
    let params = new FacetHttpParams({encoder: new CustomEncoder()});

    params = params.appendFacetParams(facets, this.showDeprecated);

    // remove this when async backend issue is fixed
    const random_key = Math.random().toString(36).replace('0.', '');
    params = params.appendFacetParams({ facet: { isAllMatch: false, params: { cache: false } } }, this.showDeprecated);

    params = params.appendDictionary({
      top: pageSize.toString(),
      skip: skip.toString(),
      view: view || ''
    });

    // Added for 3.0.2, Advanced Search:Combine structure Search with query search.
    if (querySearchTerm != null && querySearchTerm !== '') {
      params = params.append('q', querySearchTerm);
    }

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

    let params = new FacetHttpParams({encoder: new CustomEncoder()});

    let url = this.apiBaseUrl + 'substances/';

    if (searchTerm) {
      params = params.append('q', searchTerm);
    }

    if (searchTerm != null || getFacets === true) {
      url += 'search';
    }

    if (facets != null) {
      params = params.appendFacetParams(facets, this.showDeprecated);
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceSummary>>(url, options);
  }

  searchSingleFacet(name: string, value: string) {
    const url = this.apiBaseUrl + 'substances/search?facet=' + name + '/' + value;
    return this.http.get<any>(url);
  }

  searchSingleFacetSimpleCount(name: string, value: string) {
    const url = this.apiBaseUrl + 'substances/search?facet=' + name + '/' + value + '&simpleSearchOnly=true&fdim=0&top=1&view=key';
    return this.http.get<any>(url);
  }

  searchFromString(value: string) {
    const url = this.apiBaseUrl + 'substances/search?' + value;
    return this.http.get<PagingResponse<SubstanceSummary>>(url);
  }

  getRecordCount() {
    const url = this.apiBaseUrl + 'substances/@count';
    return this.http.get<any>(url);
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
    params = params.append('view', 'internal');
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

  saveSubstance(substance: SubstanceDetail, type?: string): Observable<SubstanceDetail> {
    const url = `${this.apiBaseUrl}substances?view=internal`;
    let method = substance.uuid ? 'PUT' : 'POST';
    if (type && type === 'import') {
      method = 'POST';
    }
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

  approveSubstance(keyid: string): Observable<any> {
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
      const link3 = 'substances/' + oid[oid.length - 1];
      return link3;
    } else {
      return link;
    }
  }

  getPrimaryCode(reference: SubstanceRelated , codeSystem: string): Observable<string> {
    //TODO: may need to url-encode some codeSystems for spaces/hyphens
    const refuuid = `${this.apiBaseUrl}substances(${reference.refuuid })/codes(codeSystem:` + codeSystem + `)(type:PRIMARY)($0)/code`;
    const refPname = `${this.apiBaseUrl}substances(${ reference.refPname  })/codes(codeSystem:` + codeSystem + `)(type:PRIMARY)($0)/code`;
        return this.http.get<any>(refuuid).pipe(
          catchError(error => this.http.get(refPname))
        );
  }
  getPrimaryConfigCode(reference: SubstanceRelated): Observable<string> {
    let cs: string;
    //TODO: need to establish the config name, and how to deal with default values
    cs = this.configService.configData && this.configService.configData.primaryCode ? this.configService.configData.primaryCode : 'BDNUM';
    return this.getPrimaryCode(reference, cs);
  }


  getBDNUM(reference: SubstanceRelated ): Observable<string> {
    const refuuid = `${this.apiBaseUrl}substances(${reference.refuuid })/codes(codeSystem:BDNUM)(type:PRIMARY)($0)/code`;
    const refPname = `${this.apiBaseUrl}substances(${ reference.refPname  })/codes(codeSystem:BDNUM)(type:PRIMARY)($0)/code`;
        return this.http.get<any>(refuuid).pipe(
          catchError(error => this.http.get(refPname))
        );
  }


  test(): Observable<any> {
    const refuuid = `${this.apiBaseUrl}substances/search?acets=Substance Class*chemical.true&top=10&skip=0&order=$root_lastEdited&fdim=10`;

    return this.http.get<any>(refuuid);
  }
  getSubstanceFacets(facet: Facet, searchTerm?: string, nextUrl?: string, pageQuery?: string, otherFacets?: string): Observable<FacetQueryResponse> {
    let url: string;

    if (searchTerm) {
      url = `${this.configService.configData.apiBaseUrl}api/v1/substances/search/@facets?wait=false&kind=ix.ginas.models.v1.Substance&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
      if(pageQuery) {
        url += `&q=${pageQuery}`;
      }
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }


  getSubstanceReferences(top: number = 10, user: string): Observable<any> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/references/search?top=${top}&order=$lastEdited&q=root_lastEditedBy:"${user}" AND NOT (root_docType:SYSTEM)  AND NOT (root_docType:BDNUM)`;
    return this.http.get< any>(url);
  }

  hasInxightLink(ID: string): Observable<any> {
    const url = `https://drugs.ncats.io/api/v1/substances/search?q=root_approvalID:${ID}&fdim=1`;
    return this.http.jsonp(url, 'callback' );

  }

  getExportOptions(etag: string, search?: string): Observable<any> {
    if (!search) {
      search = 'substances';
    }
    const url = `${this.configService.configData.apiBaseUrl}api/v1/${search}/export/${etag}`;
    return this.http.get< any>(url);
  }

  getTags(): Observable<Array<string>> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/search/@facets?kind=ix.ginas.models.v1.Substance&fdim=999999&sideway=true&field=GInAS+Tag`;
    return this.http.get<any>(url).pipe(
      map(response => {
        return response.content.map(item => item.label).sort();
      })
    );
  }

  getMixtureParent(id: string) {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/search?q=root_mixture_components_substance_refuuid:"${id}"`;
    return this.http.get< any>(url);
  }
  getConstituentParent(id: string) {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/search?q=root_specifiedSubstance_constituents_substance_refuuid:"${id}"`;
    return this.http.get< any>(url);
  }


  getSchema(type?: string) {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/export/scrubber/@schema`;
    return this.http.get< any>(url);
  }

  getConfigs(id?: string) {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/export/configs`;
    return this.http.get< any>(url);
  }

  getConfigByID(id: string) {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/export/config/${id}`;
    return this.http.get< any>(url);
  }

  storeNewConfig(config: any) {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/export/config`;
    console.log(config);
    return this.http.post< any>(url, config);
  }

  deleteConfig(id: string) {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/export/config(${id})`;
    console.log(id);
    return this.http.delete< any>(url);
  }
}




