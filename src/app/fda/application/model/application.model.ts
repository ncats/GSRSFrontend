export interface ApplicationSrs {
  id?: number;
  appType?: string;
  appNumber?: string;
  title?: string;
  sponsorName?: string;
  nonProprietaryName?: string;
  submitDate?: number;
  appSubType?: string;
  divisionClassDesc?: string;
  status?: string;
  center?: string;
  source?: string;
  publicDomain?: string;
  version?: number;
  provenance?: string;
  externalTitle?: string;
  statusDate?: number;
  applicationProductList?: Array<ProductSrs>;
  applicationIndicationList?: Array<ApplicationIndicationSrs>;
  clinicalTrialList?: Array<ClinicalTrial>;
}

export interface ProductSrs {
  id?: number;
  productName?: string;
  amount?: number;
  dosageForm?: string;
  routeAdmin?: string;
  unitPresentation?: string;
  unit?: string;
  reviewedBy?: string;
  reviewDate?: number;
  internalVersion?: number;
  applicationProductNameList?: Array<ProductNameSrs>;
  applicationIngredientList?: Array<ApplicationIngredient>;
}

export interface ProductNameSrs {
  id?: number;
  productName?: string;
  productNameType?: string;
  internalVersion?: number;
}

export interface ApplicationIngredient {
  id?: number;
  applicantIngredName?: string;
  bdnum?: string;
  internalVersion?: number;
  substanceId?: string;
  ingredientName?: string;
  activeMoietyUnii?: string;
  activeMoietyName?: string;
}

export interface ApplicationIndicationSrs {
  id?: number;
  indication?: string;
  amount?: number;
  dosageForm?: string;
  routeAdmin?: string;
  unitPresentation?: string;
  unit?: string;
  reviewedBy?: string;
  reviewDate?: number;
  internalVersion?: number;
}

export interface ClinicalTrial {
  nctNumber?: String;
}

