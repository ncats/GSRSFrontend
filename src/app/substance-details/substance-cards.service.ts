import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { SubstanceDetailsProperty } from '../substance/substance-utilities.model';
import { SubstanceDetail, SubstanceCode, SubstanceRelationship } from '../substance/substance.model';
import { SubstanceDetailsCardFilter } from '../config/config.model';

@Injectable({
  providedIn: 'root'
})
export class SubstanceCardsService {

  constructor(
    public configService: ConfigService
  ) { }

  getSubstanceDetailsProperties(substance: SubstanceDetail): Array<SubstanceDetailsProperty> {
    let substanceDetailsProperties: Array<SubstanceDetailsProperty> = [];
    const configCards = this.configService.configData.substanceDetailsCards;

    if (configCards != null && configCards.length) {
      configCards.forEach(card => {
        let isAddCard = true;
        let countSubstanceProperty: string;
        if (card.filters && card.filters.length) {
          const responses = [];
          let isCardIncluded = true;
          card.filters.forEach(filter => {
            if (this[filter.filterName]) {
              const response = this[filter.filterName](substance, filter);
              if (response === false) {
                isCardIncluded = false;
                isAddCard = false;
              } else if (
                response === true
                && filter.propertyToCheck
                && substance[filter.propertyToCheck]
                && Object.prototype.toString.call(substance[filter.propertyToCheck]) === '[object Array]') {
                  countSubstanceProperty = filter.propertyToCheck;
              }
              responses.push(response);
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
            count: countSubstanceProperty
              && substance[countSubstanceProperty]
              && Object.prototype.toString.call(substance[countSubstanceProperty]) === '[object Array]'
              && (substance[countSubstanceProperty].length || 0),
            dynamicComponentId: card.card
          };
          substanceDetailsProperties.push(detailsProperty);
        }
      });
    }

    return substanceDetailsProperties;
  }

  equals(
    substance: SubstanceDetail,
    filter: SubstanceDetailsCardFilter
  ): boolean {
    if (filter.value != null && filter.propertyToCheck != null) {

      if (!filter.value.indexOf('|') && substance[filter.propertyToCheck] === filter.value) {
        return true;
      } else if (filter.value.indexOf('|')) {
        const values = filter.value.split('|');
        for (let i = 0; i < values.length; i++) {
          if (substance[filter.propertyToCheck] === values[i]) {
            return true;
          }
        }
      }
      return false;
    }
  }

  exists(
    substance: SubstanceDetail,
    filter: SubstanceDetailsCardFilter
  ): boolean {
    if (filter.propertyToCheck != null
      && substance[filter.propertyToCheck] != null
      && (Object.prototype.toString.call(substance[filter.propertyToCheck]) !== '[object Array]'
        || substance[filter.propertyToCheck].length)) {
      return true;
    }
    return false;
  }

  substanceCodes(
    substance: SubstanceDetail
  ): Array<SubstanceDetailsProperty> {

    const substanceDetailsProperties: Array<SubstanceDetailsProperty> = [];

    const classification: SubstanceDetailsProperty = {
      title: 'classification',
      count: 0,
      dynamicComponentId: 'substance-codes',
      type: 'classification'
    };

    const identifiers: SubstanceDetailsProperty = {
      title: 'identifiers',
      count: 0,
      dynamicComponentId: 'substance-codes',
      type: 'identifiers'
    };

    if (substance.codes && substance.codes.length > 0) {
      substance.codes.forEach(code => {
        if (code.comments && code.comments.indexOf('|') > -1) {
          classification.count++;
        } else {
          identifiers.count++;
        }
      });
    }

    if (classification.count > 0) {
      substanceDetailsProperties.push(classification);
    }

    if (identifiers.count > 0) {
      substanceDetailsProperties.push(identifiers);
    }

    return substanceDetailsProperties;
  }

  substanceRelationships(
    substance: SubstanceDetail
  ): Array<SubstanceDetailsProperty> {
    const substanceDetailsProperties: Array<SubstanceDetailsProperty> = [];

    const properties: { [type: string]: SubstanceDetailsProperty } = {};

    if (substance.relationships && substance.relationships.length > 1) {
      substance.relationships.forEach(relationship => {
        const typeParts = relationship.type.split('->');
        const property = typeParts[0].trim();
        if (property) {
          let propertyName: string;
          let type: string;
          if (property.indexOf('METABOLITE') > -1) {
            propertyName = 'metabolites';
            type = 'METABOLITE';
          } else if (property.indexOf('IMPURITY') > -1) {
            propertyName = 'impurities';
            type = 'IMPURITY';
          } else if (property.indexOf('ACTIVE MOIETY') > -1) {
            propertyName = 'active moiety';
            type = 'ACTIVE MOIETY';
          }
          if (!properties[propertyName]) {
            properties[propertyName] = {
              title: propertyName,
              count: 0,
              dynamicComponentId: 'substance-relationships',
              type: type
            };
          }
          properties[propertyName].count++;
        }
      });
    }

    Object.keys(properties).forEach(key => {
      substanceDetailsProperties.push(properties[key]);
    });

    return substanceDetailsProperties;
  }
}
