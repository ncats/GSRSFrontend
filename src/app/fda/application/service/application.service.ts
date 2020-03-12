import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { ApplicationSrs } from '../model/application.model';
import { ProductSrs } from '../model/application.model';
import { SubstanceFacetParam } from '../../../core/substance/substance-facet-param.model';
import { SubstanceHttpParams } from '../../../core/substance/substance-http-params';
import { map, switchMap, tap } from 'rxjs/operators';
import { Facet } from '@gsrs-core/utils';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class ApplicationService extends BaseHttpService {

  totalRecords: 0;
  application: ApplicationSrs;

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getApplications(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: SubstanceFacetParam
  ): Observable<PagingResponse<ApplicationSrs>> {
    let params = new SubstanceHttpParams();
    params = params.append('skip', skip.toString());
    params = params.append('top', pageSize.toString());
    if (searchTerm !== null && searchTerm !== '') {
      params = params.append('q', searchTerm);
    }

    params = params.appendFacetParams(facets);

    const url = `${this.apiBaseUrl}applicationssrs/search`;
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<ApplicationSrs>>(url, options);
  }

  exportBrowseApplicationsUrl(
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: SubstanceFacetParam
  ): string {
    let params = new SubstanceHttpParams();
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

  filterFacets(name: string, category: string): Observable<any> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/applicationssrs/search/@facets?wait=false&kind=ix.srs.models.ApplicationSrs&skip=0&fdim=200&sideway=true&field=${category}&top=14448&fskip=0&fetch=100&termfilter=SubstanceDeprecated%3Afalse&order=%24lastEdited&ffilter=${name}`;
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

  /*
  getClinicalTrialApplication(
    applications: Array<ApplicationSrs>
  ): Observable<Array<any>> {

    //appType: string, appNumber: string
    let clinicalTrial: Array<any> = [];

  //: Observable<Array<any>> {
    //console.log("clinical2 " + application.appType + "  " + application.appNumber);
    applications.forEach((element, index) => {
      console.log("AAA: " + element.appType + "  " +element.appNumber);
      const url = this.baseUrl + 'getClinicalTrialApplication2?appType=' + element.appType + '&appNumber=' + element.appNumber;
    //  clinicalTrial = this.http.get<Array<any>>(url)
    });

    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        return results;
      })
    );

  }
*/
  getSubstanceApplications(
    bdnum: string, center: string, fromTable: string, page: number, pageSize: number
  ): Observable<Array<any>> {

    const func = this.baseUrl + 'applicationListByBdnum?bdnum=';
    const url = func + bdnum + '&center=' + center + '&fromTable=' + fromTable + '&page=' + (page + 1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );
  }

  getApplicationDetails(
    id: number
  ): Observable<any> {
    const url = this.baseUrl + 'applicationDetails2?id=' + id;

    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getApplicationDarrtsDetails(
    appType: string, appNumber: string
  ): Observable<any> {
    const url = this.baseUrl + 'applicationDarrtsDetails2?appType=' + appType + '&appNumber=' + appNumber;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceDetailsByBdnum(
    bdnum: string
  ): Observable<any> {
    const url = this.baseUrl + 'getSubstanceDetailsByBdnum?bdnum=' + bdnum;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getApplicationCenterByBdnum(
    bdnum: string
  ): Observable<any> {
    const url = this.baseUrl + 'getApplicationCenterByBdnum2?bdnum=' + bdnum;
    return this.http.get<any>(url).pipe(
      map(results => {
        return results;
      })
    );
  }

  getSubstanceRelationship(
    substanceId: string
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'getRelationshipBySubstanceId?substanceId=' + substanceId;
    return this.http.get<Array<any>>(url).pipe(
      map(results => {
        return results['data'];
      })
    );
  }

  loadApplication(application?: ApplicationSrs): void {
   // setTimeout(() => {
      console.log('AAAAA');
      if (application != null) {
        this.application = application;
        console.log('AFTER' + JSON.stringify(this.application));
      } else {
        this.application = {
          applicationIndicationList: [],
          applicationProductList: [{
            applicationProductNameList: [],
            applicationIngredientList: [{}]
          }]
        };
      }
  //  });
  }

  getJson() {
    return this.application;
  }

  getUpdateApplicationUrl(): string {
    return this.baseUrl + 'updateApplication?applicationId=';
  }

  getApplicationListExportUrl(bdnum: string): string {
    return this.baseUrl + 'applicationListExport?bdnum=' + bdnum;
  }

} // class
