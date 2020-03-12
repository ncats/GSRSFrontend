import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BaseHttpService } from '@gsrs-core/base';
import { ConfigService } from '@gsrs-core/config';
import { Observable } from 'rxjs';
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
    bdnum: string, page: number, pageSize: number
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'adverseEventPtListByBdnum?bdnum=' + bdnum + '&page=' + (page + 1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url)
    .pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );
  }

  getSubstanceAdverseEventDme(
    bdnum: string, page: number, pageSize: number
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'adverseEventDmeListByBdnum?bdnum=' + bdnum + '&page=' + (page + 1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url)
    .pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );

  }

  getSubstanceAdverseEventCvm(
    bdnum: string, page: number, pageSize: number
  ): Observable<Array<any>> {
    const url = this.baseUrl + 'adverseEventCvmListByBdnum?bdnum=' + bdnum + '&page=' + (page + 1) + '&pageSize=' + pageSize;

    return this.http.get<Array<any>>(url)
    .pipe(
      map(results => {
        this.totalRecords = results['totalRecords'];
        return results['data'];
      })
    );

  }

  getAdverseEventPtListExportUrl(bdnum: string): string {
    return this.baseUrl + 'adverseEventPtListExport?bdnum=' + bdnum;
  }

  getAdverseEventDmeListExportUrl(bdnum: string): string {
    return this.baseUrl + 'adverseEventDmeListExport?bdnum=' + bdnum;
  }

  getAdverseEventCvmListExportUrl(bdnum: string): string {
    return this.baseUrl + 'adverseEventCvmListExport?bdnum=' + bdnum;
  }


} // class
