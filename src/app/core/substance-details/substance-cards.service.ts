import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config/config.service';
import { SubstanceDetailsProperty } from '../substance/substance-utilities.model';
import { SubstanceDetail } from '../substance/substance.model';
import { SUBSTANCE_CARDS_FILTERS } from './substance-cards-filter.model';
import { SubstanceCardFilter } from './substance-cards-filter.model';
import { Observable } from 'rxjs';
import { FilterResolver } from './filter-resolver';
import {AuthService} from '@gsrs-core/auth/auth.service';

@Injectable()
export class SubstanceCardsService {

  constructor(
    public configService: ConfigService,
    @Inject(SUBSTANCE_CARDS_FILTERS) private filters: Array<Array<SubstanceCardFilter>>,
    public http: HttpClient,
    public auth: AuthService
  ) { }

  getSubstanceDetailsPropertiesAsync(substance: SubstanceDetail, source?: string): Observable<SubstanceDetailsProperty> {
    return new Observable(observer => {
      const registeredFilters = this.filters.reduce((acc, val) => acc.concat(val), []);
      const configCards = this.configService.configData.substanceDetailsCards;
      if (configCards != null && configCards.length) {
        configCards.forEach((card, index) => {
          const order = card.order != null ? card.order : index;
          const substanceDetailsProperty = new SubstanceDetailsProperty(
            card.title || card.type || '',
            null,
            card.card,
            card.type,
            order
          );
          // hard filter cards incompatible with staging area records (revisit if staging model changes significantly)
          if (source && source === 'staging' && (card.card === 'substance-history' || card.card === 'substance-audit-info' || card.card === 'substance-hierarchy' || card.card === 'fda-substance-product')) {          
              observer.next(null);
          } else {
          if (card.filters && card.filters.length) {
            const filterResolver = new FilterResolver(substance, card.filters, registeredFilters, this.http, this.auth);
            filterResolver.resolve().subscribe(response => {
              if (response) {
                observer.next(substanceDetailsProperty);
              } else {
                observer.next(null);
              }
            });
          } else {
            observer.next(substanceDetailsProperty);
          }
        }
        });
      }

    });
  }
}
