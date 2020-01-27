import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
// import { ApplicationSrs } from '../model/application.model';
import { SubstanceFacetParam } from '../../../core/substance/substance-facet-param.model';
import { SubstanceHttpParams } from '../../../core/substance/substance-http-params';
import { map } from 'rxjs/operators';

@Injectable(
  {
    providedIn: 'root',
  }
)

export class AdverseEventService extends BaseHttpService {

  totalRecords: 0;

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getSubstanceAdverseEventPt(
    bdnum: string, page:number, pageSize: number
  ): Observable<Array<any>> {
    const url = 'http://localhost:9000/ginas/app/adverseEventPtListByBdnum?bdnum=' + bdnum + '&page=' + (page+1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url)
    .pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );
  }

  getSubstanceAdverseEventDme(
    bdnum: string, page:number, pageSize: number
  ): Observable<Array<any>> {
    const url = 'http://localhost:9000/ginas/app/adverseEventDmeListByBdnum?bdnum=' + bdnum + '&page=' + (page+1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url)
    .pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );

  }

  getSubstanceAdverseEventCvm(
    bdnum: string, page:number, pageSize: number
  ): Observable<Array<any>> {
    const url = 'http://localhost:9000/ginas/app/adverseEventCvmListByBdnum?bdnum=' + bdnum + '&page=' + (page+1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url)
    .pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );

  }

} //class
