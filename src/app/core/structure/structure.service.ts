import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SubstanceDetail, SubstanceStructure, SubstanceMoiety } from '../substance/substance.model';
import { ResolverResponse } from './structure-post-response.model';
import { InterpretStructureResponse } from './structure-post-response.model';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';

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
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances(${id})/structure!$inchikey()`;
    return this.http.get(url, {responseType: 'text'});
  }

  getSDFile(id: string): Observable<string> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/export/${id}.SDFile`;
    return this.http.get(url, {responseType: 'text'});
  }


  getOtherInchi(id: string): Observable<string> {
  // get the other half of the inchi
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances(${id})/structure!$inchi()`;
    return this.http.get(url, {responseType: 'text'});
  }

  resolveName(name: string): Observable<ResolverResponse[]> {
    const url = `${this.configService.configData.apiBaseUrl}resolve?name=${encodeURIComponent(name)}`;
    return this.http.get<ResolverResponse[]>(url);
  }

  formatFormula(structure: SubstanceStructure ):string {
    if (structure.formula == null) {
      return '';
    }
    let HTMLFormula = structure.formula.replace(/([a-zA-Z])([0-9]+)/g, '$1<sub>$2</sub>');
    if (structure.charge != null && structure.charge !== 0 && !HTMLFormula.includes('.')) {
        let sCharge = structure.charge.toString();
        let sSign = '+';
        if (structure.charge < 0) {
            sCharge = sCharge.substring(1);
            sSign = '-';
        }
        if ('1' === (sCharge)) {
          sCharge = '';
      }
      HTMLFormula = HTMLFormula + '<sup>' + sCharge + sSign + '</sup>';
  }
  return HTMLFormula;
}

  getName(name: string): Observable<SubstanceDetail> {
    let params = new HttpParams();
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

  interpretStructure(mol: string): Observable<InterpretStructureResponse> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/interpretStructure`;
    return this.http.post<InterpretStructureResponse>(url, mol);
  }

  molvec(file: any): Observable<any> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances/ocrStructure`;
    return this.http.post<any>(url, file);

  }

  duplicateCheck(sub: SubstanceDetail): Observable<any> {
    const url = `${this.configService.configData.apiBaseUrl}register/duplicateCheck`;
    return this.http.post<any>(url, sub);
  }
}
