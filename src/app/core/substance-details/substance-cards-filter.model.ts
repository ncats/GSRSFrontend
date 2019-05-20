import { InjectionToken } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SubstanceDetail } from '../substance/substance.model';
import { SubstanceCardFilterParameters } from '../config/config.model';
import { SubstanceCardFilter } from './substance-cards-filter.model';
import { Subscriber, Observable } from 'rxjs';
import { SubstanceDetailsProperty } from '../substance/substance-utilities.model';

export const SUBSTANCE_CARDS_FILTERS = new InjectionToken('SUBSTANCE_CARDS_FILTERS');

export interface SubstanceCardFilter {
    name: string;
    filter: (
        substance: SubstanceDetail,
        filterParameters: SubstanceCardFilterParameters,
        http?: HttpClient
    ) => Observable<boolean>;
}
