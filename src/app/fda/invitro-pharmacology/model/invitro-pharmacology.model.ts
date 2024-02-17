export interface InvitroAssayInformation {
  id?: number;
  assayId?: string;
  assayTitle?: string;
  assayFormat?: string;
  bioassayType?: string;
  bioassayClass?: string;
  studyType?: string;
  detectionMethod?: string;
  bufferPlasmaProteinConcent?: string;
  targetName?: string;
  targetNameApprovalId?: string;
  targetSpecies?: string;
  humanHomologTarget?: string;
  humanHomologTargetApprovalId?: string;
  ligandSubstrate?: string;
  ligandSubstrateApprovalId?: string;
  ligandSubstrateConcentration?: string;
  ligandSubstrateConcentrationUnits?: string;
  externalAssayId?: string;
  externalAssaySource?: string;
  externalAssayReference?: string;
  percentInhibition?: number;
  presentationType?: string;
  presentation?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  internalVersion?: number;
  _assayTargetSubId?: string;
  _ligandSubstrateSubId?: string;
  _controlSubId?: string;
  _calculateIC50?: string;
  _assayTargetSummaries?: Array<any>;
  invitroInformationReferences?: Array<InvitroInformationReferences>;
}

export interface InvitroInformationReferences {
  id?: number;
  screeningConcentration?: string;
  screeningConcentrationUnit?: string;
  assayMode?: string;
  valueObtained?: string;
  valueUnit?: string;
  assayMeasurements?: string;
  comments?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
  invitroReference?: InvitroReference;
  invitroAssayResult?: Array<InvitroAssayResult>
}

export interface InvitroReference {
  id?: number;
  referenceApplicationType?: string;
  referenceApplicationNumber?: string;
  digitalObjectIdentifier?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
  invitroSponsor?: any;
}

export interface InvitroAssayResult {
  id?: number;
  screeningConcentration?: string;
  screeningConcentrationUnit?: string;
  assayMode?: string;
  valueObtained?: string;
  valueUnit?: string;
  assayMeasurements?: string;
  comments?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
  invitroTestAgent?: InvitroTestAgent;
}

export interface InvitroTestAgent {
  id?: number;
  testAgent?: string;
  testAgentApprovalId?: string;
  testAgentSmileString?: string;
  activeMoiety?: string;
  activeMoietyApprovalId?: string;
  molecularFormulaWeight?: string;
  casRegistryNumber?: string;
  batchNumber?: string;
  purity?: string;
  solutionState?: string;
  vehicleComposition?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
}

export interface InvitroRelationship {
  id?: number;
  relationshipType?: string;
  relatedSubstance?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
}

export interface InvitroSponsor {
  id?: number;
  sponsorContactName?: string;
  sponsorAffiliation?: string;
  sponsorStreetAddress?: string;
  sponsorCity?: string;
  sponsorState?: string;
  sponsorZipcode?: string;
  sponsorCountry?: string;
  sponsorReportSubmitterName?: string;
  sponsorRepoortSubmitterTitle?: string;
  sponsorReportSubmitterAffiliation?: string;
  sponsorReportSubmitterEmail?: string;
  sponsorReportSubmitterPhoneNumber?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
}

export interface InvitroLaboratory {
  id?: number;
  laboratoryName?: string;
  laboratoryAffiliation?: string;
  laboratoryType?: string;
  laboratoryStreetAddress?: string;
  laboratoryCity?: string;
  laboratoryState?: string;
  laboratoryZipcode?: string;
  laboratoryCountry?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
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

export interface example {
  id: string;
  lastName: string;
  firstName: string;
  age: number;
}