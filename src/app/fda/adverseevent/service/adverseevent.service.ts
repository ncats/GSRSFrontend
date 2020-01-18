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

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
  }

  getSubstanceAdverseEventPt(
    bdnum: string
  ): Observable<Array<any>> {
    const url = 'http://localhost:9000/ginas/app/adverseEventPtListByBdnum?bdnum=' + bdnum;

    return this.http.get<Array<any>>(url).pipe(
      map(adverseevent => {
        console.log("Adverse Event PT Length: " + adverseevent.length);
       return adverseevent;
      })
    );
  }

  getSubstanceAdverseEventDme(
    bdnum: string
  ): Observable<Array<any>> {
    const url = 'http://localhost:9000/ginas/app/adverseEventDmeListByBdnum?bdnum=' + bdnum;

    return this.http.get<Array<any>>(url).pipe(
      map(adverseevent => {
        console.log("Adverse Event PT Length: " + adverseevent.length);
       return adverseevent;
      })
    );

  }

  getSubstanceAdverseEventCvm(
    bdnum: string
  ): Observable<Array<any>> {
    const url = 'http://localhost:9000/ginas/app/adverseEventCvmListByBdnum?bdnum=' + bdnum;

    return this.http.get<Array<any>>(url).pipe(
      map(adverseevent => {
        console.log("Adverse Event PT Length: " + adverseevent.length);
       return adverseevent;
      })
    );

  }

} //class
