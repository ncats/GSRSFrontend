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
    $fetched: Array<FacetValue>;
    $showAdvanced?: boolean;
}

/**
 * Substance property name with count of the number substances
 * that have this property
 */
export interface FacetValue {
    label: string;
    count: number;
}
