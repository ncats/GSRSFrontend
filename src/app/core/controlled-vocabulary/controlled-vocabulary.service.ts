import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseHttpService } from '../base/base-http.service';
import { Observable, Subject, forkJoin } from 'rxjs';
import { Vocabulary, VocabularyTerm, VocabularyDictionary } from './vocabulary.model';
import { ConfigService } from '../config/config.service';
import { PagingResponse } from '../utils/paging-response.model';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ControlledVocabularyService extends BaseHttpService {
  private vocabularyDictionary: VocabularyDictionary = {};
  private vocabularySubject: { [domain: string]: Subject<VocabularyDictionary> } = {};
  private vocabularyLoadingIndicators: { [domain: string]: boolean } = {};

  constructor(
    public http: HttpClient,
    public configService: ConfigService
  ) {
    super(configService);
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

  getDomainVocabulary(...domainArgs: Array<string>): Observable<VocabularyDictionary> {

    const domains = [...domainArgs];
    let vocabularyDictionary = {};
    const missingDomains = [];
    const tasks$ = [];

    domains.forEach(domain => {

      if (this.vocabularyDictionary[domain] != null) {
        vocabularyDictionary[domain] = this.vocabularyDictionary[domain];
      } else if (this.vocabularyLoadingIndicators[domain] === true) {
        tasks$.push(this.vocabularySubject[domain]);
      } else {
        this.vocabularyLoadingIndicators[domain] = true;
        if (this.vocabularySubject[domain] == null) {
          this.vocabularySubject[domain] = new Subject();
        }
        missingDomains.push(domain);
      }
    });

    return new Observable(observer => {
      if (missingDomains.length > 0) {
        tasks$.push(this.fetchVocabulariesFromServer(...missingDomains));
      }

      if (tasks$.length > 0) {
        const subscription = forkJoin(tasks$).subscribe(responses => {
          responses.forEach(response => {
            vocabularyDictionary = Object.assign(vocabularyDictionary, response);
          });
          observer.next(vocabularyDictionary);
          observer.complete();
          subscription.unsubscribe();
        }, error => {
          observer.error(error);
          observer.complete();
          subscription.unsubscribe();
        });
      } else {
        observer.next(vocabularyDictionary);
        observer.complete();
      }
    });
  }

  private fetchVocabulariesFromServer(...domainArgs: Array<string>): Observable<VocabularyDictionary> {

    const url = `${this.apiBaseUrl}vocabularies/search`;
    let params = new HttpParams();
    params = params.append('top', '100000');

    const domains = [...domainArgs];
    const unProcessedDomains = domains.slice();

    let domainLuceneQuery = '';

    const responseDomainVocabulary: VocabularyDictionary = {};

    domains.forEach((domain, index) => {
      this.vocabularyLoadingIndicators[domain] = true;
      if (this.vocabularySubject[domain] == null) {
        this.vocabularySubject[domain] = new Subject();
      }

      responseDomainVocabulary[domain] = {
        dictionary: {},
        list: []
      };

      if (index > 0) {
        domainLuceneQuery += ' OR ';
      }

      domainLuceneQuery += `root_domain:${domain}`;

    });

    params = params.append('q', domainLuceneQuery);

    const options = {
      params: params
    };

    return this.http.get<PagingResponse<Vocabulary>>(url, options).pipe(
      map((response: PagingResponse<Vocabulary>) => {

        if (response.content && response.content.length) {

          response.content.forEach(vocabulary => {

            const singleDomainVocabulary: VocabularyDictionary = {};

            if (vocabulary.terms && vocabulary.terms.length) {

              if (!singleDomainVocabulary[vocabulary.domain]) {
                singleDomainVocabulary[vocabulary.domain] = {
                  dictionary: {}
                };
              }

              singleDomainVocabulary[vocabulary.domain].list = vocabulary.terms;
              vocabulary.terms.forEach(vocabularyTerm => {
                singleDomainVocabulary[vocabulary.domain].dictionary[vocabularyTerm.value] = vocabularyTerm;
              });
            }

            this.vocabularySubject[vocabulary.domain].next(singleDomainVocabulary);
            this.vocabularySubject[vocabulary.domain].complete();
            this.vocabularySubject[vocabulary.domain] = null;
            responseDomainVocabulary[vocabulary.domain] = singleDomainVocabulary[vocabulary.domain];
            this.vocabularyDictionary[vocabulary.domain] = responseDomainVocabulary[vocabulary.domain];
            this.vocabularyLoadingIndicators[vocabulary.domain] = false;

            unProcessedDomains.splice(unProcessedDomains.indexOf(vocabulary.domain), 1);
          });

          if (unProcessedDomains && unProcessedDomains.length) {
            unProcessedDomains.forEach(domain => {
              const singleDomainVocabulary: VocabularyDictionary = {};
              singleDomainVocabulary[domain] = { dictionary: {}, list: [] };
              this.vocabularySubject[domain].next(singleDomainVocabulary);
              this.vocabularySubject[domain].complete();
              this.vocabularySubject[domain] = null;
            });
          }

        } else {
          domains.forEach((domain, index) => {
            const singleDomainVocabulary: VocabularyDictionary = {};
            singleDomainVocabulary[domain] = { dictionary: {}, list: [] };
            this.vocabularySubject[domain].next(singleDomainVocabulary);
            this.vocabularySubject[domain].complete();
            this.vocabularyLoadingIndicators[domain] = false;
          });
        }

        return responseDomainVocabulary;
      })
    );
  }
}
