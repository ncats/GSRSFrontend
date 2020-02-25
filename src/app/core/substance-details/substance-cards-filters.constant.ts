import { SubstanceCardFilter } from './substance-cards-filter.model';
import { SubstanceDetail } from '../substance/substance.model';
import { SubstanceCardFilterParameters } from '../config/config.model';
import { getEvaluatedProperty } from './substance-cards-utils';
import { Observable } from 'rxjs';
import { AuthService} from '@gsrs-core/auth/auth.service';
import {HttpClient} from '@angular/common/http';

export const substanceCardsFilters: Array<SubstanceCardFilter> = [
    {
        name: 'equals',
        filter: equalsFilter
    },
    {
        name: 'equals_in_array',
        filter: equalsInArrayFilter
    },
    {
        name: 'exists',
        filter: existsFilter
    },
    {
      name: 'anyExists',
      filter: anyExistsFilter
    },
    {
        name: 'substanceCodes',
        filter: substanceCodesFilter
    },
    {
        name: 'substanceRelationships',
        filter: substanceRelationshipsFilter
    },
    {
      name: 'hasCredentials',
      filter: credentialsFilter
    }
];


export function equalsFilter(
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters
): Observable<boolean> {
    return new Observable(observer => {
        let isApproved = false;
        if (filter.value != null && filter.propertyToCheck != null) {
            if (!filter.value.indexOf('|') && substance[filter.propertyToCheck] === filter.value) {
                isApproved = true;
            } else if (filter.value.indexOf('|')) {
                const values = filter.value.split('|');
                for (let i = 0; i < values.length; i++) {
                    if (substance[filter.propertyToCheck] === values[i]) {
                        isApproved = true;
                        break;
                    }
                }
            }
            observer.next(isApproved);
            observer.complete();
        }
    });
}

export function equalsInArrayFilter(
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters
): Observable<boolean> {
    return new Observable(observer => {
        let isApproved = false;
        if (filter.value != null && filter.propertyToCheck != null && filter.propertyInArray != null) {
            for (let i = 0; i < substance[filter.propertyToCheck].length; i++) {
                if ((substance[filter.propertyToCheck][i][filter.propertyInArray]) === filter.value) {
                    isApproved = true;
                    break;
                }
            }
        }
        observer.next(isApproved);
        observer.complete();
    });
}

export function existsFilter(
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters
): Observable<boolean> {
    return new Observable(observer => {
        let isApproved = false;
        if (filter.propertyToCheck != null) {
            const evaluatedProperty = getEvaluatedProperty(substance, filter.propertyToCheck);
            if (evaluatedProperty != null
                && (Object.prototype.toString.call(evaluatedProperty) !== '[object Array]'
                    || evaluatedProperty.length)) {
                isApproved = true;
            }
        }
        observer.next(isApproved);
        observer.complete();
    });
}

export function anyExistsFilter(
  substance: SubstanceDetail,
  filter: SubstanceCardFilterParameters
): Observable<boolean> {
  return new Observable(observer => {
    let isApproved = false;
    if (filter.propertyToCheck != null) {
      const evaluatedProperties = filter.propertyToCheck.split('|');
      evaluatedProperties.forEach( property => {
        const evaluatedProperty = getEvaluatedProperty(substance, property);
        if (evaluatedProperty != null
          && (evaluatedProperty.length && evaluatedProperty.length > 0)) {
          isApproved = true;
        }
      });
    }
    observer.next(isApproved);
    observer.complete();
  });
}

export function substanceCodesFilter(
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters
): Observable<boolean> {
    return new Observable(observer => {

        let isApproved = false;

        if (substance.codes && substance.codes.length > 0) {
            for (let i = 0; i < substance.codes.length; i++) {
                if (substance.codes[i].comments && substance.codes[i].comments.indexOf('|') > -1 && filter.value === 'classification') {
                    isApproved = true;
                    break;
                } else if (filter.value === 'identifiers') {
                    isApproved = true;
                    break;
                }
            }
        }

        observer.next(isApproved);
        observer.complete();
    });
}

export function substanceRelationshipsFilter(
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters
): Observable<boolean> {
    return new Observable(observer => {

        let isApproved = false;

        if (substance.relationships && substance.relationships.length > 0) {

            for (let i = 0; i < substance.relationships.length; i++) {
                const typeParts = substance.relationships[i].type;
                const property = typeParts && typeParts.trim() || '';

                if (filter.value instanceof Array) {
                    let isInExcludeValues = false;
                    filter.value.forEach(value => {
                        if (property.toLowerCase().indexOf(value.toLowerCase()) > -1) {
                            isInExcludeValues = true;
                        }
                    });
                    if (!isInExcludeValues) {
                        isApproved = true;
                        break;
                    }
                } else if (property.toLowerCase().indexOf(filter.value.toLowerCase()) > -1) {
                    isApproved = true;
                    break;
                }
            }
        }
        observer.next(isApproved);
        observer.complete();
    });
}

  export function credentialsFilter(
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters,
    http: HttpClient,
    auth: AuthService
  ): Observable<boolean> {
    return new Observable(observer => {

      let isApproved = false;
      if (filter.propertyToCheck != null) {
        if (auth.hasRoles(filter.propertyToCheck) === true) {
          isApproved = true;
        }
      }
      observer.next(isApproved);
      observer.complete();
    });
}

