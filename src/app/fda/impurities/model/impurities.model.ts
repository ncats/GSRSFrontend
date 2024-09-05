export interface Impurities {
  id?: number;
  sourceType?: string;
  source?: string;
  sourceId?: string;
  type?: string;
  specType?: string;
  productSubstanceName?: string;
  submitterName?: string;
  productId?: string;
  dateType?: string;
  dateTypeDate?: string;
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
  approvalID?: string;
  low?: number;
  high?: number;
  unit?: string;
  comments?: string;
  substanceName?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  _ingredientName?: string;
  _parentSubstanceName?: string;
  _parentSubstanceUuid?: string;
  impuritiesTestList?: Array<ImpuritiesTesting>;
  impuritiesResidualSolventsTestList?: Array<ImpuritiesResidualSolventsTest>;  //new 3.1
 // impuritiesResidualSolventsList?: Array<ImpuritiesResidualSolvents>; //new 3.1, need to remove this for 3.1
  impuritiesInorganicTestList?: Array<ImpuritiesInorganicTest>;  //new 3.1
 // impuritiesInorganicList?: Array<ImpuritiesInorganic>;  //new 3.1, need to remove this for 3.1
}

export interface ImpuritiesTesting {
  id?: number;
  sourceType?: string;
  source?: string;
  sourceId?: string;
  system?: string;
  mode?: string;
  detectionType?: string;
  detectionDetails?: string;
  columnPackingType?: string;
  columnPackingSize?: string;
  columnSize?: string;
  columnTemperature?: string;
  flowRate?: string;
  injectionVolumeAmount?: string;
  diluent?: string;
  standardSolution?: string;
  sampleSolution?: string;
  systemSuitabilitySolution?: string;
  otherSolution?: string;
  solutionADescription?: string;
  solutionBDescription?: string;
  suitabilityReqResolution?: string;
  suitabilityReqRelStandardDeviation?: string;
  elutionType?: string;
  elutionSolvent?: string;
  elutionSolventId?: string;
  test?: string;
  testType?: string;
  testDescription?: number;
  comments?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  impuritiesSolutionList?: Array<ImpuritiesSolution>;
  impuritiesSolutionTableList?: Array<ImpuritiesSolutionTable>;
  impuritiesElutionSolventList?: Array<ImpuritiesElutionSolvent>;
  impuritiesDetailsList?: Array<ImpuritiesDetails>;
  impuritiesUnspecifiedList?: Array<ImpuritiesUnspecified>;
}

export interface ImpuritiesElutionSolvent {
  id?: number;
  elutionSolvent?: string;
  elutionSolventCode?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
}

export interface ImpuritiesSolution {
  id?: number;
  solutionTime?: string;
  solutionDescription?: string;
  solutionLetter?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
}

export interface ImpuritiesSolutionTable {
  id?: number;
  solutionTime?: number;
  solutionAPercent?: number;
  solutionBPercent?: number;
  solutionCPercent?: number;
  solutionDPercent?: number;
  solutionEPercent?: number;
  solutionFPercent?: number;
  solutionGPercent?: number;
  solutionHPercent?: number;
  solutionIPercent?: number;
  solutionJPercent?: number;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
}

export interface ImpuritiesDetails {
  id?: number;
  relatedSubstanceUuid?: string;
  impurityType?: string;
  testType?: string;
  sourceImpurityName?: string;
  limitValue?: number;
  limitType?: string;
  unit?: string;
  comments?: string;
  substanceName?: string;
  relatedSubstanceUnii?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  _ingredientName?: string;
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

export interface ImpuritiesResidualSolventsTest {    //new 3.1
  id?: number;
  sourceType?: string;
  source?: string;
  sourceId?: string;
  test?: string;
  testType?: string;
  testDescription?: number;
  comments?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  impuritiesResidualSolventsList?: Array<ImpuritiesResidualSolvents>;
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
  relatedSubstanceUnii?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
}

export interface ImpuritiesInorganicTest {    //new 3.1
  id?: number;
  sourceType?: string;
  source?: string;
  sourceId?: string;
  test?: string;
  testType?: string;
  testDescription?: number;
  comments?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  impuritiesInorganicList?: Array<ImpuritiesInorganic>;
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
  relatedSubstanceUnii?: string;
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
