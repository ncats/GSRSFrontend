import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseHttpService } from '../base/base-http.service';
import { Observable, Subject, observable } from 'rxjs';
import { ConfigService } from '../config/config.service';
import { SubstanceSuggestionsGroup } from './substance-suggestions-group.model';
import { Vocabulary, VocabularyTerm } from './vocabulary.model';
import { PagingResponse } from './paging-response.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class UtilsService extends BaseHttpService {
  private vocabularies: { [domain: string]: { [vocabularyValue: string]: VocabularyTerm } } = {};
  private vocabularySubject: { [domain: string]: Subject<{ [vocabularyValue: string]: VocabularyTerm }> } = {};
  private vocabularyLoadingIndicators: { [domain: string]: boolean } = {};
  private bodyElement: HTMLBodyElement;
  private matSidenavContentElement: HTMLElement;

  constructor(
    public http: HttpClient,
    public configService: ConfigService,
    private sanitizer: DomSanitizer
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

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=${size.toString()}`;
    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
  }

  getDomainVocabulary(domain: string): Observable<{ [vocabularyValue: string]: VocabularyTerm }> {
    return new Observable(observer => {

      if (this.vocabularies[domain] != null) {
        observer.next(this.vocabularies[domain]);
        observer.complete();
      } else if (this.vocabularyLoadingIndicators[domain] === true) {
        const subscription = this.vocabularySubject[domain].subscribe(response => {
          observer.next(response);
          observer.complete();
          subscription.unsubscribe();
        }, error => {
          observer.error(error);
          observer.complete();
          subscription.unsubscribe();
        });
      } else {
        const subscription = this.fetchVocabulariesFromServer(domain).subscribe(response => {
          observer.next(response);
          observer.complete();
          subscription.unsubscribe();
        }, error => {
          observer.error(error);
          observer.complete();
          subscription.unsubscribe();
        });
      }
    });
  }

  private fetchVocabulariesFromServer(domain: string): Subject<{ [vocabularyValue: string]: VocabularyTerm }> {

    this.vocabularyLoadingIndicators[domain] = true;

    if (this.vocabularySubject[domain] == null) {
      this.vocabularySubject[domain] = new Subject();
    }

    const url = `${this.apiBaseUrl}vocabularies`;

    let params = new HttpParams();
    const filter = `domain=\'${domain}\'`;
    params = params.append('filter', filter);

    const options = {
      params: params
    };

    this.http.get<PagingResponse<Vocabulary>>(url, options).subscribe(response => {
      if (response.content && response.content.length) {

        const domainVocabulary = {};

        response.content.forEach(vocabulary => {
          if (vocabulary.terms && vocabulary.terms.length) {
            vocabulary.terms.forEach(vocabularyTerm => {
              domainVocabulary[vocabularyTerm.value] = vocabularyTerm;
            });
          }
        });

        this.vocabularySubject[domain].next(domainVocabulary);
        this.vocabularies[domain] = domainVocabulary;
        this.vocabularyLoadingIndicators[domain] = false;
      } else {
        this.vocabularySubject[domain].next({});
        this.vocabularyLoadingIndicators[domain] = false;
      }
    }, error => {
      this.vocabularySubject[domain].error(error);
    });

    return this.vocabularySubject[domain];
  }

  handleMatSidenavOpen(widthBreakingPoint?: number): void {

    if (widthBreakingPoint == null || window.innerWidth < widthBreakingPoint) {
      this.bodyElement = document.getElementsByTagName('BODY')[0] as HTMLBodyElement;
      this.matSidenavContentElement = document.getElementsByTagName('mat-sidenav-content')[0] as HTMLElement;

      this.bodyElement.style.overflowX = 'hidden';
      this.matSidenavContentElement.style.width = `${this.matSidenavContentElement.offsetWidth}px`;
    } else {
      this.handleMatSidenavClose();
    }
  }

  handleMatSidenavClose(): void {
    if (this.bodyElement != null || this.matSidenavContentElement != null) {
      setTimeout(() => {
        this.bodyElement.style.overflowX = null;
        this.matSidenavContentElement.style.width = null;
        this.bodyElement = null;
        this.matSidenavContentElement = null;
      }, 500);
    }
  }
}
