export interface Impurities {
  id?: number;
  source?: string;
  sourceType?: string;
  sourceId?: string;
  type?: string;
  specType?: string;
  submitterName?: string;
  productId?: string;
  productSubstanceName?: string;
  dateType?: string;
  dateTypeDate?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  impuritiesSubstanceList?: Array<ImpuritiesSubstance>;
  impuritiesTotal?: ImpuritiesTotal;
  impuritiesAdditionalRequirements?: ImpuritiesAdditionalRequirements;
  _dateTypeDate?: Date;
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
  impuritiesResidualSolventsTestList?: Array<ImpuritiesResidualSolventsTest>;
  impuritiesInorganicTestList?: Array<ImpuritiesInorganicTest>;
  impuritiesSpecificTestList?: Array<ImpuritiesSpecificTest>;
}

export interface ImpuritiesTesting {
  id?: number;
  sourceType?: string;
  source?: string;
  sourceId?: string;
  test?: string;
  testType?: string;
  buffer?: string;
  elutionType?: string;
  elutionSolvent?: string;
  elutionSolventId?: string;
  solutionADescription?: string;
  solutionBDescription?: string;
  diluent?: string;
  system?: string;
  mode?: string;
  detectionType?: string;
  detectorWavelength?: string;
  detectionDetails?: string;
  columnPackingType?: string;
  columnPackingSize?: string;
  columnSize?: string;
  columnTemperature?: string;
  autosamplerTemperature?: string;
  flowRate?: string;
  injectionVolumeAmount?: string;
  columnStationaryPhase?: string;
  runTime?: string;
  injection?: string;
  systemSuitabilitySolution?: string;
  systemSuitabilityStockSolution?: string;
  standardSolution?: string;
  standardStockSolution?: string;
  sampleSolution?: string;
  sampleStockSolution?: string;
  sensitivitySolution?: string;
  otherSolution?: string;
  systemSuitabilitySample?: string;
  systemSuitabilityReqResolution?: string;
  systemSuitabilityReqRelStandardDeviation?: string;
  systemSuitabilityReqTailingFactor?: string;
  systemSuitabilitySignalToNoiseRatio?: string;
  systemSuitabilityReqPeakValleyRatio?: string;
  testDescription?: number;
  comments?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  impuritiesSolutionList?: Array<ImpuritiesSolution>;
  impuritiesSolutionTableList?: Array<ImpuritiesSolutionTable>;
  impuritiesDetailsList?: Array<ImpuritiesDetails>;
  impuritiesUnspecifiedList?: Array<ImpuritiesUnspecified>;
  impuritiesAnalysisList?: Array<ImpuritiesAnalysis>;
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
  solutionTime?: string;
  solutionAPercent?: string;
  solutionBPercent?: string;
  solutionCPercent?: number;
  solutionDPercent?: number;
  solutionEPercent?: number;
  solutionFPercent?: number;
  solutionGPercent?: number;
  solutionHPercent?: number;
  solutionIPercent?: number;
  solutionJPercent?: number;
  solutionAHeader?: string;
  solutionBHeader?: string;
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
  _sourceImpurityStructureImage?: string;
  chemicalStructure?: string | null;      // IUPAC name or SMILES
  structureImage?: string | null;         // Base64 encoded image
  molecularFormula?: string | null;       // e.g., C17H19N3O3S
  impurityLetter?: string;                // e.g., A, B, C, D
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

export interface ImpuritiesAnalysis {
  id?: number;
  samples?: string;
  description?: string;
  resultFormula?: string;
  formulaRU?: string;
  formulaRS?: string;
  formulaCS?: string;
  formulaCU?: string;
  formulaP?: string;
  formulaF?: string;
  formulaMR1?: string;
  formulaMR2?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
}

export interface ImpuritiesResidualSolventsTest {
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
  analysis?: string;
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

export interface ImpuritiesInorganicTest {
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
  limitValue?: string;
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

export interface ImpuritiesSpecificTest {
  id?: number;
  testType?: string;
  sampleSolution?: string;
  analysis?: string;
  acceptanceCriteria?: string;
  otherDescription?: string;
  comments?: string;
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
  limitType?: string;
  unit?: string;
  comments?: string;
  createdBy?: string;
  createDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
}

export interface ImpuritiesAdditionalRequirements {
  id?: number;
  referenceStandards?: string;
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

export interface ImpurityStructure {
  impurityCode: string;                    // A, B, C, etc.
  chemicalName: string;                    // IUPAC name
  alternateName?: string;                  // Common name
  molecularFormula?: string | null;        // e.g., C17H19N3O3S
  casNumber?: string | null;               // CAS Registry Number
  structureRepresentation?: string;        // ASCII structure from PDF
  
  // Fields populated by REST API calls
  smiles?: string | null;                  // Canonical SMILES
  inchi?: string | null;                   // InChI
  inchiKey?: string | null;                // InChIKey
  molFile?: string | null;                 // MOL/SDF format
  pubchemCid?: number | null;              // PubChem Compound ID
  
  searchable: boolean;                     // Whether enough data for search
}