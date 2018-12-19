import { Injectable } from '@angular/core';
import { ConfigService } from '../config/config.service';
import { SubstanceDetailsProperty } from '../substance/substance-utilities.model';
import { SubstanceDetail, SubstanceCode, SubstanceRelationship } from '../substance/substance.model';

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
        card.filters.forEach(filter => {
          if (this[filter.filterName]) {
            this[filter.filterName](card.card, substance, substanceDetailsProperties);
          }
        });
      });
    }

    return substanceDetailsProperties;
  }

  equals(card: string, substance: SubstanceDetail, substanceDetailsProperties: Array<SubstanceDetailsProperty>): void {
    const overview: SubstanceDetailsProperty = {
      name: '',
      count: 0,
      dynamicComponentId: card
    };
  }

}
