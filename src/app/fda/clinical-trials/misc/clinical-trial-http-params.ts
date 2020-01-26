import { HttpParams } from '@angular/common/http';
import { ClinicalTrialFacetParam } from './clinical-trial-facet-param.model';
import { HttpParamsOptions } from '@angular/common/http/src/params';

export class ClinicalTrialHttpParams extends HttpParams {

    constructor(options?: HttpParamsOptions) {
        super(options);
    }

    appendFacetParams(facets: ClinicalTrialFacetParam): ClinicalTrialHttpParams {
        let clone = new ClinicalTrialHttpParams({ fromString: super.toString() });
        if (facets != null) {
            const facetsKeys = Object.keys(facets);
            facetsKeys.forEach(facetKey => {
                if (facets[facetKey] != null) {
                    const facetValueKeys = Object.keys(facets[facetKey].params);
                    facetValueKeys.forEach((facetValueKey) => {
                        if (facets[facetKey].params[facetValueKey] != null) {

                            const paramPrefix = !facets[facetKey].params[facetValueKey] ? '!' :
                                facets[facetKey].isAllMatch ? '^' : '';

                            clone = clone.append(
                                'facet',
                                (`${paramPrefix}${facetKey.replace(/\//g, '$$$')}/${facetValueKey.replace(/\//g, '$$$')}`));
                        }
                    });
                }
            });
        }
        return clone;
    }

    append(param: string, value: string): ClinicalTrialHttpParams {
        const httpParamsClone = super.append(param, value);
        const clone = new ClinicalTrialHttpParams({ fromString: httpParamsClone.toString() });
        return clone;
    }

    appendDictionary(params: {
        [name: string]: string
    }): ClinicalTrialHttpParams {
        let clone = new ClinicalTrialHttpParams({ fromString: super.toString() });
        if (params != null) {
            const keys = Object.keys(params);

            if (keys != null && keys.length) {
                keys.forEach(key => {
                    if (params[key] != null && params[key] !== '') {
                        clone = clone.append(key, params[key].toString());
                    }
                });
            }
        }
        return clone;
    }
}
