export interface Product {
  id?: number;
  source?: string;
  publicDomain?: number;
  appType?: string;
  appNumber?: string;
  productType?: string;
  sourceType?: string;
  unitPresentation?: string;
  routeAdmin?: string;
  status?: string;
  nonProprietaryName?: string;
  proprietaryName?: string;
  pharmacedicalDosageForm?: string;
  composeProductName?: string;
  releaseCharacteristic?: string;
  strengthCharacteristic?: string;
  countryCode?: string;
  language?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  productNameList?: Array<ProductName>;
  productCodeList?: Array<ProductCode>;
  productCompanyList?: Array<ProductCompany>;
  productComponentList?: Array<ProductComponent>;
}

export interface ProductName {
  id?: number;
  productName?: string;
  productNameType?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  productTermAndTermPartList?: Array<ProductTermAndPart>;
}

export interface ProductTermAndPart {
  id?: number;
  productTerm?: string;
  productTermPart?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
}

export interface ProductCode {
  id?: number;
  productCode?: string;
  productCodeType?: string;
  countryCode?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
}

export interface ProductCompany {
  id?: number;
  companyName?: string;
  companyAddress?: string;
  companyRole?: string;
  companyCode?: string;
  companyCodeType?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
}

export interface ProductComponent {
  id?: number;
  charSize?: string;
  charImprintText?: string;
  charColor?: string;
  charFlavor?: string;
  charShape?: string;
  charNumFragments?: string;
  dosageForm?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  productLotList?: Array<ProductLot>;
}

export interface ProductLot {
  id?: number;
  lotNo?: string;
  lotSize?: string;
  expiryDate?: Date;
  manufactureDate?: Date;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  productIngredientList?: Array<ProductIngredient>;
}

export interface ProductIngredient {
  id?: number;
  applicantIngredName?: string;
  bdnum?: string;
  basisOfStrengthBdnum?: string;
  average?: string;
  low?: string;
  high?: string;
  lowLimit?: string;
  highLimit?: string;
  nonNumericValue?: string;
  ingredientType?: string;
  unit?: string;
  grade?: string;
  manufacturer?: string;
  ingredLotNo?: string;
  releaseCharacteristic?: string;
  notes?: string;
  ingredientLocation?: string;
  reviewedBy?: string;
  reviewDate?: number;
  internalVersion?: number;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
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

