import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, Subject, throwError, of } from 'rxjs';
import { switchMap, map, catchError, takeWhile } from 'rxjs/operators';

/* GSRS Core Imports */
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { SubstanceSummary, SubstanceRelationship, SubstanceRelated } from '@gsrs-core/substance/substance.model';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';

import { Application } from '../application/model/application.model';

@Injectable()
export class GeneralService extends BaseHttpService {

  apiBaseUrlWithApplicationEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/applications' + '/';

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

  getSubstanceKeyBySubstanceKeyTypeResolver(relatedSubstance: SubstanceRelated, substanceKeyType: string): string {
    let substanceKey = '';

    // If Substance Key Type is UUID in the frontend config, set value of Substance Key to Substance Uuid value
    if (substanceKeyType === 'UUID') {
      substanceKey = relatedSubstance.refuuid;

      // If Substance Key Type is APPROVAL_ID in the frontend config, set value of Substance Key to Substance Approval ID value
    } else if (substanceKeyType === 'APPROVAL_ID') {
      substanceKey = relatedSubstance.approvalID;

      // If Substance Key Type is BDNUM in the frontend config, set value of Substance Key to Substance Bdnum/Code value
    } /*else if (substanceKeyType === 'BDNUM') {
      // Get the Bdnum/code from Substance by substance uuid
      this.getCodeBdnumBySubstanceUuid(relatedSubstance.refuuid).subscribe(response => {
        if (response) {
          // substanceKey = response;
         // subject.next(response);
        }
      });
    } */
    return substanceKey;
  }

  getBdnumBySubstanceKeyTypeResolver2(relatedSubstance: SubstanceRelated, substanceKeyType: string): Observable<string> {

    return new Observable(observer => {
       observer.next("TESTING");
    });

    /*
    const url = this.apiBaseUrl + 'substances(' + relatedSubstance.uuid + ')';
    this.http.get<any>(url).pipe(
      map(results => {
        const test = results;
        test.forEach(sub => {
          alert(sub.uuid);
          return sub.uuid;
        });
        return "abd";
      })
    );
    */

    /*
    //let substanceKey = '';
    let subject1 = new Subject<string>();
    //subject.next(substanceKey);

    // If Substance Key Type is UUID in the frontend config, set value of Substance Key to Substance Uuid value
    if (substanceKeyType === 'UUID') {

      // If Substance Key Type is APPROVAL_ID in the frontend config, set value of Substance Key to Substance Approval ID value
    } else if (substanceKeyType === 'APPROVAL_ID') {
      //substanceKey = relatedSubstance.approvalID;
      // subject.next(substanceKey);
    //  alert(substanceKey);
      // If Substance Key Type is BDNUM in the frontend config, set value of Substance Key to Substance Bdnum/Code value
    } else if (substanceKeyType === 'BDNUM') {
      // Get the Bdnum/code from Substance by substance uuid
      this.getCodeBdnumBySubstanceUuid(relatedSubstance.refuuid).subscribe(response => {
        if (response) {
          // substanceKey = response;
         // subject.next(response);
        }
      });
    }
    return subject1.asObservable(); */
  }

  /*
  getSubstanceKeyBySubstanceKeyTypeResolver(relatedSubstance: SubstanceRelated, substanceKeyType: string): Observable<string> {
    //let substanceKey = '';
    //let substanceKey: Observable<string> = of("");
    let subject1 = new Subject<string>();
    //subject.next(substanceKey);

    // If Substance Key Type is UUID in the frontend config, set value of Substance Key to Substance Uuid value
    if (substanceKeyType === 'UUID') {

      const subject = new Subject();
      subject.next('event 0');

      subject.subscribe(event => console.log(event));

      //subject.next(relatedSubstance.refuuid);

      //substanceKey = relatedSubstance.refuuid;
      //substanceKey = of(relatedSubstance.refuuid);
      //Observable<string> = substanceKey;
      //return Observable<number> = from([1, 2, 3, 4]);
      //subject.next(substanceKey);

      // If Substance Key Type is APPROVAL_ID in the frontend config, set value of Substance Key to Substance Approval ID value
    } else if (substanceKeyType === 'APPROVAL_ID') {
      //substanceKey = relatedSubstance.approvalID;
      // subject.next(substanceKey);
    //  alert(substanceKey);
      // If Substance Key Type is BDNUM in the frontend config, set value of Substance Key to Substance Bdnum/Code value
    } else if (substanceKeyType === 'BDNUM') {
      // Get the Bdnum/code from Substance by substance uuid
      this.getCodeBdnumBySubstanceUuid(relatedSubstance.refuuid).subscribe(response => {
        if (response) {
          // substanceKey = response;
         // subject.next(response);
        }
      });
    }
    return subject1.asObservable();
  }
  */

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
    let key = null;
    if (this.configService.configData && this.configService.configData.substance) {
      const substanceConfig = this.configService.configData && this.configService.configData.substance;
      key = substanceConfig.linking.keyType.default;
    }
    return key;
  }

  getSubstanceKeyTypeConfig(): any {
    let key = null;
    if (this.configService.configData && this.configService.configData.substance) {
      const substanceConfig = this.configService.configData && this.configService.configData.substance;
      key = substanceConfig.linking.keyType;
    }
    return key;
  }

  getSubstanceKeyTypeForProductConfig(): any {
    let keyType = this.getSubstanceKeyTypeConfig();

    // Get Substance Key Type for Product from frontend config
    let prodKey = null;
    prodKey = keyType.productKeyType;
    if (prodKey) {
      return prodKey;
    } else {
      return keyType.default;
    }
  }

  getSubstanceKeyTypeForImpuritiesConfig(): any {
    let keyType = this.getSubstanceKeyTypeConfig();

    // Get Substance Key Type for Impurities from frontend config
    const appKey = keyType.impuritiesKeyType;
    if (appKey) {
      return appKey;
    } else {
      return keyType.default;
    }
  }

  getSubstanceKeyTypeForClinicalTrialConfig(): any {
    let keyType = this.getSubstanceKeyTypeConfig();

    // Get Substance Key Type for Clinical Trial from frontend config
    const clinicalKey = keyType.clinicalTrialKeyType;
    if (clinicalKey) {
      return clinicalKey;
    } else {
      return keyType.default;
    }
  }

  getSubstanceKeyTypeForOrganizationDisplayConfig(): any {
    let keyType = this.getSubstanceKeyTypeConfig();

    // Get Substance Key Type for Organization Display from frontend config
    const orgDisplayKey = keyType.clinicalTrialKeyType;
    if (orgDisplayKey) {
      return orgDisplayKey;
    } else {
      return keyType.default;
    }
  }

}
