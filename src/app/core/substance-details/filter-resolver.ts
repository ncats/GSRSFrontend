import { HttpClient } from '@angular/common/http';
import { SubstanceCardFilterParameters } from '../config/config.model';
import { Observable } from 'rxjs';
import { SubstanceCardFilter } from './substance-cards-filter.model';
import { SubstanceDetail } from '../substance/substance.model';
import { forkJoin } from 'rxjs';

export class FilterResolver {
    private filters = [];

    constructor(
        private substance: SubstanceDetail,
        filterParameters: Array<SubstanceCardFilterParameters>,
        registeredFilters: Array<SubstanceCardFilter>,
        http: HttpClient
    ) {
        filterParameters.forEach(filterParameter => {
            const registeredFilter = registeredFilters.find(_filter => _filter.name === filterParameter.filterName);
            if (registeredFilter != null) {
                this.filters.push(registeredFilter.filter(substance, filterParameter, http));
            }
        });
    }

    resolve(): Observable<boolean> {
        return new Observable(observer => {
            if (this.filters.length > 0) {
                forkJoin(this.filters).subscribe(responses => {
                    let isApproved = true;
                    responses.forEach(response => {
                        if (!response) {
                            isApproved = false;
                        }
                    });
                    observer.next(isApproved);
                    observer.complete();
                });
            } else {
                observer.next(true);
                observer.complete();
            }
        });
    }
}
