export interface Impurities {
  id?: number;
  substanceUuid?: string;
  source?: string;
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
  impuritiesDetailsList?: Array<ImpuritiesDetails>;
  impuritiesUnspecifiedList?: Array<ImpuritiesUnspecified>;
  impuritiesTotal?: ImpuritiesTotal;
}

export interface ImpuritiesDetails {
  id?: number;
  relatedSubstanceUuid?: string;
  impurityType?: string;
  testType?: string;
  limit?: number;
  limitType?: string;
  unit?: string;
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
  limit?: number;
  limitType?: string;
  unit?: string;
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
  limit?: string;
  limitType?: number;
  amountValue?: string;
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
