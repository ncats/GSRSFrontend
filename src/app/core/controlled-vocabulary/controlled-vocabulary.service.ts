import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BaseHttpService } from '@gsrs-core/base/base-http.service';
import { Observable, Subject, forkJoin } from 'rxjs';
import { Vocabulary, VocabularyTerm, VocabularyDictionary } from '@gsrs-core/controlled-vocabulary/vocabulary.model';
import { ConfigService } from '@gsrs-core/config/config.service';
import { PagingResponse } from '@gsrs-core/utils/paging-response.model';
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

  getStructure(structure: string) {
    const url = this.baseUrl + 'render?structure=' + structure + '&size=150&standardize=true';
    return this.http.get(url);
  }
  getStructureUrl(structure: string) {
    structure = structure.replace(/[;]/g, '%3B')
    .replace(/[#]/g, '%23')
    .replace(/[+]/g, '%2B')
    .replace(/[|]/g, '%7C');
    const url = this.baseUrl + 'render?structure=' + structure + '&size=150&standardize=true';
    return url;
  }

  getStructureUrlFragment(structure: string) {
    structure = structure.replace(/%/g, "%25").replace(/#/g, "%23").replace(/[;]/g, "%3B").replace(/[+]/g, "%2B");
    const url = this.baseUrl + 'render?structure=' + structure + '&size=150&standardize=true';
    return url;
  }
  
  
  search(domain: string, query: string): Observable<Array<VocabularyTerm>> {
    return new Observable(observer => {
      const subscription = this.getDomainVocabulary(domain).subscribe(response => {
        const filteredTerms = response[domain].list.filter(term => term.value.toLowerCase().indexOf(query.toLowerCase()) > -1);
        let sortedTerms = [];

        if (filteredTerms != null && filteredTerms.length) {
          sortedTerms = filteredTerms.sort((termA, termB) => {
            if (termA < termB) {
              return -1;
            }
            if (termA > termB) {
              return 1;
            }
            return 0;
          });
        }

        observer.next(sortedTerms);
        subscription.unsubscribe();
      });
    });
  }

  public fetchFullVocabulary(domain: string): Observable<any> {

    const url = `${this.apiBaseUrl}vocabularies/search`;
    let params = new HttpParams();
    params = params.append('top', '100000');

    let domainLuceneQuery = '';
    const responseDomainVocabulary: VocabularyDictionary = {};
    this.vocabularyLoadingIndicators[domain] = true;
    if (this.vocabularySubject[domain] == null) {
      this.vocabularySubject[domain] = new Subject();
    }

    responseDomainVocabulary[domain] = {
      dictionary: {},
      list: []
    };

    domainLuceneQuery += `root_domain:${domain}`;
    params = params.append('q', domainLuceneQuery);
    const options = {
      params: params
    };
    return this.http.get<PagingResponse<Vocabulary>>(url, options);
  }

  public addVocabTerm(vocab: any): Observable<any> {
    const url = `${this.apiBaseUrl}vocabularies`;
    return this.http.put( url, vocab);
  }

  public getFragmentCV(): Observable<any> {
    const url = `${this.apiBaseUrl}vocabularies/search?facet=ix.Class/ix.ginas.models.v1.FragmentControlledVocabulary`;
    return this.http.get(url);
  
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
              // eslint-disable-next-line prefer-arrow-functions
              singleDomainVocabulary[vocabulary.domain].list = vocabulary.terms.sort(function(a, b) {
                const termA = (a.display && a.display.toUpperCase()) || (a.value && a.value.toUpperCase()) || '';
                const termB = (b.display && b.display.toUpperCase()) || (b.value && b.value.toUpperCase()) || '';
                if (termA < termB) {
                  return -1;
                }
                if (termA > termB) {
                  return 1;
                }
                return 0;
              });


              vocabulary.terms.forEach(vocabularyTerm => {
                singleDomainVocabulary[vocabulary.domain].dictionary[vocabularyTerm.value] = vocabularyTerm;
              });
            }

            if (this.vocabularySubject[vocabulary.domain] != null) {
              this.vocabularySubject[vocabulary.domain].next(singleDomainVocabulary);
              this.vocabularySubject[vocabulary.domain].complete();
              this.vocabularySubject[vocabulary.domain] = null;
              responseDomainVocabulary[vocabulary.domain] = singleDomainVocabulary[vocabulary.domain];
              this.vocabularyDictionary[vocabulary.domain] = responseDomainVocabulary[vocabulary.domain];
              this.vocabularyLoadingIndicators[vocabulary.domain] = false;
            }

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
