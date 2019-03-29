import { Injectable, Inject } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { SubstanceDetailsProperty } from '../substance/substance-utilities.model';
import { SubstanceDetail } from '../substance/substance.model';
import { SUBSTANCE_CARDS_FILTERS } from './substance-cards-filter.model';
import { SubstanceCardFilter } from './substance-cards-filter.model';
import { getEvaluatedProperty } from './substance-cards-utils';

@Injectable()
export class SubstanceCardsService {

  constructor(
    public configService: ConfigService,
    @Inject(SUBSTANCE_CARDS_FILTERS) private filters: Array<Array<SubstanceCardFilter>>
  ) { }

  getSubstanceDetailsProperties(substance: SubstanceDetail): Array<SubstanceDetailsProperty> {
    const filtersList = this.filters.reduce((acc, val) => acc.concat(val), []);
    let substanceDetailsProperties: Array<SubstanceDetailsProperty> = [];
    const configCards = this.configService.configData.substanceDetailsCards;
    let propertyTocheck = null;
    if (configCards != null && configCards.length) {
      configCards.forEach(card => {
        let isAddCard = true;
        let countSubstanceProperty = false;
        if (card.filters && card.filters.length) {
          const responses = [];
          let isCardIncluded = true;
          card.filters.forEach(cardFilter => {
            const filter = filtersList.find(_filter => _filter.name === cardFilter.filterName);
            if (filter != null) {
              propertyTocheck = getEvaluatedProperty(substance, cardFilter.propertyToCheck);
              const response = filter.filter(substance, cardFilter, this.configService.configData.specialRelationships);
              if (response === false) {
                isCardIncluded = false;
                isAddCard = false;
              } else if (
                response === true
                && propertyTocheck != null
                && Object.prototype.toString.call(propertyTocheck) === '[object Array]') {
                countSubstanceProperty = true;
              }
              responses.push(response);
            } else {
              isAddCard = false;
            }
          });

          if (isCardIncluded) {
            responses.forEach(response => {
              if (typeof response !== 'boolean') {
                isAddCard = false;
                substanceDetailsProperties = substanceDetailsProperties.concat(response);
              }
            });
          }
        }

        if (isAddCard) {

          const detailsProperty: SubstanceDetailsProperty = {
            title: card.title || '',
            count: countSubstanceProperty && propertyTocheck.length || null,
            dynamicComponentId: card.card
          };
          substanceDetailsProperties.push(detailsProperty);
        }
      });
    }

    return substanceDetailsProperties;
  }
}
