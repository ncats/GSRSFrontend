import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from '../../../node_modules/rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {

  constructor(
    private http: HttpClient
  ) { }

  getStructureSearchSuggestions(searchTerm: string): Observable<HttpResponse<any>> {
    return this.http.jsonp<any>('https://ginas.ncats.nih.gov/ginas/app/api/v1/suggest?q=' + searchTerm, 'callback');
  }
}
