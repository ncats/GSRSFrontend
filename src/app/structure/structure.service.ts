import { Injectable } from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../config/config.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class StructureService {

  constructor(
    private sanitizer: DomSanitizer,
    public configService: ConfigService,
    private http: HttpClient
  ) { }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=${size.toString()}`;
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  getMolfile(id: string): Observable<string> {
    const url = `${this.configService.configData.apiBaseUrl}img/${id}.mol`;
    return this.http.get(url, { responseType: 'text' });
  }

  getInchi(id: string): Observable<string> {
    const url = `${this.configService.configData.apiBaseUrl}api/v1/substances(${id})structure!$inchikey()`;
    return this.http.get(url, {responseType: 'text'});
  }
}
