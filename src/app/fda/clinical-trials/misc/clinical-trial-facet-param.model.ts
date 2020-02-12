export interface ClinicalTrialFacetParam {
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
