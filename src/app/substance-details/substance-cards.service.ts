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

  private getEvaluatedProperty(substance: any, propertyToCheck?: string): any {
    if (propertyToCheck == null) {
      return null;
    } else if (propertyToCheck.indexOf('.') > -1) {
      const properties = propertyToCheck.split('.');
      let evaluatedObject = substance;
      const lastIndex = properties.length - 1;
      for (let i = 0; i < properties.length; i++) {
        if (i !== lastIndex) {
          if (evaluatedObject[properties[i]] != null
            && Object.prototype.toString.call(evaluatedObject[properties[i]]) === '[object Object]') {
            evaluatedObject = evaluatedObject[properties[i]];
          } else {
            return null;
          }
        } else {
          return evaluatedObject[properties[i]];
        }
      }
    } else {
      return substance[propertyToCheck];
    }
  }

  getSubstanceDetailsProperties(substance: SubstanceDetail): Array<SubstanceDetailsProperty> {
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
          card.filters.forEach(filter => {
            if (this[filter.filterName]) {
              propertyTocheck = this.getEvaluatedProperty(substance, filter.propertyToCheck);
              const response = this[filter.filterName](substance, filter);
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

    if (filter.propertyToCheck != null) {
      const evaluatedProperty = this.getEvaluatedProperty(substance, filter.propertyToCheck);

      if (evaluatedProperty != null
        && (Object.prototype.toString.call(evaluatedProperty) !== '[object Array]'
          || evaluatedProperty.length)) {
        return true;
      }
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
          console.log(property);
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
          } else if (property.indexOf('TARGET') > -1) {
            propertyName = 'targets';
            type = 'TARGET';
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
