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
import { InvitroAssayScreening } from '../model/invitro-pharmacology.model';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class InvitroPharmacologyService extends BaseHttpService {

  private _bypassUpdateCheck = false;
  totalRecords = 0;
  assayScreening: InvitroAssayScreening;

  apiBaseUrlWithInvitroPharmEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/assayscreening' + '/';

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
  ): Observable<PagingResponse<InvitroAssayScreening>> {
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

    return this.http.get<PagingResponse<InvitroAssayScreening>>(url, options);
  }

  getInvitroPharmacologyFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = this.apiBaseUrlWithInvitroPharmEntityUrl + `search/@facets?wait=false&kind=gov.hhs.gsrs.invitropharmacology.models.AssayScreening&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    alert(url);
    return this.http.get<FacetQueryResponse>(url);
  }

  filterFacets(name: string, category: string): Observable<any> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + `search/@facets?wait=false&kind=gov.hhs.gsrs.invitropharmacology.models.AssayScreening&skip=0&fdim=200&sideway=true&field=${category}&top=14448&fskip=0&fetch=100&order=%24lastUpdated&ffilter=${name}`;
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

  getApiExportUrl(etag: string, extension: string): string {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'export/' + etag + '/' + extension;
    return url;
  }

  getInvitroPharmacologySearchSuggestions(searchTerm: string): Observable<SubstanceSuggestionsGroup> {
    return this.http.get<SubstanceSuggestionsGroup>(this.apiBaseUrlWithInvitroPharmEntityUrl + 'suggest?q=' + searchTerm);
  }


  // Initialize or load data in In-vitro Pharmacology Object
  loadAssayScreening(assayScreening?: InvitroAssayScreening): void {
    // if Update/Exist Assay Screening
    if (assayScreening != null) {
      this.assayScreening = assayScreening;
    } else {
      this.assayScreening = {
        invitroApprovers: {},
        invitroLaboratories: {}
      };
    }
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

  saveAssayScreening(): Observable<InvitroAssayScreening> {
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl;
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    // Update Product
    if ((this.assayScreening != null) && (this.assayScreening.id)) {
      return this.http.put<InvitroAssayScreening>(url, this.assayScreening, options);
    } else {
      // Save New Product
      return this.http.post<InvitroAssayScreening>(url, this.assayScreening, options);
    }
  }

  bypassUpdateCheck(): void {
    this._bypassUpdateCheck = true;
  }

}
