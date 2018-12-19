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
    const substanceDetailsProperties: Array<SubstanceDetailsProperty> = [];
    const configCards = this.configService.configData.substanceDetailsCards;

    if (configCards != null && configCards.length) {
      configCards.forEach(card => {
        if (card.filters && card.filters.length) {
          card.filters.forEach(filter => {
            if (this[filter.filterName]) {
              this[filter.filterName](substance, substanceDetailsProperties, filter, card.card, card.title);
            }
          });
        } else {
          const detailsProperty: SubstanceDetailsProperty = {
            title: card.title || '',
            count: 0,
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
    substanceDetailsProperties: Array<SubstanceDetailsProperty>,
    filter: SubstanceDetailsCardFilter,
    dynamicComponentId: string,
    title?: string,
  ): void {
    if (filter.value != null && filter.propertyToCheck != null) {
      const property: SubstanceDetailsProperty = {
        title: title || '',
        count: 0,
        dynamicComponentId: dynamicComponentId
      };

      if (!filter.value.indexOf('|') && substance[filter.propertyToCheck] === filter.value) {
        substanceDetailsProperties.push(property);
      } else if (filter.value.indexOf('|')) {
        const values = filter.value.split('|');
        for (let i = 0; i < values.length; i++) {
          if (substance[filter.propertyToCheck] === values[i]) {
            substanceDetailsProperties.push(property);
            break;
          }
        }
      }
    }
  }

  exists(
    substance: SubstanceDetail,
    substanceDetailsProperties: Array<SubstanceDetailsProperty>,
    filter: SubstanceDetailsCardFilter,
    dynamicComponentId: string,
    title?: string,
  ): void {
    if (filter.propertyToCheck != null && substance[filter.propertyToCheck] != null) {
      const property: SubstanceDetailsProperty = {
        title: title || '',
        count: substance[filter.propertyToCheck].length || 0,
        dynamicComponentId: dynamicComponentId
      };
      substanceDetailsProperties.push(property);
    }
  }

  substanceCodes(
    substance: SubstanceDetail,
    substanceDetailsProperties: Array<SubstanceDetailsProperty>
  ): void {
    const classification: SubstanceDetailsProperty = {
      title: 'classification',
      count: 0,
      dynamicComponentId: 'substance-codes'
    };

    const identifiers: SubstanceDetailsProperty = {
      title: 'identifiers',
      count: 0,
      dynamicComponentId: 'substance-codes'
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
  }

  substanceRelationships(
    substance: SubstanceDetail,
    substanceDetailsProperties: Array<SubstanceDetailsProperty>
  ): void {
    const properties: { [type: string]: SubstanceDetailsProperty } = {};

    if (substance.relationships && substance.relationships.length > 1) {
      substance.relationships.forEach(relationship => {
        const typeParts = relationship.type.split('->');
        const property = typeParts[0].trim();
        if (property) {
          let propertyName: string;
          if (property.indexOf('METABOLITE') > -1) {
            propertyName = 'metabolites';
          } else if (property.indexOf('IMPURITY') > -1) {
            propertyName = 'impurities';
          } else if (property.indexOf('ACTIVE MOIETY') > -1) {
            propertyName = 'active moiety';
          }
          if (!properties[propertyName]) {
            properties[propertyName] = {
              title: propertyName,
              count: 0,
              dynamicComponentId: 'substance-relationships'
            };
          }
          properties[propertyName].count++;
        }
      });
    }

    Object.keys(properties).forEach(key => {
      substanceDetailsProperties.push(properties[key]);
    });
  }
}
