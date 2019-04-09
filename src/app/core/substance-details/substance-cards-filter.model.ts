import { InjectionToken } from '@angular/core';
import { SubstanceDetail } from '../substance/substance.model';
import { SubstanceCardFilterParameters, SpecialRelationship } from '../config/config.model';
import { SubstanceCardFilter } from './substance-cards-filter.model';
import { Subscriber } from 'rxjs';
import { SubstanceDetailsProperty } from '../substance/substance-utilities.model';

export const SUBSTANCE_CARDS_FILTERS = new InjectionToken('SUBSTANCE_CARDS_FILTERS');

export interface SubstanceCardFilter {
    name: string;
    filter: (
        substanceUuid: string,
        filterParameters: SubstanceCardFilterParameters
    ) => SubstanceCardFilterResponse | any;
}

export interface SubstanceCardFilterResponse {
    isIncluded: boolean;
    count?: number;
}
