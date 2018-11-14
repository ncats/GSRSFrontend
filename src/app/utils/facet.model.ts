export interface Facet {
    name: string;
    values: Array<LabelCount>;
    enhanced: boolean;
    prefix: string;
    _self: string;
}

export interface LabelCount {
    label: string;
    count: number;
}
