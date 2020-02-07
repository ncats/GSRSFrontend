import { HttpClient } from '@angular/common/http';
import { SubstanceCardFilter } from '@gsrs-core/substance-details';
import { SubstanceDetail } from '@gsrs-core/substance';
import { SubstanceCardFilterParameters } from '@gsrs-core/config';
import { Observable } from 'rxjs';

export const fdaSubstanceCardsFilters: Array<SubstanceCardFilter> = [
    {
        name: 'fdaSample',
        filter: fdaSampleFilter
    },
    {
        name: 'products',
        filter: productsFilter
    }
];

export function fdaSampleFilter(
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters,
    http: HttpClient
): Observable<boolean> {
    return new Observable(observer => {
        observer.next(true);
        observer.complete();
    });
}

export function productsFilter(
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters,
    http: HttpClient
): Observable<boolean> {
    return new Observable(observer => {
        http.get('/assets/data/gsrs-products-test.json').subscribe((response: Array<any>) => {

            if (response && response.length) {
                observer.next(true);
            } else {
                observer.next(false);
            }
            observer.complete();
        });
    });
}
