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
  provenanceProductId?: string; //new 3.1
  provenanceDocumentId?: string; //new 3.1
  deaschedule?: string; //new 3.1
  startMarketingDate?: string; //new 3.1
  endMarketingDate?: string; //new 3.1
  marketingCategoryCode?: string; //new 3.1
  marketingCategoryName?: string; //new 3.1
  productCodeUrl?: string; //new 3.1
  shelfLife ?: string; //new 3.1
  storageConditions?: string;  //new 3.1
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
 // provenanceSourceProductId?: string; //new 3.1
 // provenanceSourceProductNdc?: string; //new 3.1
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
}

export interface ProductCompany {
  id?: number;
  companyName?: string;
  companyAddress?: string;
  companyCity?: string;
  companyState?: string;
  companyZip?: string;
  companyCountry?: string;
  companyRole?: string;
  companyCode?: string;
  companyCodeType?: string;
  registrantName?: string; //new 3.1
  registrantDUNS?: string; //new 3.1
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  productCompanyCodeList?: Array<ProductCompanyCode>;
}

export interface ProductCompanyCode {
  id?: number;
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
  dosageFormCode?: string;
  dosageFormCodeType?: string;
  dosageForm?: string;
  amount?: string;
  unit?: string;
  manufactureCode?: string;
  manufactureCodeType?: string;
  manufactureItemCodeType?: string;

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
  substanceKey?: string;
  substanceKeyType?: string;
  basisOfStrengthSubstanceKey?: string;
  basisOfStrengthSubstanceKeyType?: string;
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
  confidentialityCode?: string;
  originalNumeratorNumber?: string;
  originalNumeratorUnit?: string;
  originalDenominatorNumber?: string;
  originalDenominatorUnit?: string;
  reviewedBy?: string;
  reviewDate?: number;
  internalVersion?: number;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  $$ingredientNameValidation?: string;
  $$basisOfStrengthValidation?: string;
}

export interface ProductAll {
  id?: number;
  appTypeNumber?: string;
  appType?: string;
  appNumber?: string;
  /*
  source?: string;
  publicDomain?: number;
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
  */
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

