import { InjectionToken } from '@angular/core';
import { SubstanceDetail } from '../substance/substance.model';
import { SubstanceCardFilterParameters, SpecialRelationship } from '../config/config.model';

export const SUBSTANCE_CARDS_FILTERS = new InjectionToken('SUBSTANCE_CARDS_FILTERS');

export interface SubstanceCardFilter {
    name: string;
    filter: (
        substance: SubstanceDetail,
        filterParameters?: SubstanceCardFilterParameters,
        specialRelationships?: Array<SpecialRelationship>
    ) => any;
}
