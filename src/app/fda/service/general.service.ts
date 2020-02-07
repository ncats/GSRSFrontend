import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { map } from 'rxjs/operators';

@Injectable()
export class GeneralService extends BaseHttpService {

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getSearchCount(substanceUuid: string): Observable<any> {
  const url = this.baseUrl + 'getSubstanceSearchCountBySubstanceUuid?substanceUuid=' + substanceUuid;
  return this.http.get<any>(url)
  .pipe(
    map(res => {
     return res;
    })
  );
  }

}
