import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError, of } from 'rxjs';
import { switchMap, map, catchError, takeWhile } from 'rxjs/operators';

/* GSRS Core Imports */
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { SubstanceDetail, SubstanceSummary, SubstanceRelationship, SubstanceRelated } from '@gsrs-core/substance/substance.model';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';

import { Application } from '../application/model/application.model';

@Injectable()
export class GeneralService extends BaseHttpService {

  private apiBaseUrlWithApplicationEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applications' + '/';
  private NO_CONFIG_FOUND_DEFAULT_SUBSTANCE_KEY = "UUID";

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getSubstanceByAnyId(id: string): Observable<any> {
    const url = this.apiBaseUrl + 'substances(' + id + ')';
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceBySubstanceUuid(substanceUuid: string): Observable<any> {
    return this.getSubstanceByAnyId(substanceUuid);
  }

  getSubstanceKeyBySubstanceResolver(substance: SubstanceDetail, substanceKeyType: string): string {
    let substanceKey = '';

    if (substanceKeyType === 'UUID') {
      // If Substance Key Type is UUID in the frontend config, set value of Substance Key to Substance Uuid value
       return substance.uuid;
    } else if (substanceKeyType === 'APPROVAL_ID') {
      // If Substance Key Type is APPROVAL_ID in the frontend config, set value of Substance Key to Substance Approval ID value
      return substance.approvalID;
    } else if (substanceKeyType === 'BDNUM') {
      // If Substance Key Type is BDNUM in the frontend config, set value of Substance Key to Substance Bdnum/Code value

      // Get BDNUM from codes
      if (substance.codes.length > 0) {
        substance.codes.forEach((codeObj, index) => {
          if (codeObj) {
            if ((codeObj.codeSystem) && ((codeObj.codeSystem === 'BDNUM') && (codeObj.type === 'PRIMARY'))) {
              substanceKey = codeObj.code;
            }
          }
        });
      }
    } // else

    return substanceKey;
  }

  getSubstanceKeyByRelatedSubstanceResolver(relatedSubstance: SubstanceRelated, substanceKeyType: string): string {
    let substanceKey = '';

    // If Substance Key Type is UUID in the frontend config, set value of Substance Key to Substance Uuid value
    if (substanceKeyType === 'UUID') {
      substanceKey = relatedSubstance.refuuid;

      // If Substance Key Type is APPROVAL_ID in the frontend config, set value of Substance Key to Substance Approval ID value
    } else if (substanceKeyType === 'APPROVAL_ID') {
      substanceKey = relatedSubstance.approvalID;
    }

    return substanceKey;
  }

  getCodeBdnumBySubstanceUuid(substanceUuid: string): Observable<string> {
    let substanceKey = null;
    const url = this.apiBaseUrl + 'substances(' + substanceUuid + ')/codes';
    return this.http.get<any>(url).pipe(
      map(results => {
        if (results) {
          results.forEach((codeObj, index) => {
            if (codeObj) {

              if ((codeObj.codeSystem) && ((codeObj.codeSystem === 'BDNUM') && (codeObj.type === 'PRIMARY'))) {
                substanceKey = codeObj.code;
              }
            }
          });
        }
        return substanceKey;
      })
    );
  }

  getSubstanceCodesBySubstanceUuid(
    substanceUuid: string
  ): Observable<any> {
    const url = this.apiBaseUrl + 'substances(' + substanceUuid + ')/codes';
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceNamesBySubstanceUuid(substanceUuid: string): Observable<Array<any>> {
    const url = this.apiBaseUrl + 'substances(' + substanceUuid + ')/names';
    // const url = `${this.apiBaseUrl}substances(${substanceUuid})/names`;
    return this.http.get<Array<any>>(url);
  }

  getSubstanceRelationships(substanceUuid: string): Observable<Array<SubstanceRelationship>> {
    const url = `${this.apiBaseUrl}substances(${substanceUuid})/relationships`;
    return this.http.get<Array<SubstanceRelationship>>(url);
  }

  getSubstanceByName(
    searchTerm?: string,
    getFacets?: boolean,
    facets?: FacetParam
  ): Observable<PagingResponse<SubstanceSummary>> {
    let params = new FacetHttpParams();

    let url = this.apiBaseUrl + 'substances/';

    if (searchTerm) {
      params = params.append('q', searchTerm);
      params = params.append('view', 'full');
    }

    if (searchTerm != null || getFacets === true) {
      url += 'search';
    }

    if (facets != null) {
      let showDeprecated = false;
      params = params.appendFacetParams(facets, showDeprecated);
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<SubstanceSummary>>(url, options);
  }

  getSearchCount(substanceUuid: string): Observable<any> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/searchcounts/` + substanceUuid;
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  searchApplicationByAppTypeNumber(
    appType: string, appNumber: number
  ): Observable<Array<any>> {
    const url = this.apiBaseUrlWithApplicationEntityUrl + 'search?skip=0&top=10&q=root_appType:\"^' + appType + '\" AND root_appNumber:\"*' + appNumber + '*\"';
    // + '&center=' + center + '&fromTable=' + fromTable + '&page=' + (page + 1) + '&pageSize=' + pageSize;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getAppIngredtMatchListSearchResult(
    order: string,
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<Application>> {
    let params = new FacetHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    const url = this.apiBaseUrl + 'application/search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<Application>>(url, options);
  }

  createAppIngredMatchSearchCritieria(substanceUuid: string): string {
    let fullFacetField = '';
    this.getSubstanceNamesBySubstanceUuid(substanceUuid).subscribe(responseNames => {
      if (responseNames) {
        const names = responseNames;
        names.forEach((element, index) => {
          const facetField = 'root_applicationProductList_applicationProductNameList_productName:';
          if (element) {
            if (element.name) {
              if (index > 0) {
                fullFacetField = fullFacetField + ' OR ';
              }
              fullFacetField = fullFacetField + facetField + "\"" + element.name + "\"";
            }
          }
        });
      }
    });
    return fullFacetField;
  }

  getApplicationIngredientMatchList(substanceUuid: string): Observable<Application> {
    const result = null;
    // result = this.getAppIngredtMatchListCount(substanceUuid);
    //  JSON.stringify(result);
    return result;
    /*
    const url = this.baseUrl + 'getAppIngredMatchList2?substanceId=' + substanceUuid + '&citation=';
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res.data;
        })
      );
    */
  }

  appIngredMatchListAutoUpdateSave(applicationId: number, bdnum: string): Observable<any> {
    const url = this.baseUrl + 'appIngredMatchListAutoUpdateSaveJson?applicationId=' + applicationId + '&bdnum=' + bdnum;
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  // for GSRS 3.0
  getApiExportUrlBrowseSubstance(etag: string, extension: string, source: string): string {
    let url = '';
    if (source) {
      if (source === 'app') {
        return url = `${this.configService.configData.apiBaseUrl}api/v1/substances/export/${etag}/appxlsx`;
      }
      if (source === 'prod') {
        return url = `${this.configService.configData.apiBaseUrl}api/v1/substances/export/${etag}/prodxlsx`;
      }
      if (source === 'clinicaltrialsus') {
        return url = `${this.configService.configData.apiBaseUrl}api/v1/substances/export/${etag}/ctusxlsx`;
      }
      if (source === 'clinicaltrialseurope') {
        return url = `${this.configService.configData.apiBaseUrl}api/v1/substances/export/${etag}/cteuxlsx`;
      }
    }
    return url;
  }

  getApiExportUrl(etag: string, extension: string): string {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/applicationssrs/export/${etag}/${extension}`;
    return url;
  }

  // for 2.x, will REMOVE in the future
  getEtagDetails(etag: string, fullname: string, source: string): Observable<any> {
    const url = this.baseUrl + 'getEtagDetails?etagId=' + etag + '&filename=' + fullname + '&source=' + source;
    return this.http.get<any>(url)
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getManualFile(): Observable<any> {
    const url = this.baseUrl + 'manual';
    return this.http.get<any>(url, {
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      }, responseType: 'blob' as 'json', observe: 'response'
    })
      .pipe(
        map(res => {
          return res;
        })
      );
  }

  getManualUrl(): string {
    const url = this.baseUrl + 'manual';
    return url;
  }

  getCurrentDate(): any {
    const currentDate = new Date();
    return currentDate;
  }

  getSubstanceKeyType(entity?: string): any {
    // Get 'default' Substance Key Type
    let key = null;
    if (this.configService.configData && this.configService.configData.substance) {
      const substanceConfig = this.configService.configData && this.configService.configData.substance;
      key = substanceConfig.linking.keyType.default;
    }
    return key;
  }

  getSubstanceLinkingKeyTypeConfig(): any {
    let linkingKeyType = null;

    // In the frontend configuration file, this should exists, substance: {}
    if (this.configService.configData && this.configService.configData.substance) {
      const substanceConfig = this.configService.configData && this.configService.configData.substance;

      if (substanceConfig) {
        //substance.linking.keyType
        linkingKeyType = substanceConfig.linking.keyType;
      }
    }

    // if no configuration found in the config file, display message on console
    if (!linkingKeyType) {
      console.log('There is no Substance Key Type configuration found in the frontend config file: substance.linking.keyType. Setting default Substance key Type to UUID in the angular code');
    }

    return linkingKeyType;
  }

  getSubstanceKeyTypeForEntityConfig(entityType?: string): any {
    let linkingKeyType = this.getSubstanceLinkingKeyTypeConfig();

    // Get Substance Key Type for product, application, clinical trial, etc
    let substanceKeyType = null;

    // if linking.keyType exists, get the substance key type for the entity
    if (linkingKeyType) {
      if (entityType) {
        if (entityType == 'product') {
          substanceKeyType = linkingKeyType.productKeyType;
        } else if (entityType == 'application') {
          substanceKeyType = linkingKeyType.applicationKeyType;
        } else if (entityType == 'impurities') {
          substanceKeyType = linkingKeyType.impuritiesKeyType;
        } else if (entityType == 'clinicalTrial') {
          substanceKeyType = linkingKeyType.clinicalTrialKeyType;
        } else if (entityType = 'invitroPharmacology') {
          substanceKeyType = linkingKeyType.invitroPharmacologyKeyType;
        } else if (entityType = 'organization') {
          substanceKeyType = linkingKeyType.orgDisplayKeyType;
        }
      } else {
        // not entity passed, get to 'default' substance key from the config file
        substanceKeyType = linkingKeyType.default;
      }

      // if the substance key type for the entity is not found in the config file, look for 'default' config.
      if (!substanceKeyType) {
        if (linkingKeyType.default) {
          substanceKeyType = linkingKeyType.default
        } else {
          // if 'default' config not found in the config file, set the key type to UUID
          substanceKeyType = this.NO_CONFIG_FOUND_DEFAULT_SUBSTANCE_KEY;
        }
      }
    } else {
      // if the configuration is not found in the config file, set the default Substance Key Type to "UUID"
      substanceKeyType = this.NO_CONFIG_FOUND_DEFAULT_SUBSTANCE_KEY;
    }

    return substanceKeyType;
  }

  getSubstanceKeyTypeForProductConfig(): any {
    return this.getSubstanceKeyTypeForEntityConfig("product");
  }

  getSubstanceKeyTypeForApplicationConfig(): any {
    return this.getSubstanceKeyTypeForEntityConfig("application");
  }

  getSubstanceKeyTypeForImpuritiesConfig(): any {
    return this.getSubstanceKeyTypeForEntityConfig("impurities");
  }

  getSubstanceKeyTypeForClinicalTrialConfig(): any {
    return this.getSubstanceKeyTypeForEntityConfig("clinicalTrial");
  }

  getSubstanceKeyTypeForInvitroPharmacologyConfig(): any {
    return this.getSubstanceKeyTypeForEntityConfig("invitroPharmacology");
  }

  getSubstanceKeyTypeForOrganizationDisplayConfig(): any {
    return this.getSubstanceKeyTypeForEntityConfig("organization");
  }

}
