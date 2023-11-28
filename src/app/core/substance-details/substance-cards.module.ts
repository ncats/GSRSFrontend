import {
  ModuleWithProviders,
  NgModule
} from '@angular/core';
import { SubstanceCardFilter, SUBSTANCE_CARDS_FILTERS } from './substance-cards-filter.model';
import { SubstanceCardsService } from './substance-cards.service';

@NgModule()
export class SubstanceCardsModule {
  static forRoot(filters: Array<SubstanceCardFilter>): ModuleWithProviders<any> {
    return {
      ngModule: SubstanceCardsModule,
      providers: [
        SubstanceCardsService,
        { provide: SUBSTANCE_CARDS_FILTERS, useValue: filters, multi: true }
      ],
    };
  }
}
