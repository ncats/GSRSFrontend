import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

/* GSRS Core Imports */
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { Facet } from '@gsrs-core/facets-manager';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils/substance-suggestions-group.model';

/* GSRS Impurities Imports */
import {
  Impurities, ImpuritiesSubstance, ImpuritiesDetails, ImpuritiesTesting, ImpuritiesSolution,
  ImpuritiesSolutionTable, ImpuritiesAnalysis, ImpuritiesUnspecified, ImpuritiesResidualSolventsTest,
  ImpuritiesResidualSolvents, ImpuritiesInorganicTest, ImpuritiesInorganic, 
  ImpuritiesSpecificTest, ImpuritiesAdditionalRequirements, ImpuritiesTotal,
  ValidationResults, IdentityCriteria
} from '../model/impurities.model';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class ImpuritiesService extends BaseHttpService {

  private _bypassUpdateCheck = false;
  private impuritiesStateHash?: number;
  totalRecords: 0;
  impurities: Impurities;

  apiBaseUrlWithEntityContext: string;

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    public utilsService: UtilsService
  ) {
    super(configService);
    // Initialize fields that depend on configService
    this.apiBaseUrlWithEntityContext = this.configService.configData.apiBaseUrl + 'api/v1/impurities' + '/';
  }

  /* IMPURITIES BROWSER FUNCTIONS BEGIN */
  getImpurities(
    order: string,
    skip: number = 0,
    top: number = 10,
    searchTerm?: string,
    facets?: FacetParam,
    fdim: number = 10,
    bulkQID?: string,
    searchOnIdentifiers?: boolean,
    view?: string,
    viewfield?: string,
    facetlabel?: string,
    simpleSearchOnly?: boolean
  ): Observable<PagingResponse<Impurities>> {
    return new Observable(observer => {

      if (bulkQID != null && bulkQID.toString() != '') {
        // Perform bulk search
        /*this.productBulkSearch(
          searchTerm,
          bulkQID,
          searchOnIdentifiers,
          this.entity,
          top,
          facets,
          order,
          skip
        ).subscribe(response => {
          observer.next(response);
        }, error => {
          observer.error(error);
        }, () => {
          observer.complete();
        }); */

      } else {
        const url = this.apiBaseUrlWithEntityContext + 'search';

        let params = new FacetHttpParams();

        params = params.append('skip', skip.toString());
        params = params.append('top', top.toString());
        params = params.append('fdim', fdim.toString());

        if (view) {
          params = params.append('view', view); // setting view=key or full, faster result
        }

        if (viewfield) {
          params = params.append('viewfield', viewfield); // setting viewfield=id or facet, faster result
        }

        if (facetlabel) {
          params = params.append('facetlabel', facetlabel); // setting facetlabel=FDA UNII, faster result, no content
        }

        if (simpleSearchOnly) {
          params = params.append('simpleSearchOnly', simpleSearchOnly.toString()); // if setting simpleSearchOnly=true, do not return facets
        }

        if (searchTerm) {
          params = params.append('q', searchTerm);
        }

        params = params.appendFacetParams(facets);

        if (order) {
          params = params.append('order', order);
        }

        const options = {
          params: params
        };

        // Return Product search results
        return this.http.get<PagingResponse<Impurities>>(url, options).subscribe(
          response => {
            if (response) {
              observer.next(response);
              observer.complete();
            }
          }, error => {
            observer.error(error);
            observer.complete();
          });
      } // else search

    });  // Observable(observer) 
  }

  // This function is called when doing text search on the facet
  getImpuritiesFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = `${this.configService.configData.apiBaseUrl}api/v1/impurities/search/@facets?wait=false&kind=gov.hhs.gsrs.impurities.models.Impurities&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${searchTerm}`;
    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }

  getProductSearchSuggestions(searchTerm: string): Observable<SubstanceSuggestionsGroup> {
    return this.http.get<SubstanceSuggestionsGroup>(this.apiBaseUrlWithEntityContext + 'suggest?q=' + searchTerm);
  }

  getExportOptions(etag: string): Observable<any> {
    const url = this.apiBaseUrlWithEntityContext + `export/${etag}`;
    return this.http.get<any>(url);
  }

  /* IMPURITIES BROWSER FUNCTIONS END */
  /***************************************************** */

  get isImpuritiesUpdated(): boolean {
    const impuritiestring = JSON.stringify(this.impurities);
    if (this._bypassUpdateCheck) {
      this._bypassUpdateCheck = false;
      return false;
    } else {
      return this.impuritiesStateHash !== this.utilsService.hashCode(impuritiestring);
    }
  }

  bypassUpdateCheck(): void {
    this._bypassUpdateCheck = true;
  }

  getImpuritiesBySubstanceUuid(
    order: string,
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<any> {
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

    const options = {
      params: params
    };

    const query = 'search?q=root_impuritiesSubstanceList_substanceUuid:\"' + searchTerm + '"' +
      ' OR root_impuritiesSubstanceList_impuritiesTestList_impuritiesDetailsList_relatedSubstanceUuid:\"' + searchTerm + '"';
    const url = this.apiBaseUrlWithEntityContext + query;
    return this.http.get<Impurities>(url, options)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getImpuritiesByTestImpuritiesDetails(relatedSubstanceUuid: string): Observable<any> {
    const url = this.apiBaseUrlWithEntityContext + 'search?root_impuritiesSubstanceList_impuritiesTestList_impuritiesDetailsList_relatedSubstanceUuid:\"' + relatedSubstanceUuid + '"';
    return this.http.get<Impurities>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  searchImpurities(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<Impurities>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    const url = this.apiBaseUrlWithEntityContext + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<Impurities>>(url, options);
  }

  getApiExportUrl(etag: string, extension: string): string {
    const url = this.apiBaseUrlWithEntityContext + 'export/' + etag + '/' + extension;
    return url;
  }

  loadImpurities(impurities?: Impurities): void {
    // if Update/Exist Impurity
    if (impurities != null) {
      this.impurities = impurities;
    } else {
      this.impurities = {
        impuritiesSubstanceList: [],
        impuritiesAdditionalRequirements: {},
        impuritiesTotal: {}
      };
    }
  }

  getImpuritiesDetails(id: string): Observable<any> {
    const url = this.apiBaseUrlWithEntityContext + `${id}`;
    return this.http.get<Impurities>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  saveImpurities(): Observable<Impurities> {
    const url = this.apiBaseUrlWithEntityContext;
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    // Update Impurity
    if ((this.impurities != null) && (this.impurities.id)) {
      return this.http.put<Impurities>(url, this.impurities, options);
    } else {
      // Save New Impurities
      return this.http.post<Impurities>(url, this.impurities, options);
    }
  }

  validateImpurities(): Observable<ValidationResults> {
    return new Observable(observer => {
      this.validateImpur().subscribe(results => {
        observer.next(results);
        observer.complete();
      }, error => {
        observer.error();
        observer.complete();
      });
    });
  }

  validateImpur(): Observable<ValidationResults> {
    const url = this.apiBaseUrlWithEntityContext + '@validate';
    return this.http.post(url, this.impurities);
  }

  getJson() {
    return this.impurities;
  }

  addNewImpuritiesSubstance(): void {
    const newSubstance: ImpuritiesSubstance = { impuritiesTestList: [], impuritiesResidualSolventsTestList: [], impuritiesInorganicTestList: [], impuritiesSpecificTestList: [] };
    this.impurities.impuritiesSubstanceList.unshift(newSubstance);
  }

  addNewTest(impuritiesSubstanceIndex: number): void {
    const newTest: ImpuritiesTesting = { impuritiesSolutionList: [], impuritiesSolutionTableList: [], impuritiesAnalysisList: [], impuritiesDetailsList: [], impuritiesUnspecifiedList: [] };
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList.unshift(newTest);
  }

  addNewSolution(impuritiesSubstanceIndex: number, impuritiesTestIndex: number) {
    const newSolution: ImpuritiesSolution = {};
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex]
      .impuritiesTestList[impuritiesTestIndex]
      .impuritiesSolutionList.push(newSolution);
  }

  addNewSolutionTableDetails(impuritiesSubstanceIndex: number, impuritiesTestIndex: number) {
    const newSolutionTable: ImpuritiesSolutionTable = {};
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex]
      .impuritiesTestList[impuritiesTestIndex]
      .impuritiesSolutionTableList.push(newSolutionTable);
  }

  addNewImpuritiesAnalysis(impuritiesSubstanceIndex: number, impuritiesTestIndex: number): void {
    const newImpuritiesAnalysis: ImpuritiesAnalysis = {};
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex]
      .impuritiesTestList[impuritiesTestIndex]
      .impuritiesAnalysisList.unshift(newImpuritiesAnalysis);
  }

  addNewImpuritiesDetails(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesDetails: ImpuritiesDetails): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex]
      .impuritiesTestList[impuritiesTestIndex]
      .impuritiesDetailsList.unshift(impuritiesDetails);
  }

  addNewImpuritiesUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex: number): void {
    const newImpuritiesUnspec: ImpuritiesUnspecified = { identityCriteriaList: [] };
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex]
      .impuritiesUnspecifiedList.unshift(newImpuritiesUnspec);
  }

  addNewIdentityCriteriaUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex, impuritiesUnspecifiedIndex: number) {
    const newIdentityCriteria: IdentityCriteria = {};
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex]
      .impuritiesUnspecifiedList[impuritiesUnspecifiedIndex].identityCriteriaList.push(newIdentityCriteria);
  }

  addNewResidualSolventsTest(impuritiesSubstanceIndex: number): void {
    const newTest: ImpuritiesResidualSolventsTest = { impuritiesResidualSolventsList: [] };
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesResidualSolventsTestList.unshift(newTest);
  }

  addNewInorganicTest(impuritiesSubstanceIndex: number): void {
    const newTest: ImpuritiesInorganicTest = { impuritiesInorganicList: [] };
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesInorganicTestList.unshift(newTest);
  }

  addNewImpuritiesResidualSolvents(impuritiesSubstanceIndex: number, impuritiesResidualTestIndex: number): void {
    const newImpuritiesResidual: ImpuritiesResidualSolvents = {};

    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesResidualSolventsTestList[impuritiesResidualTestIndex].impuritiesResidualSolventsList.unshift(newImpuritiesResidual);
  }

  addNewImpuritiesInorganic(impuritiesSubstanceIndex: number, inorganicTestIndex: number): void {
    const newImpuritiesInorganic: ImpuritiesInorganic = {};

    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesInorganicTestList[inorganicTestIndex].impuritiesInorganicList.unshift(newImpuritiesInorganic);
  }

  addNewSpecificTest(impuritiesSubstanceIndex: number): void {
    const newSpecificTest: ImpuritiesSpecificTest = {};
    
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesSpecificTestList.unshift(newSpecificTest);
  }

  addNewImpuritiesTotal(): void {
    const newImpuritiesTotal: ImpuritiesTotal = {};
  }

  deleteImpurities(): Observable<any> {
    const url = this.apiBaseUrlWithEntityContext + this.impurities.id;
    const params = new HttpParams();
    const options = {
      params: params
    };
    const x = this.http.delete<Impurities>(url, options);
    return x;
  }

  deleteImpuritiesSubstance(impuritiesSubstanceIndex: number): void {
    this.impurities.impuritiesSubstanceList.splice(impuritiesSubstanceIndex, 1);
  }

  deleteImpuritiesTest(impuritiesSubstanceIndex: number, impuritiesTestIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList.splice(impuritiesTestIndex, 1);
  }

  deleteImpuritiesSolution(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, solutionIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex].impuritiesSolutionList.splice(solutionIndex, 1);
  }

  deleteImpuritiesSolutionTable(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, solutionTableIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex].impuritiesSolutionTableList.splice(solutionTableIndex, 1);
  }

  deleteImpuritiesAnalysis(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, analysisIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex]
      .impuritiesAnalysisList.splice(analysisIndex, 1);
  }

  deleteImpuritiesResdiualSolventTest(impuritiesSubstanceIndex: number, residualSolventsTestIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesResidualSolventsTestList.splice(residualSolventsTestIndex, 1);
  }

  deleteImpuritiesResidualSolvents(impuritiesSubstanceIndex: number, impuritiesResidualTestIndex: number, impuritiesResidualIndex: number): void {
    const impuritiesSub = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesResidualSolventsTestList[impuritiesResidualTestIndex];
    impuritiesSub.impuritiesResidualSolventsList.splice(impuritiesResidualIndex, 1);
  }

  deleteImpuritiesInorganicTest(impuritiesSubstanceIndex: number, impuritiesInorganicTestIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesInorganicTestList.splice(impuritiesInorganicTestIndex, 1);
  }

  deleteImpuritiesInorganic(impuritiesSubstanceIndex: number, impuritiesInorganicTestIndex: number, impuritiesInorganicIndex: number): void {
    const impuritiesSub = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesInorganicTestList[impuritiesInorganicTestIndex];
    impuritiesSub.impuritiesInorganicList.splice(impuritiesInorganicIndex, 1);
  }

  deleteImpuritiesDetails(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesDetailsIndex: number): void {
    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex]
      .impuritiesDetailsList.splice(impuritiesDetailsIndex, 1);
  }

  deleteIdentityCriteria(impuritiesSubstanceIndex: number, impuritiesTestIndex: number,
    impuritiesDetailsIndex: number, identityCriteriaIndex: number): void {
    const impuritiesTest = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex];
    impuritiesTest.impuritiesDetailsList[impuritiesDetailsIndex].identityCriteriaList.splice(identityCriteriaIndex, 1);
  }

  deleteImpuritiesUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex: number, impuritiesUnspecifiedIndex: number): void {
    const impuritiesTest = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex]
      .impuritiesTestList[impuritiesTestIndex];
    impuritiesTest.impuritiesUnspecifiedList.splice(impuritiesUnspecifiedIndex, 1);
  }

  deleteIdentityCriteriaUnspecified(impuritiesSubstanceIndex: number, impuritiesTestIndex: number,
    impuritiesUnspecifiedIndex: number, identityCriteriaIndex: number): void {
    const impuritiesTest = this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList[impuritiesTestIndex];
    impuritiesTest.impuritiesUnspecifiedList[impuritiesUnspecifiedIndex].identityCriteriaList.splice(identityCriteriaIndex, 1);
  }

  copyImpuritiesTest(impuritiesSubstanceIndex: number, impuritiesTest: ImpuritiesTesting): void {
    const newImpuritiesTest = JSON.parse(JSON.stringify(impuritiesTest));

    newImpuritiesTest.id = null;
    newImpuritiesTest.internalVersion = null;
    newImpuritiesTest.createdBy = null;
    newImpuritiesTest.creationDate = null;
    newImpuritiesTest.modifiedBy = null;
    newImpuritiesTest.createdBy = null;
    newImpuritiesTest.lastModifiedDate = null;

    newImpuritiesTest.impuritiesSolutionList.forEach(elementSolution => {
      if (elementSolution != null) {
        elementSolution.id = null;
        elementSolution.internalVersion = null;
        elementSolution.createdBy = null;
        elementSolution.creationDate = null;
        elementSolution.modifiedBy = null;
        elementSolution.lastModifiedDate = null;
      }
    });

    newImpuritiesTest.impuritiesSolutionTableList.forEach(elementSolutionTable => {
      if (elementSolutionTable != null) {
        elementSolutionTable.id = null;
        elementSolutionTable.internalVersion = null;
        elementSolutionTable.createdBy = null;
        elementSolutionTable.creationDate = null;
        elementSolutionTable.modifiedBy = null;
        elementSolutionTable.lastModifiedDate = null;
      }
    });

    newImpuritiesTest.impuritiesDetailsList.forEach(elementDetails => {
      if (elementDetails != null) {
        elementDetails.id = null;
        elementDetails.internalVersion = null;
        elementDetails.createdBy = null;
        elementDetails.creationDate = null;
        elementDetails.modifiedBy = null;
        elementDetails.lastModifiedDate = null;

        elementDetails.identityCriteriaList.forEach(elementIdentity => {
          if (elementIdentity != null) {
            elementIdentity.id = null;
            elementIdentity.internalVersion = null;
            elementIdentity.createdBy = null;
            elementIdentity.creationDate = null;
            elementIdentity.modifiedBy = null;
            elementIdentity.lastModifiedDate = null;
          }
        });
      }
    });

    newImpuritiesTest.impuritiesUnspecifiedList.forEach(elementUnspecified => {
      if (elementUnspecified != null) {
        elementUnspecified.id = null;
        elementUnspecified.internalVersion = null;
        elementUnspecified.createdBy = null;
        elementUnspecified.creationDate = null;
        elementUnspecified.modifiedBy = null;
        elementUnspecified.lastModifiedDate = null;

        elementUnspecified.identityCriteriaList.forEach(elementIdentity => {
          if (elementIdentity != null) {
            elementIdentity.id = null;
            elementIdentity.internalVersion = null;
            elementIdentity.createdBy = null;
            elementIdentity.creationDate = null;
            elementIdentity.modifiedBy = null;
            elementIdentity.lastModifiedDate = null;
          }
        });
      }

    });

    this.impurities.impuritiesSubstanceList[impuritiesSubstanceIndex].impuritiesTestList.unshift(newImpuritiesTest);
  }

  getSubstanceImpurities(
    substanceUuid: string, page: number, pageSize: number
  ): Observable<Array<any>> {

    const func = this.baseUrl + 'impuritiesListBySubstanceUuid?substanceUuid=';
    const url = func + substanceUuid + '&page=' + (page + 1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );
  }

  getRelationshipImpurity(
    substanceId: string
  ): Observable<any> {
    const url = this.apiBaseUrlWithEntityContext + 'subRelationship/' + substanceId;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getImpuritiesListExportUrl(substanceId: string): string {
    return this.baseUrl + 'impuritiesListExport?substanceId=' + substanceId;
  }

  getImpuritiesLists(): Observable<any> {
    const url = this.apiBaseUrlWithEntityContext + 'getImpuritiesLists';
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

} // class
