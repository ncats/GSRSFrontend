import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '../../config/config.service';
import { BaseHttpService } from '../../base/base-http.service';
import { ClinicalTrial } from './clinical-trial.model';
import { BdnumNameAll } from './clinical-trial.model';
import { PagingResponse } from '../../utils/paging-response.model';


@Injectable({
  providedIn: 'root'
})
export class ClinicalTrialService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }
  getClinicalTrialsTest() {
    return [
      {'id': 1, ctNumber: 'NCT01', bdnum: 'xyz1'},
      {'id': 2, ctNumber: 'NCT02', bdnum: 'xyz2'},
      {'id': 3, ctNumber: 'NCT03', bdnum: 'xyz3'},
      {'id': 4, ctNumber: 'NCT04', bdnum: 'xyz4'}      
    ];
  }
  getClinicalTrialsTest2(
  ): Observable<Array<ClinicalTrial>> {
    let params = new HttpParams();
    let url = 'http://localhost:9000/ginas/app/api/v1/clinicaltrial';
    // let url = this.apiBaseUrl + 'clinical-trial/';
    let x = this.http.get<any>(url);
    console.log(JSON.stringify(x));
    return x;
  }
  getClinicalTrials(
      skip: number = 0,
      pageSize: number = 10
    ): Observable<PagingResponse<ClinicalTrial>> {
  
      let params = new HttpParams();

      params = params.append('skip', skip.toString());
      params = params.append('top', pageSize.toString());

      let url = `${this.apiBaseUrl}clinicaltrial`;
  
      const options = {
        params: params
      };
      return this.http.get<PagingResponse<ClinicalTrial>>(url, options);
    }
  
    
    getClinicalTrial(id: string): Observable<ClinicalTrial> {
      // const url = `${this.apiBaseUrl}clinicaltrial(${id})`;
      let url = "http://localhost:9000/ginas/app/api/v1/" + `clinicaltrial(${id})`;
      let params = new HttpParams();
      // params = params.append('view', 'full');
      const options = {
        params: params
      };
      let x = this.http.get<ClinicalTrial>(url, options);
      return x;
    }

    getBdnumNameAll(ingredientName: string): Observable<BdnumNameAll> {
      // const url = `${this.apiBaseUrl}clinicaltrial(${id})`;
      let url = "http://localhost:9000/ginas/app/api/v1/" + `bdnumnameall?ingredientName=` + encodeURIComponent(ingredientName) ;
      let params = new HttpParams();
      // params = params.append('view', 'full');
      const options = {
        params: params
      };
      let x = this.http.get<BdnumNameAll>(url, options);
      console.log(JSON.stringify(x));
      return x;
    }

    updateClinicalTrial(body): Observable<ClinicalTrial> {
      // const url = `${this.apiBaseUrl}clinicaltrial(${id})`;
      let url = "http://localhost:9000/ginas/app/api/v1/" + `clinicaltrial`;
      let params = new HttpParams();
      // params = params.append('view', 'full');
      const options = {
        params: params
      };
      let x = this.http.put<ClinicalTrial>(url, body, options);
      return x;
    }
   

}
