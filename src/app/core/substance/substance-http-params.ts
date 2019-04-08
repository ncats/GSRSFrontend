import { HttpParams } from '@angular/common/http';
import { SubstanceFacetParam } from './substance-facet-param.model';
import { HttpParamsOptions } from '@angular/common/http/src/params';

export class SubstanceHttpParams extends HttpParams {

    constructor(options?: HttpParamsOptions) {
        super(options);
    }

    appendFacetParams(facets: SubstanceFacetParam): SubstanceHttpParams {
        let clone = new SubstanceHttpParams({ fromString: super.toString() });
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
                                (`${paramPrefix}${facetKey.replace(/-/g, '%2D')}/${facetValueKey.replace(/-/g, '%2D')}`));
                        }
                    });
                }
            });
        }
        return clone;
    }

    append(param: string, value: string): SubstanceHttpParams {
        const httpParamsClone = super.append(param, value);
        const clone = new SubstanceHttpParams({ fromString: httpParamsClone.toString() });
        return clone;
    }

    appendDictionary(params: {
        [name: string]: string
    }): SubstanceHttpParams {
        let clone = new SubstanceHttpParams({ fromString: super.toString() });
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
