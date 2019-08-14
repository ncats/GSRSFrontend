import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { ClinicalTrial } from './clinical-trial.model';
import { BdnumNameAll } from './clinical-trial.model';
import { PagingResponse } from '@gsrs-core/utils';


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
    let url = 'http://localhost:9000/ginas/app/api/v1/ctclinicaltrial';
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

      let url = `${this.apiBaseUrl}ctclinicaltrial`;
  
      const options = {
        params: params
      };
      return this.http.get<PagingResponse<ClinicalTrial>>(url, options);
    }
  
    
    getClinicalTrial(id: string): Observable<ClinicalTrial> {
      // const url = `${this.apiBaseUrl}ctclinicaltrial(${id})`;
      let url = "http://localhost:9000/ginas/app/api/v1/" + `ctclinicaltrial(${id})`;
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

    getSubstanceDetailsFromName(name: string) : Observable<any> {
      // const url = `${this.apiBaseUrl}clinicaltrial(${id})`;
      let url = "http://localhost:9000/ginas/app/api/v1/substances("+encodeURIComponent(name)+')';

      let params = new HttpParams();
      // params = params.append('view', 'full');
      const options = {
        params: params
      };
      // let headers: HttpHeaders = new HttpHeaders();
      // headers = headers.append('Accept', 'application/json');
      let x = this.http.get<any>(url);;
      return x;
    }


    getSubstanceDetailsFromName_(name: string) {
      // let  queryString = '?root_names_name:"^'+name+'$"';
      // let url = "http://localhost:9000/ginas/app/api/v1/" + 'substances/search' + queryString;
      let url = "http://localhost:9000/ginas/app/api/v1/substances("+encodeURIComponent(name)+')';
      let params = new HttpParams();
      //encodeURIComponent(
      // params = params.append('root_names_name', '"^'+name+'$"');
      const options = {
        params: params
      };
      // let x = this.http.get<SubstanceDetails>(url, options);
      // console.log(JSON.stringify(x));
      // return x;
      let x = null;
      this.http.get(url).subscribe((res)=>{        
        // console.log("trying getSubstanceDetailsFromName");
        // console.log(res);
         x = res;
    });
      console.log(x);
 
      return x;
    }

    updateClinicalTrial(body): Observable<ClinicalTrial> {
      // const url = `${this.apiBaseUrl}ctclinicaltrial(${id})`;
      let url = "http://localhost:9000/ginas/app/api/v1/" + `ctclinicaltrial`;
      let params = new HttpParams();
      // params = params.append('view', 'full');

      var play_session = 'PLAY_SESSION=51ba0b332b4ce19b24088a5452996db32bd1000d-ix.session=293873a2-521b-453f-976c-016e39ce74c0';
      let headers: HttpHeaders = new HttpHeaders();
      headers = headers.append('Cookie', play_session);  
      const options = {
        params: params
      };
      let x = this.http.put<ClinicalTrial>(url, body, {headers});
      return x;
    }
   

}
