import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpClientJsonpModule, HttpParameterCodec } from '@angular/common/http';
import { interval, Observable, Observer, Subject } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { BaseHttpService } from '../base/base-http.service';
import {
  SubstanceSummary,
  SubstanceDetail,
  SubstanceEdit,
  SubstanceName,
  SubstanceCode,
  SubstanceRelationship,
  SubstanceRelated,
  SubstanceReference
} from '../substance/substance.model';
import { PagingResponse, ShortResult } from '../utils/paging-response.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FacetParam } from '../facets-manager/facet.model';
import { FacetHttpParams } from '../facets-manager/facet-http-params';
import { UtilsService } from '../utils/utils.service';
import { switchMap, map, catchError, takeWhile } from 'rxjs/operators';
import { ValidationResults} from '@gsrs-core/substance-form/substance-form.model';
import {Facet, FacetQueryResponse} from '@gsrs-core/facets-manager';
import { StructuralUnit } from '@gsrs-core/substance';
import {HierarchyNode} from '@gsrs-core/substances-browse/substance-hierarchy/hierarchy.model';
import { stringify } from 'querystring';

export class BulkQueryService extends BaseHttpService {
    constructor(
        public http: HttpClient,
        public configService: ConfigService,
        private sanitizer: DomSanitizer,
        private utilsService: UtilsService,
      ) {
        super(configService);
      }



    saveBulkSearch(list: string, user: string) {
        const url = this.apiBaseUrl + 'substances/@bulkQueryResultList';
        list = '5b611b0d-b798-45ed-ba02-6f0a2f85986b,302cedcc-895f-421c-acf4-1348bbdb31f4,79dbcc59-e887-40d1-a0e3-074379b755e4,0e65128d-05e2-4b89-bc68-30a1c555fc2d';
        return this.http.post<any>(url, list);
      }
    
}
