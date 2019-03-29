import { SubstanceCardFilter } from './substance-cards-filter.model';
import { SubstanceDetail } from '../substance/substance.model';
import { SubstanceCardFilterParameters, SpecialRelationship } from '../config/config.model';
import { SubstanceDetailsProperty } from '../substance/substance-utilities.model';
import { getEvaluatedProperty } from './substance-cards-utils';

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
        name: 'substanceCodes',
        filter: substanceCodesFilter
    },
    {
        name: 'substanceRelationships',
        filter: substanceRelationshipsFilter
    }
];


export function equalsFilter (
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters
): boolean {
    if (filter.value != null && filter.propertyToCheck != null) {
        if (!filter.value.indexOf('|') && substance[filter.propertyToCheck] === filter.value) {
            return true;
        } else if (filter.value.indexOf('|')) {
            const values = filter.value.split('|');
            for (let i = 0; i < values.length; i++) {
                if (substance[filter.propertyToCheck] === values[i]) {
                    return true;
                }
            }
        }
        return false;
    }
}

export function equalsInArrayFilter (
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters
): boolean {
    if (filter.value != null && filter.propertyToCheck != null && filter.propertyInArray != null) {
        for (let i = 0; i < substance[filter.propertyToCheck].length; i++) {
            if ((substance[filter.propertyToCheck][i][filter.propertyInArray]) === filter.value) {
                return true;
            }
        }
        return false;
    }
}

export function existsFilter(
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters
): boolean {
    if (filter.propertyToCheck != null) {
        const evaluatedProperty = getEvaluatedProperty(substance, filter.propertyToCheck);
        if (evaluatedProperty != null
            && (Object.prototype.toString.call(evaluatedProperty) !== '[object Array]'
                || evaluatedProperty.length)) {
            return true;
        }
    }
    return false;
}

export function substanceCodesFilter(
    substance: SubstanceDetail
): Array<SubstanceDetailsProperty> {

    const substanceDetailsProperties: Array<SubstanceDetailsProperty> = [];

    const classification: SubstanceDetailsProperty = {
        title: 'classification',
        count: 0,
        dynamicComponentId: 'substance-codes',
        type: 'classification'
    };

    const identifiers: SubstanceDetailsProperty = {
        title: 'identifiers',
        count: 0,
        dynamicComponentId: 'substance-codes',
        type: 'identifiers'
    };

    if (substance.codes && substance.codes.length > 0) {
        substance.codes.forEach(code => {
            if (code.comments && code.comments.indexOf('|') > -1) {
                classification.count++;
            } else {
                identifiers.count++;
            }
        });
    }

    if (classification.count > 0) {
        substanceDetailsProperties.push(classification);
    }

    if (identifiers.count > 0) {
        substanceDetailsProperties.push(identifiers);
    }

    return substanceDetailsProperties;
}

export function substanceRelationshipsFilter(
    substance: SubstanceDetail,
    filter: SubstanceCardFilterParameters,
    specialRelationships: Array<SpecialRelationship>
): Array<SubstanceDetailsProperty> {
    const substanceDetailsProperties: Array<SubstanceDetailsProperty> = [];

    const properties: { [type: string]: SubstanceDetailsProperty } = {};

    if (substance.relationships && substance.relationships.length > 1) {
        substance.relationships.forEach(relationship => {
            const typeParts = relationship.type.split('->');
            const property = typeParts && typeParts.length && typeParts[0].trim() || '';
            let propertyName: string;
            let type: string;

            if (specialRelationships && specialRelationships.length) {
                for (let i = 0; i < specialRelationships.length; i++) {
                    if (property.toLowerCase()
                        .indexOf(specialRelationships[i].type.toLowerCase()) > -1) {
                        propertyName = specialRelationships[i].display;
                        type = specialRelationships[i].type;
                        break;
                    }
                }
            }

            if (propertyName == null || type == null) {
                propertyName = 'relationships';
                type = 'RELATIONSHIPS';
            }

            if (!properties[propertyName]) {
                properties[propertyName] = {
                    title: propertyName,
                    count: 0,
                    dynamicComponentId: 'substance-relationships',
                    type: type
                };
            }
            properties[propertyName].count++;
        });
    }

    Object.keys(properties).forEach(key => {
        substanceDetailsProperties.push(properties[key]);
    });

    return substanceDetailsProperties;
}
