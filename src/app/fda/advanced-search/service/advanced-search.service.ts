import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ConfigService } from '@gsrs-core/config';
import { BaseHttpService } from '@gsrs-core/base';
import { PagingResponse } from '@gsrs-core/utils';
import { Observable, } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { Facet } from '@gsrs-core/facets-manager';

@Injectable()
export class AdvancedSearchService extends BaseHttpService {

  totalRecords: 0;

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
  ) {
    super(configService);
  }

}
