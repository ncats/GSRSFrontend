import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { BaseHttpService } from '@gsrs-core/base';
import { ConfigService } from '@gsrs-core/config';
import { HttpClient } from '@angular/common/http';
import { UtilsService } from '@gsrs-core/utils';
import { Facet, FacetQueryResponse } from './facet.model';

@Injectable({
  providedIn: 'root'
})
export class FacetsManagerService extends BaseHttpService {
  getFacetsHandler: (facet: Facet, searchTerm?: string, nextUrl?: string, otherFacets?: any, pageQuery?: string) => Observable<FacetQueryResponse>;
  private clearSelectionsSubject = new Subject<void>();

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    private utilsService: UtilsService
  ) {
    super(configService);
  }

  registerGetFacetsHandler(handler: (facet: Facet, searchTerm?: string, nextUrl?: string, otherFacets?: any, pageQuery?: string) => Observable<FacetQueryResponse>): void {
    this.getFacetsHandler = handler;
  }

  unregisterFacetSearchHandler(): void {
    this.getFacetsHandler = null;
  }

  get clearSelectionsEvent(): Observable<void> {
    return this.clearSelectionsSubject.asObservable();
  }

  clearSelections(): void {
    this.clearSelectionsSubject.next();
  }
}
