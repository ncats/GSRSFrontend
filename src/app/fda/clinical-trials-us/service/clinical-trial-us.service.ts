import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { Facet } from '@gsrs-core/facets-manager';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { ClinicalTrialUS, ClinicalTrialUSDrug, ClinicalTrialAll } from '../model/clinical-trial-us.model';
import { ValidationResults } from '../model/clinical-trial-us.model';

@Injectable()
export class ClinicalTrialUSService extends BaseHttpService {

  private _bypassUpdateCheck = false;
  private clinicalTrialUSStateHash?: number;
  totalRecords = 0;
  clinicalTrialUS: ClinicalTrialUS;

  apiBaseUrlWithClinicalTrialUSEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/clinicaltrialsus' + '/';
  apiBaseUrlWithClinicalTrialBrowseEntityUrl = this.configService.configData.apiBaseUrl + 'api/v1/clinicaltrialsus' + '/';

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    public utilsService: UtilsService
  ) {
    super(configService);
  }

  getClinicalTrialsUS(
    order: string,
    skip: number = 0,
    pageSize: number = 10,
    searchTerm?: string,
    facets?: FacetParam
  ): Observable<PagingResponse<ClinicalTrialUS>> {
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

    const url = this.apiBaseUrlWithClinicalTrialBrowseEntityUrl + 'search';
    const options = {
      params: params
    };

    return this.http.get<PagingResponse<ClinicalTrialUS>>(url, options);
  }

  getClinicalTrialUSFacets(facet: Facet, searchTerm?: string, nextUrl?: string): Observable<FacetQueryResponse> {
    let url: string;
    if (searchTerm) {
      url = `${this.configService.configData.apiBaseUrl}api/v1/clinicaltrialsus` 
       + `/search/@facets?wait=false&kind=gov.hhs.gsrs.clinicaltrial.us.clinicaltrialus.models.ClinicalTrialUS`
       + `&skip=0&fdim=200&sideway=true&field=${facet.name.replace(' ', '+')}`
       + `&top=14448&fskip=0&fetch=100&order=%24lastModifiedDate&ffilter=${searchTerm}`;

 //     http://localhost:8081/api/v1/substances/search/@facets?
 //     wait=false&kind=gov.hhs.gsrs.clinicaltrial.us.clinicaltrialus.models.ClinicalTrialUS
 //     &skip=0&promoteSpecialMatches=true&includeFacets=true&fdim=10
 //     &simpleSearchOnly=false&sideway=true&field=Deprecated

    } else if (nextUrl != null) {
      url = nextUrl;
    } else {
      url = facet._self;
    }
    return this.http.get<FacetQueryResponse>(url);
  }

  filterFacets(name: string, category: string): Observable<any> {
    const url = this.apiBaseUrlWithClinicalTrialBrowseEntityUrl + `search/@facets?wait=false&kind=gov.hhs.gsrs.clinicaltrial.us.clinicaltrialus.models.ClinicalTrialUS&skip=0&fdim=200&sideway=true&field=${category}&top=14448&fskip=0&fetch=100&order=%24lastUpdated&ffilter=${name}`;
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
    // const url = `${this.configService.configData.apiBaseUrl}api/v1/clinicaltrialsus/export/${etag}/${extension}`;
    const url = this.apiBaseUrlWithClinicalTrialBrowseEntityUrl + `export/${etag}/${extension}`;
    return url;
  }


  get isClinicalTrialUSUpdated(): boolean {
    const clinicalTrialUSString = JSON.stringify(this.clinicalTrialUS);
    if (this._bypassUpdateCheck) {
      this._bypassUpdateCheck = false;
      return false;
    } else {
      return this.clinicalTrialUSStateHash !== this.utilsService.hashCode(clinicalTrialUSString);
    }
  }

  bypassUpdateCheck(): void {
    this._bypassUpdateCheck = true;
  }

  getClinicalTrialUS(trialNumber: string, src: string): Observable<any> {
    const url = this.apiBaseUrlWithClinicalTrialUSEntityUrl + trialNumber;
    return this.http.get<any>(url)
      .pipe(
        map(result => {
          return result;
        })
      );
  }

  getViewClinicalTrialUSUrl(trialNumber: string): string {
    return this.apiBaseUrlWithClinicalTrialUSEntityUrl + trialNumber;
  }

  loadClinicalTrialUS(clinicalTrialUS?: ClinicalTrialUS): void {
    // if Update/Exist Application
    // setTimeout(() => {
    if (clinicalTrialUS != null) {
      this.clinicalTrialUS = clinicalTrialUS;
    } else {
      this.clinicalTrialUS = {
        clinicalTrialUSDrug: [{}]
      };
    }
    //  });
  }

  saveClinicalTrialUS(): Observable<ClinicalTrialUS> {
    const url = this.apiBaseUrlWithClinicalTrialUSEntityUrl;
    const params = new HttpParams();
    const options = {
      params: params,
      type: 'JSON',
      headers: {
        'Content-type': 'application/json'
      }
    };
    // Update ClinicalTrialUS
    if ((this.clinicalTrialUS != null) && (this.clinicalTrialUS.trialNumber)) {
      console.log('just before put');
      return this.http.put<ClinicalTrialUS>(url, this.clinicalTrialUS, options);
    } else {
      // Save New Product
      console.log('just before post');
      return this.http.post<ClinicalTrialUS>(url, this.clinicalTrialUS, options);
    }
  }

  validateClinicalTrialUS(): Observable<ValidationResults> {
    return new Observable(observer => {
      this._validateClinicalTrialUS().subscribe(results => {
        observer.next(results);
        observer.complete();
      }, error => {
        observer.error();
        observer.complete();
      });
    });
  }

  _validateClinicalTrialUS(): Observable<ValidationResults> {
    const url = this.apiBaseUrlWithClinicalTrialUSEntityUrl + '@validate';
    return this.http.post(url, this.clinicalTrialUS);
  }

  deleteClinicalTrialUS(trialNumber: string): Observable<any> {
    const options = {
    };
    const url = this.apiBaseUrlWithClinicalTrialUSEntityUrl + trialNumber;
    const x = this.http.delete<ClinicalTrialUS>(url, options);
    return x;
  }

  addNewSubstance(clinicalTrialUSDrug?: ClinicalTrialUSDrug): void {
    if (clinicalTrialUSDrug == null)  {
      clinicalTrialUSDrug = {};
    }
    console.log('servicexxx clinicalTrialUSDrug');
    console.log(clinicalTrialUSDrug);
    this.clinicalTrialUS.clinicalTrialUSDrug.unshift(clinicalTrialUSDrug);
  }

  deleteClinicalTrialUSDrug(index: number): void {
    this.clinicalTrialUS.clinicalTrialUSDrug.splice(index, 1);
  }

}
