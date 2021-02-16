export interface Impurities {
  id?: number;
  sourceType?: string;
  source?: string;
  sourceId?: string;
  type?: string;
  specType?: string;
  companyProductName?: string;
  companyName?: string;
  productId?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  impuritiesSubstanceList?: Array<ImpuritiesSubstance>;
  impuritiesTotal?: ImpuritiesTotal;
}

export interface ImpuritiesSubstance {
  id?: number;
  substanceUuid?: string;
  low?: number;
  high?: number;
  unit?: string;
  substanceName?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  impuritiesTestList?: Array<ImpuritiesTesting>;
}

export interface ImpuritiesTesting {
  id?: number;
  test?: string;
  testType?: string;
  testDescription?: number;
  comments?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  impuritiesDetailsList?: Array<ImpuritiesDetails>;
  impuritiesUnspecifiedList?: Array<ImpuritiesUnspecified>;
  impuritiesResidualSolventsList?: Array<ImpuritiesResidualSolvents>;
  impuritiesInorganicList?: Array<ImpuritiesInorganic>;
}

export interface ImpuritiesDetails {
  id?: number;
  relatedSubstanceUuid?: string;
  impurityType?: string;
  testType?: string;
  limitValue?: number;
  limitType?: string;
  unit?: string;
  comments?: string;
  substanceName?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  identityCriteriaList?: Array<IdentityCriteria>;
}

export interface IdentityCriteria {
  id?: number;
  identityCriteriaType?: string;
  amountValue?: string;
  unit?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
}

export interface ImpuritiesUnspecified {
  id?: number;
  impurityType?: string;
  testType?: string;
  limitValue?: number;
  limitType?: string;
  unit?: string;
  comments?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  identityCriteriaList?: Array<IdentityCriteria>;
}

export interface ImpuritiesResidualSolvents {
  id?: number;
  relatedSubstanceUuid?: string;
  pharmaceuticalLimit?: string;
  testType?: string;
  limitValue?: number;
  limitType?: string;
  unit?: string;
  comments?: string;
  substanceName?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
}

export interface ImpuritiesInorganic {
  id?: number;
  relatedSubstanceUuid?: string;
  testType?: string;
  limitValue?: number;
  limitType?: string;
  unit?: string;
  comments?: string;
  substanceName?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
}

export interface ImpuritiesTotal {
  id?: number;
  testType?: string;
  limitValue?: string;
  limitType?: number;
  amountValue?: string;
  comments?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
}

export interface SubRelationship {
  id?: string;
  substanceId?: string;
  ownerBdnum?: string;
  relationshipType?: string;
  relationshipUuid?: string;
  relationshipName?: string;
  relationshipUnii?: string;
}

export interface ValidationResults {
  valid?: boolean;
  validationMessages?: Array<ValidationMessage>;
}

export interface ValidationMessage {
  actionType?: string;
  appliedChange?: boolean;
  links?: Array<MessageLink>;
  message?: string;
  messageType?: string;
  suggestedChange?: boolean;
}

export interface MessageLink {
  href: string;
  text: string;
}
