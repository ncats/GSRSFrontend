import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseHttpService } from '../base/base-http.service';
import { Observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { SubstanceSuggestionsGroup } from './substance-suggestions-group.model';
import { Vocabulary } from './vocabulary.model';
import { PagingResponse } from './paging-response.model';

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

  getVocabularies(filter?: string, pageSize?: number, skip?: number): Observable<PagingResponse<Vocabulary>> {

    const url = `${this.apiBaseUrl}vocabularies`;

    let params = new HttpParams();

    if (filter != null) {
      params = params.append('filter', filter);
    }

    if (skip != null) {
      params = params.append('skip', skip.toString());
    }

    if (pageSize != null) {
      params = params.append('top', pageSize.toString());
    }

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<Vocabulary>>(url, options);
  }
}
