import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import {SubstanceDetail} from '../substance/substance.model';
import {SubstanceHttpParams} from '../substance/substance-http-params';
import { ResolverResponse } from '../utils/structure-post-response.model';
@Injectable({
  providedIn: 'root'
})
export class StructureService {

  constructor(
    private sanitizer: DomSanitizer,
    public configService: ConfigService,
    private http: HttpClient
  ) {
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=${size.toString()}`;
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  getMolfile(id: string): Observable<string> {
    const url = `${this.configService.configData.apiBaseUrl}img/${id}.mol`;
    return this.http.get(url, {responseType: 'text'});
  }

  downloadMolfile(id: string): Observable<any> {
    const url = `${this.configService.configData.apiBaseUrl}img/${id}.mol`;
    return this.http.get(url, {responseType: 'blob' as 'json'});
  }

  getInchi(id: string): Observable<string> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances(${id})structure!$inchikey()`;
    return this.http.get(url, {responseType: 'text'});
  }

  resolveName(name: string): Observable<ResolverResponse[]> {
    console.log('running ' + name);
    const url = `${this.configService.configData.apiBaseUrl}resolve/${name}`;
    return this.http.get<ResolverResponse[]>(url);
  }

  getName(name: string): Observable<SubstanceDetail> {
    let params = new SubstanceHttpParams();
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/search`;
    const n = name.replace('"', '');
    // Needs sanitation
    params = params.append('q', 'root_names_name:"^' + n + '$" OR ' +
      'root_approvalID:"^' + n + '$" OR ' +
      'root_codes_BDNUM:"^' + n + '$"');
    const options = {
      params: params
    };
    return this.http.get<SubstanceDetail>(url, options);
  }


}
