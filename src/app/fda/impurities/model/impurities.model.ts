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
  impuritiesTestList?: Array<ImpuritiesTest>;
  impuritiesUnspecifiedList?: Array<ImpuritiesUnspecified>;
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
}

export interface ImpuritiesTest {
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
