import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { map } from 'rxjs/operators';
import { SubstanceRelationship } from '@gsrs-core/substance/substance.model';
import { PagingResponse } from '@gsrs-core/utils';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { Facet } from '@gsrs-core/facets-manager';
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

  getSubstanceBySubstanceUuid(
    substanceUuid: string
  ): Observable<any> {

    const url = this.apiBaseUrl + 'substances(' + substanceUuid + ')';
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceCodesBySubstanceUuid(
    substanceUuid: string
  ): Observable<any> {
    // const url = this.apiBaseUrl + 'substances(' + substanceUuid + ')/codes'
    // const url = this.baseUrl + 'getSubstanceDetailsBySubstanceId?substanceId=' + substanceId;

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

  getSubstanceByAnyId(
    id: string
  ): Observable<any> {
    const url = this.apiBaseUrl + 'substances(' + id + ')';
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  /*
  getSubstanceKeyBySubstanceUuid(
    substanceUuid: string
  ): string {
    let substanceKey = null;
    const url = this.apiBaseUrl + 'substances(' + substanceUuid + ')/codes';
    const response = this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );

    response.subscribe(substanceCodes => {
      if (substanceCodes) {
        for (let index = 0; index < substanceCodes.length; index++) {
          if (substanceCodes[index].codeSystem && this.getSubstanceKeyType) {
            if ((substanceCodes[index].codeSystem === this.getSubstanceKeyType) &&
              (substanceCodes[index].type === 'PRIMARY')) {
              substanceKey = substanceCodes[index].code;
            }
          }
        }
      }
    });
    return substanceKey;
  }
  */

  getSubstanceRelationships(substanceUuid: string): Observable<Array<SubstanceRelationship>> {

    const url = `${this.apiBaseUrl}substances(${substanceUuid})/relationships`;
    return this.http.get<Array<SubstanceRelationship>>(url);
  }

  getSearchCount(substanceUuid: string): Observable<any> {
   const url = `${this.configService.configData.apiBaseUrl}api/v1/searchcounts/` + substanceUuid;
   // const url = this.baseUrl + 'getSubstanceSearchCountBySubstanceUuid?substanceUuid=' + substanceUuid;
   // const url = this.apiBaseUrl + 'searchcounts/' + substanceUuid;
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

  // getAppIngredtMatchListCount(substanceUuid: string)
  //   : Observable<PagingResponse<Application>> {
  //   let count = 0;
  //   let fullFacetField = '';
  //   let result : PagingResponse<Application>;
  /*
  this.getSubstanceNamesBySubstanceUuid(substanceUuid).subscribe(responseNames => {
    if (responseNames) {
      const names = responseNames;
      names.forEach((element, index) => {
        const facetField = "root_applicationProductList_applicationProductNameList_productName:";
        if (element) {
          if (element.name) {
            if (index > 0) {
              fullFacetField = fullFacetField + " OR ";
            }
            fullFacetField = fullFacetField + facetField + "\"" + element.name + "\"";
          }
        }
      });

      // DO Application Search in Product Name
      const facetParam = { "Has Ingredients": { "params": { "Has No Ingredient": true }, "isAllMatch": false } };

      this.getAppIngredtMatchListSearchResult(null, 0, 10, fullFacetField, facetParam).subscribe(response => {
      //   alert('RRRRRRR' + JSON.stringify(response));
      //   if (response) {
      //     alert("RESULT RESPONSE");
      //      result = response;
      //    }
          return response;
      });
    }
  });
  */
  // return result;

  /*
  const url = this.baseUrl + 'getAppIngredtMatchListCountJson?substanceId=' + substanceUuid + '&citation=';
  return this.http.get<any>(url)
    .pipe(
      map(res => {
        return res;
      })
    );
  */

  // }

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

  getSubstanceKeyType(): string {
    let key = null;
    if (this.configService.configData && this.configService.configData.substance) {
      const substanceConfig = this.configService.configData && this.configService.configData.substance;
      key = substanceConfig.linking.keyType.default;
    }
    return key;
  }

  getCurrentDate(): any {
    const currentDate = new Date();
    return currentDate;
  }

}
