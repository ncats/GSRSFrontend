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
  provenance?: string;
  provenanceProductId?: string;
  provenanceDocumentId?: string;
  deaschedule?: string;
  marketingCategoryCode?: string;
  marketingCategoryName?: string;
  productUrl?: string;
  shelfLife ?: string;
  storageConditions?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  productNames?: Array<ProductName>;
  productCodes?: Array<ProductCode>;
  productCompanies?: Array<ProductCompany>;
  productIndications?: Array<ProductIndication>;
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
  jurisdictions?: string;
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
  startMarketingDate?: string;
  endMarketingDate?: string;
  companyProductId?: string;
  companyDocumentId?: string;
  provenanceDocumentId?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  productCompanyCodes?: Array<ProductCompanyCode>;
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

export interface ProductIndication {
  id?: number;
  Indication?: string;
  indicationText?: string;
  indicationCode?: string;
  indicationCodeType?: string;
  indicationGroup?: string;
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
  dosageFormCode?: string;
  dosageFormCodeType?: string;
  dosageFormNote?: string;
  compositionNote?: string;
  amount?: string;
  unit?: string;
  provenanceManufactureItemId?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  productManufacturers?: Array<ProductManufacturer>;
  productLotList?: Array<ProductLot>;
}

export interface ProductManufacturer {
  id?: number;
  manufacturerName?: string;
  manufacturerRole?: string;
  manufacturerCodeType?: string;
  manufacturedItemCode?: string;
  manufacturedItemCodeType?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
}

export interface ProductLot {
  id?: number;
  lotNo?: string;
  lotSize?: string;
  lotType?: string;
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

