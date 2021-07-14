import { HttpParams, HttpParameterCodec } from '@angular/common/http';
import { FacetParam } from '@gsrs-core/facets-manager';

export class FacetHttpParams extends HttpParams {

    constructor(options?: any) {
        super(options);
    }

    appendFacetParams(facets: FacetParam, deprecated?: boolean): FacetHttpParams {
        let clone = new FacetHttpParams({ fromString: super.toString() , encoder: new CustomEncoder()});
        let hasDeprecated = false;
        if (facets != null) {
            const facetsKeys = Object.keys(facets);
            facetsKeys.forEach(facetKey => {
                if (facets[facetKey] != null) {
                    const facetValueKeys = Object.keys(facets[facetKey].params);
                    facetValueKeys.forEach((facetValueKey) => {
                        if (facets[facetKey].params[facetValueKey] != null) {
                            if (facetValueKey === 'Deprecated' && facets[facetKey].params[facetValueKey] !== true) {
                                    hasDeprecated = true;
                            } else {
                            const paramPrefix = !facets[facetKey].params[facetValueKey] ? '!' :
                                facets[facetKey].isAllMatch ? '^' : '';

                            clone = clone.append(
                                'facet',
                                (`${paramPrefix}${facetKey.replace(/\//g, '$$$')}/${facetValueKey.replace(/\//g, '$$$')}`));
                            }
                        }
                    });
                }
            });
        }
      if (deprecated) {
          // empty line
          
      } else if (!hasDeprecated) {
          // __alex__dontcommit
          // cause ct browse listing to not work? 
          clone = clone.append('facet', 'Deprecated/Not Deprecated');
        }
        return clone;
    }

    append(param: string, value: string): FacetHttpParams {
        const httpParamsClone = super.append(param, value);
        const clone = new FacetHttpParams({ fromString: httpParamsClone.toString() , encoder: new CustomEncoder()});
        return clone;
    }

    appendDictionary(params: {
        [name: string]: string
    }): FacetHttpParams {
        let clone = new FacetHttpParams({ fromString: super.toString() , encoder: new CustomEncoder()});
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


class CustomEncoder implements HttpParameterCodec {
    encodeKey(key: string): string {
      return encodeURIComponent(key);
    }

    encodeValue(value: string): string {
      return encodeURIComponent(value);
    }

    decodeKey(key: string): string {
      return decodeURIComponent(key);
    }

    decodeValue(value: string): string {
      return decodeURIComponent(value);
    }
  }
