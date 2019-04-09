import { SubstanceCardFilterParameters } from '../config/config.model';
import { SubstanceCardFilterResponse } from './substance-cards-filter.model';
import { Observable, Subscriber } from 'rxjs';
import { SubstanceCardFilter } from './substance-cards-filter.model';
import { SSL_OP_NETSCAPE_REUSE_CIPHER_CHANGE_BUG } from 'constants';

export class FilterResolver {
    filters: Array<Filter> = [];
    observer: Subscriber<SubstanceCardFilterResponse>;

    constructor(
        substanceUuid: string,
        filterParameters: Array<SubstanceCardFilterParameters>,
        registeredFilters: Array<SubstanceCardFilter>
    ) {
        filterParameters.forEach(filterParameter => {
            const registeredFilter = registeredFilters.find(_filter => _filter.name === filterParameter.filterName);
            if (registeredFilter != null) {
                const filter = new Filter(registeredFilter.filter);
                this.filters.push(filter);
            }
        });
    }

    resolve(): Observable<SubstanceCardFilterResponse> {
        return new Observable(observer => {
            if (this.filters.length > 0) {
                this.filters.forEach(filter => {
                    filter.filter();
                });
                this.observer = observer;
            }
        });
    }
}

class Filter {
    isApproved?: boolean;
    filter: (
        substanceUuid: string,
        filterParameters: SubstanceCardFilterParameters
    ) => Observable<SubstanceCardFilterResponse>;
    constructor(registeredFilter: (
            substanceUuid: string,
            filterParameters: SubstanceCardFilterParameters
        ) => Observable<SubstanceCardFilterResponse>
    ) {
        this.filter = registeredFilter;
    }
}
