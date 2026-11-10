import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Observable, of, throwError } from 'rxjs';
import { concatMap, map, switchMap, take, tap } from 'rxjs/operators';

/* GSRS Core Imports */
import { BaseHttpService } from '@gsrs-core/base';
import { ConfigService } from '@gsrs-core/config';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { PagingResponse } from '@gsrs-core/utils';
import { Facet, FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { SubmitSuccessDialogComponent } from '@gsrs-core/substance-form/submit-success-dialog/submit-success-dialog.component';

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
  apiBaseUrlWithInvitroPharmEntityUrl: string;

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    public utilsService: UtilsService,
    public authService: AuthService,
    private dialog: MatDialog,
    private router: Router,
    private overlayContainerService: OverlayContainer
  ) {
    super(configService);
    // Initialize fields that depend on configService
    this.apiBaseUrlWithInvitroPharmEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/' + this.invitroPharmEntityEndpoint + '/';
  }

  get isPfdaVersion(): boolean {
    return !!(this.configService.configData && this.configService.configData.isPfdaVersion);
  }

  // False when loadedComponents.invitropharmacologydata is false: no in-vitro data and no backend is deployed, so the
  // data views are hidden and the forms work without backend calls (empty lookups, client-side validation).
  get isDataEnabled(): boolean {
    const loadedComponents = this.configService.configData && this.configService.configData.loadedComponents;
    return !loadedComponents || loadedComponents.invitropharmacologydata !== false;
  }

  // Sends an In Vitro Pharmacology save request. 'endpoint' is relative to the entity url, e.g.
  // '' (assay), 'screening', 'saveBulkAssays' or '<assayId>/screening'.
  //
  // precisionFDA only: the GSRS in-vitro pharmacology database is read-only. Every save is
  // intercepted by the pFDA platform, which stores the submitted JSON as a file in the user's
  // My Home area and returns a 'fileUrl' instead of the saved entity. Saving requires an
  // authenticated pFDA user, so anonymous users are prompted to log in (popup) first.
  sendSave<T>(method: 'PUT' | 'POST', endpoint: string, body: any): Observable<T> {
    const options = {
      body: body,
      params: new HttpParams(),
      headers: {
        'Content-type': 'application/json'
      }
    };

    if (!this.isPfdaVersion) {
      return this.http.request<T>(method, this.apiBaseUrlWithInvitroPharmEntityUrl + endpoint, options);
    }

    // No trailing slash, the pFDA platform routes these exact paths to its own file-upload endpoint
    const pfdaUrl = this.configService.configData.apiBaseUrl + 'api/v1/' + this.invitroPharmEntityEndpoint
      + (endpoint ? '/' + endpoint : '');

    return this.authService.getAuth().pipe(
      // getAuth() is a BehaviorSubject that never completes. Taking a single value prevents the
      // auth update emitted by a successful pfdaLogin() from queueing a second save request.
      take(1),
      concatMap(auth =>
        auth
          ? this.http.request<T>(method, pfdaUrl, options)
          : this.authService.pfdaLogin().pipe(
            concatMap(success =>
              success
                ? this.http.request<T>(method, pfdaUrl, options)
                : throwError(() => ({
                  type: 'AUTH',
                  message: 'Authentication failed',
                }))
            )
          )
      )
    );
  }

  // precisionFDA only: the 'fileUrl' returned when a save was stored as a pFDA file, otherwise null.
  getPfdaFileUrl(response: any): string {
    return (this.isPfdaVersion && response && response.fileUrl) ? response.fileUrl : null;
  }

  // precisionFDA only: text of the submit button, anonymous users are asked to log in on submit.
  getSubmitButtonText(dismissAll: boolean): string {
    const parts = [];
    if (dismissAll) {
      parts.push('Dismiss all');
    }
    if (this.isPfdaVersion && !this.authService.getUser()) {
      parts.push('Login');
    }
    parts.push('Submit');
    if (parts.length === 1) {
      return parts[0];
    }
    return parts.slice(0, -1).join(', ') + ' and ' + parts[parts.length - 1];
  }

  // precisionFDA only: message shown when an anonymous user cancels or fails the login popup.
  getPfdaLoginRequiredMessage(recordLabel: string): string {
    return 'You need to be logged in to precisionFDA to submit ' + recordLabel + '.';
  }

  // precisionFDA only: confirms the record was saved as a file on the pFDA platform and offers a
  // link to that file.
  openPfdaSaveSuccessDialog(fileUrl: string, recordLabel: string): void {
    this.bypassUpdateCheck();
    const overlayContainer = this.overlayContainerService.getContainerElement();
    const dialogRef = this.dialog.open(SubmitSuccessDialogComponent, {
      data: {
        isCoreSubstance: 'true',
        type: 'submit',
        fileUrl: fileUrl,
        dialogTitle: 'In Vitro Pharmacology ' + recordLabel + ' Saved',
        dialogMessage: 'The in vitro pharmacology ' + recordLabel.toLowerCase()
          + ' was saved successfully as a file in your pFDA My Home area.',
        viewLabel: 'View ' + recordLabel + ' File',
        hideBrowse: !this.isDataEnabled
      },
      disableClose: true
    });
    overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
      overlayContainer.style.zIndex = null;
      if (response === 'viewInPfda') {
        // View the submitted file in the user's precisionFDA home
        window.location.assign(fileUrl);
      } else if (response === 'browse') {
        this.router.navigate(['/browse-invitro-pharm']);
      }
    });
  }

  // precisionFDA only: generates a random External Assay ID, for users who have no real one.
  generateExternalAssayId(): string {
    if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.floor(Math.random() * 16);
      return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
    });
  }

  // precisionFDA only: pFDA submissions are stored as files and never saved into GSRS, so there may be
  // no existing assays to pick from. The Screening and Summary forms let users enter an assay inline.
  createPfdaInlineAssay(): InvitroAssayInformation {
    return {
      _isPfdaInline: true,
      _assaySet: '',
      externalAssaySource: '',
      externalAssayId: '',
      assayTitle: '',
      invitroAssayAnalytes: [],
      invitroAssaySets: [],
      invitroAssayScreenings: []
    };
  }

  setPfdaInlineAssayTarget(assay: InvitroAssayInformation, substance: any, substanceKeyType: string): void {
    if (!assay || !substance) {
      return;
    }
    const useApprovalId = (substanceKeyType === 'APPROVAL_ID' || substanceKeyType === 'UNII') && substance.approvalID;
    assay.targetName = substance._name;
    assay.targetNameApprovalId = substance.approvalID;
    assay.targetNameSubstanceKey = useApprovalId ? substance.approvalID : substance.uuid;
    assay.targetNameSubstanceKeyType = useApprovalId ? substanceKeyType : 'UUID';
  }

  getPfdaInlineAssayValidationMessages(assay: InvitroAssayInformation, rowLabel: string, validateTarget = true): Array<string> {
    const messages = [];
    const isBlank = (value: string) => !value || value.trim().length === 0;
    if (isBlank(assay._assaySet)) {
      messages.push('Assay Set is required in ' + rowLabel);
    }
    if (isBlank(assay.externalAssaySource)) {
      messages.push('External Assay Source is required in ' + rowLabel);
    }
    if (isBlank(assay.externalAssayId)) {
      messages.push('External Assay ID is required in ' + rowLabel);
    }
    if (validateTarget && (isBlank(assay.targetName) || isBlank(assay.targetNameSubstanceKey))) {
      messages.push('Target Name is required in ' + rowLabel);
    }
    return messages;
  }

  // Converts the inline assay into the JSON shape of a GSRS assay (without the UI-only fields).
  toPfdaInlineAssayForSaving(assay: InvitroAssayInformation): InvitroAssayInformation {
    const assaySet = (assay._assaySet || '').trim();
    const saved: InvitroAssayInformation = { ...assay, invitroAssaySets: [{ assaySet: assaySet }] };
    delete saved._isPfdaInline;
    delete saved._assaySet;
    (saved.invitroAssayScreenings || []).forEach(screening => {
      if (screening) {
        screening.assaySet = assaySet;
      }
    });
    return saved;
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

  // Initialize or load data in In Vitro Pharmacology ASSAY ONLY
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

  // Initialize or load data in In Vitro Pharmacology ASSAY
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

  // Initialize or load data in In Vitro Pharmacology ASSAY
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
    if (!this.isDataEnabled) {
      return of([]);
    }
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allAssays';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllAssysByAssaySet(assaySet: string): Observable<any> {
    if (!this.isDataEnabled) {
      return of([]);
    }
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'assaysByAssaySets/' + assaySet;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllAssaySets(): Observable<any> {
    if (!this.isDataEnabled) {
      return of([]);
    }
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allAssaySets';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllReferences(): Observable<any> {
    if (!this.isDataEnabled) {
      return of([]);
    }
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allReferences';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllSponsors(): Observable<any> {
    if (!this.isDataEnabled) {
      return of([]);
    }
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allSponsors';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllSponsorSubmitters(): Observable<any> {
    if (!this.isDataEnabled) {
      return of([]);
    }
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allSponsorSubmitters';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllLaboratories(): Observable<any> {
    if (!this.isDataEnabled) {
      return of([]);
    }
    const url = this.apiBaseUrlWithInvitroPharmEntityUrl + 'allLaboratories';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getAllTestAgents(): Observable<any> {
    if (!this.isDataEnabled) {
      return of([]);
    }
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
    // Update existing In Vitro Pharmacology ASSAY (PUT) or save a new one (POST)
    const method = ((this.assay != null) && (this.assay.id)) ? 'PUT' : 'POST';
    return this.sendSave<InvitroAssayInformation>(method, '', this.assay);
  }

  saveAssayforScreening(): Observable<InvitroAssayInformation> {
    return this.sendSave<InvitroAssayInformation>('PUT', 'saveAssay', this.assay);
  }

  saveBulkAssays(bulkAssays: any): Observable<any> {
    // Add or Update In Vitro Pharmacology ASSAY in Bulk
    return this.sendSave<any>('PUT', 'saveBulkAssays', bulkAssays);
  }

  saveScreeningOnly(screening: any): Observable<InvitroAssayScreening> {
    // Update existing In Vitro Pharmacology SCREENING (PUT) or save a new one (POST)
    const method = ((screening != null) && (screening.id)) ? 'PUT' : 'POST';
    return this.sendSave<InvitroAssayScreening>(method, 'screening', screening);
  }

  saveScreening(screening: any, assayId: number): Observable<InvitroAssayScreening> {
    return this.sendSave<InvitroAssayScreening>('POST', assayId + '/screening', screening);
  }

  saveBulkScreenings(bulkScreenings: any): Observable<InvitroAssayInformation> {
    // Add or Update In Vitro Pharmacology ASSAY Screening in Bulk
    return this.sendSave<InvitroAssayInformation>('PUT', 'saveBulkScreenings', bulkScreenings);
  }

  validateAssay(): Observable<ValidationResults> {
    // Without in-vitro data the backend is not deployed, so the form validates client-side only (like impurities)
    if (!this.isDataEnabled) {
      return of({ valid: true, validationMessages: [] });
    }
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