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

  getSubstanceDetailsProperties(substance: SubstanceDetail): Array<SubstanceDetailsProperty<any>> {
    const substanceDetailsProperties: Array<SubstanceDetailsProperty<any>> = [];
    const configCards = this.configService.configData.substanceDetailsCards;

    if (configCards != null && configCards.length) {
      configCards.forEach(card => {
        if (this[card]) {
          this[card](substance, substanceDetailsProperties);
        }
      });
    }

    return substanceDetailsProperties;
  }

  overview(substance: SubstanceDetail, substanceDetailsProperties: Array<SubstanceDetailsProperty<any>>): void {
    const overview: SubstanceDetailsProperty<Array<any>> = {
      name: 'overview',
      count: 0,
      data: [],
      dynamicComponentId: 'substance-overview'
    };
  }

}
