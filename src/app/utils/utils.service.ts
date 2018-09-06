import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BaseHttpService } from '../base/base-http.service';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { SubstanceSuggestionsGroup } from './substance-suggestions-group.model';

@Injectable({
  providedIn: 'root'
})
export class UtilsService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getStructureSearchSuggestions(searchTerm: string): Observable<SubstanceSuggestionsGroup> {
    return this.http.jsonp<SubstanceSuggestionsGroup>(this.apiBaseUrl + 'suggest?q=' + searchTerm, 'callback');
  }
}
