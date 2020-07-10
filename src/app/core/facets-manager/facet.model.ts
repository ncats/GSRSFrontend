import { DisplayFacet } from './display-facet';

/**
 * Category of substance properties.
 * Generally used to show the number of substances that have
 * a specific value (property) of the category and to filter a
 * list of substances by that property.
 */
export interface Facet {
    name: string;
    values: Array<FacetValue>;
    enhanced: boolean;
    prefix: string;
    _self: string;
    $fdim?: number;
    $total?: number;
    $fskip?: number;
    $next?: string;
    $previous?: string;
    $fetched: Array<FacetValue>;
    $showAdvanced?: boolean;
    $isLoading?: boolean;
}

/**
 * Substance property name with count of the number substances
 * that have this property
 */
export interface FacetValue {
    label: string;
    count: number;
}

export interface FacetQueryResponse {
    ftotal: number;
    fdim: number;
    fskip: number;
    fcount: number;
    ffilter: string;
    content: Array<FacetValue>;
    uri: string;
    facetName: string;
    nextPageUri: string;
    previousPageUri: string;
}

export interface FacetParam {
    [facetName: string]: FacetNameParam;
}

export interface FacetNameParam {
    isAllMatch: boolean;
    params: {
        [facetValueLabel: string]: boolean;
    };
}

export interface FacetNameParam {
    showAllMatchOption?: boolean;
    hasSelections?: boolean;
    currentStateHash?: number;
    isUpdated?: boolean;
}

export interface FacetUpdateEvent {
    facetParam: FacetParam;
    displayFacets: Array<DisplayFacet>;
    deprecated?: boolean;
}
