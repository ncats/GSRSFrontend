import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

/* GSRS Core Imports */
import { BaseHttpService } from '@gsrs-core/base';
import { ConfigService } from '@gsrs-core/config';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { PagingResponse } from '@gsrs-core/utils';
import { Facet, FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';

/* GSRS Invitro Pharmacology Imports */
import { InvitroAssayInformation, InvitroAssayAnalyte, InvitroAssayResult, InvitroAssayScreening, InvitroSummary, ValidationResults } from '../model/invitro-pharmacology.model';
import { identity } from 'lodash';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class InvitroPharmacologyService extends BaseHttpService {

  private _bypassUpdateCheck = false;
  private assayStateHash?: number;
  assay: InvitroAssayInformation;
  totalRecords = 0;

  invitroPharmEntityEndpoint = 'invitropharmacology';
  apiBaseUrlWithInvitroPharmEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/' + this.invitroPharmEntityEndpoint + '/';

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    public utilsService: UtilsService
  ) {
    super(configService);
  }

  getInvitroPharmacology(
    order: string,
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<InvitroAssayInformation>> {
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

    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<InvitroAssayInformation>>(url, options);
  }

  getInvitroPharmacologyFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = this.apiBaseUrlWithInvitroPharmEntityUrl + `search/@facets?wait=false&kind=gov.hhs.gsrs.invitropharmacology.models.InvitroAssayInformation&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }

  filterFacets(name: string, category: string): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + `search/@facets?wait=false&kind=gov.hhs.gsrs.invitropharmacology.models.InvitroAssayInformation&skip=0&fdim=200&sideway=true&field=${category}&top=14448&fskip=0&fetch=100&order=%24lastUpdated&ffilter=${name}`;
    return this.http.get(url);
  }

  retrieveFacetValues(facet: Facet): Observable<any> {
    const url = facet._self;
    return this.http.get<any>(url);
  }

  retrieveNextFacetValues(facet: Facet): Observable<any> {
    const url = facet._self;
    if (!facet.$next) {
      return this.http.get<any>(url).pipe(
        switchMap(response => {
          if (response) {
            const next = response.nextPageUri;
            return this.http.get<any>(next);
          } else {
            return 'nada';
          }
        }));
    } else {
      return this.http.get<any>(facet.$next);
    }

  }

  getAssayByTestCompound(
    order: string,
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<InvitroAssayInformation>> {
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

    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<InvitroAssayInformation>>(url, options);
  }

  getExportOptions(etag: string): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + `export/${etag}`;
    return this.http.get<any>(url);
  }

  getApiExportUrl(etag: string, extension: string): string {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'export/' + etag + '/' + extension;
    return url;
  }

  getInvitroPharmacologySearchSuggestions(searchTerm: string): Observable<SubstanceSuggestionsGroup> {
    return this.http.get<SubstanceSuggestionsGroup>(this.apiBaseUrlWithInvitroPharmEntityUrl + 'suggest?q=' + searchTerm);
  }

  // Initialize or load data in In-vitro Pharmacology ASSAY ONLY
  loadAssayOnly(assay?: InvitroAssayInformation): void {
    // if Update/Exist Assay
    if (assay != null) {
      this.assay = assay;

      //Delete the Screening Data Object, show only Assay data/Object
      delete this.assay.invitroAssayScreenings;
    } else {
      const newInvitroAssayInformation: InvitroAssayInformation = { invitroAssayAnalytes: [], invitroAssaySets: [] };
      this.assay = newInvitroAssayInformation;
    }
  }

  // Initialize or load data in In-vitro Pharmacology ASSAY
  loadAssay(assay?: InvitroAssayInformation): void {
    // if Update/Exist Assay
    if (assay != null) {
      this.assay = assay;
    } else {
      const newInvitroAssayInformation: InvitroAssayInformation =
      {
        invitroAssayAnalytes: [],
        invitroAssayScreenings: [{
          invitroAssayResultInformation: { invitroReferences: [], invitroLaboratory: {}, invitroSponsor: {}, invitroSponsorReport: { invitroSponsorSubmitters: [] }, invitroTestAgent: {} },
          invitroAssayResult: {},
          invitroControls: [{}],
          invitroSummary: {}
        }]
      };
      this.assay = newInvitroAssayInformation;
    }
  }

  // Initialize or load data in In-vitro Pharmacology ASSAY
  loadAssaySummaries(assay?: InvitroAssayInformation): void {
    // if Update/Exist Assay
    if (assay != null) {
      this.assay = assay;
    } else {
      const newInvitroAssayInformation: InvitroAssayInformation =
      {
        invitroAssayAnalytes: [],
        invitroAssayScreenings: [{
          invitroAssayResultInformation: { invitroReferences: [], invitroLaboratory: {}, invitroSponsor: {}, invitroSponsorReport: { invitroSponsorSubmitters: [] }, invitroTestAgent: {} },
          invitroAssayResult: {},
          invitroControls: [{}],
          invitroSummary: {}
        }]
      };
      this.assay = newInvitroAssayInformation;
    }
  }

  getAssayById(id: string): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + id;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAssayScreening(id: string): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + id;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAssaysByResultInfoId(id: string): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'assaysByResultInfoId/' + id;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllAssays(): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allAssays';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllAssysByAssaySet(assaySet: string): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'assaysByAssaySets/' + assaySet;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllAssaySets(): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allAssaySets';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllReferences(): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allReferences';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllSponsors(): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allSponsors';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllSponsorSubmitters(): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allSponsorSubmitters';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllLaboratories(): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allLaboratories';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllTestAgents(): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allTestAgents';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAssayByExternalAssay(externalAssaySource: string, externalAssayId: string): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'externalAssay/' + externalAssaySource + '/' + externalAssayId;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getByAssayTargetUnii(
    unii: string
  ): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'assaytargetunii/' + unii;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAssayByTestAgent(
    testAgent: string
  ): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'assayTestAgent/' + testAgent;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getTestAgentSummaries(
    testAgentId: string
  ): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'testAgentSummaries/' + testAgentId;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  saveAssay(): Observable<InvitroAssayInformation> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl;
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    // Update In-vitro Pharmacology ASSAY
    if ((this.assay != null) && (this.assay.id)) {
      return this.http.put<InvitroAssayInformation>(url, this.assay, options);
    } else {
      // Save New In-vitro Pharmacology ASSAY
      return this.http.post<InvitroAssayInformation>(url, this.assay, options);
    }
  }

  saveAssayforScreening(): Observable<InvitroAssayInformation> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + "saveAssay";
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    // Update In-vitro Pharmacology ASSAY
    //if ((this.assay != null) && (this.assay.id)) {
    return this.http.put<InvitroAssayInformation>(url, this.assay, options);
    //  } else {
    //    // Save New In-vitro Pharmacology ASSAY
    //    return this.http.post<InvitroAssayInformation>(url, this.assay, options);
    //  }
  }

  saveBulkAssays(bulkAssays: any): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + "saveBulkAssays";
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    // Add or Update In-vitro Pharmacology ASSAY in Bulk
    return this.http.put<any>(url, bulkAssays, options);
  }

  saveScreeningOnly(screening: any): Observable<InvitroAssayScreening> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'screening';
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    // Update In-vitro Pharmacology SCREENING
    if ((screening != null) && (screening.id)) {
      return this.http.put<InvitroAssayScreening>(url, screening, options);
    } else {
      // Save New In-vitro Pharmacology SCREENING
      return this.http.post<InvitroAssayScreening>(url, screening, options);
    }
  }

  saveScreening(screening: any, assayId: number): Observable<InvitroAssayScreening> {
    //Remove last slash /
    // let entityUrl = this.apiBaseUrlWithInvitroPharmEntityUrl.replace(/\/+$/, '');
    // const url = entityUrl + '(' + assayId + ')/screening';
    let url = this.apiBaseUrlWithInvitroPharmEntityUrl + assayId + '/screening';
    let params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    // Update In-vitro Pharmacology Screening
    //    if ((this.assay != null) && (this.assay.id)) {
    return this.http.post<InvitroAssayScreening>(url, screening, options);
    //   } else {
    // Save New In-vitro Pharmacology Screening
    //     return this.http.post<InvitroAssayScreening>(url, this.assay, options);
    //  }
  }

  saveBulkScreenings(bulkScreenings: any): Observable<InvitroAssayInformation> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + "saveBulkScreenings";
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    // Add or Update In-vitro Pharmacology ASSAY Screening in Bulk
    return this.http.put<InvitroAssayInformation>(url, bulkScreenings, options);
  }

  validateAssay(): Observable<ValidationResults> {
    return new Observable(observer => {
      this.validateAssayServer().subscribe(results => {
        observer.next(results);
        observer.complete();
      }, error => {
        observer.error();
        observer.complete();
      });
    });
  }

  validateAssayServer(): Observable<ValidationResults> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + '@validate';
    return this.http.post(url, this.assay);
  }

  addNewAssayAnalyte(): void {
    const newInvitroAssayAnalyte: InvitroAssayAnalyte = {};
    this.assay.invitroAssayAnalytes.push(newInvitroAssayAnalyte);
  }

  addNewScreening(): void {
    const newInvitroAssayScreening: InvitroAssayScreening =
    {
      invitroAssayResultInformation: { invitroReferences: [], invitroLaboratory: {}, invitroSponsor: {}, invitroSponsorReport: { invitroSponsorSubmitters: [] }, invitroTestAgent: {} },
      invitroAssayResult: {},
      invitroControls: [{}],
      invitroSummary: {}
    };
    this.assay.invitroAssayScreenings.push(newInvitroAssayScreening);
  }

  addNewSummary(): void {
    const newInvitroSummary: InvitroSummary = {};
    // this.assay.invitroSummaries.push(newInvitroSummary);
  }

  deleteAssay() {
    /*this.assay.invitroAssayScreenings.splice(screeningIndex, 1); */
  }

  deleteScreening(screeningIndex: number) {
    this.assay.invitroAssayScreenings.splice(screeningIndex, 1);
  }

  get isInvitroPharmacologyUpdated(): boolean {
    const invitroString = JSON.stringify(this.assay);
    if (this._bypassUpdateCheck) {
      this._bypassUpdateCheck = false;
      return false;
    } else {
      return this.assayStateHash !== this.utilsService.hashCode(invitroString);
    }
  }

  bypassUpdateCheck(): void {
    this._bypassUpdateCheck = true;
  }


  getReferenceFields(screening: InvitroAssayScreening): any {
    let referenceSourceType = '';
    let referenceSourceId = '';
    let referenceSourceTypeAndId = '';

    if (screening.invitroAssayResultInformation) {

      screening.invitroAssayResultInformation.invitroReferences.forEach(reference => {
        if (reference) {
          if (reference.primaryReference) {
            if (reference.primaryReference == true) {
              if (reference.sourceType) {
                referenceSourceType = reference.sourceType;
              }
              if (reference.sourceId) {
                referenceSourceId = reference.sourceId;
              }
              referenceSourceTypeAndId = referenceSourceType + ' ' + referenceSourceId;
            } // if primaryReference is true
          } // if primaryRefernce is not null
        }
      });
    }

    return referenceSourceTypeAndId;
  }

}