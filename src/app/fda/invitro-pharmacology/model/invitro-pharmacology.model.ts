export interface InvitroAssayInformation {
  id?: number;
  assayId?: string;
  externalAssayId?: string;
  externalAssaySource?: string;
  externalAssayReference?: string;
  externalAssayReferenceUrl?: string;
  assaySet?: string;
  assayTitle?: string;
  assayFormat?: string;
  bioassayType?: string;
  bioassayClass?: string;
  studyType?: string;
  detectionMethod?: string;
  bufferPlasmaProteinConcent?: string;
  targetName?: string;
  targetNameApprovalId?: string;
  targetNameSubstanceUuid?: string;
  targetSpecies?: string;
  humanHomologTarget?: string;
  humanHomologTargetApprovalId?: string;
  ligandSubstrate?: string;
  ligandSubstrateApprovalId?: string;
  ligandSubstrateConcentration?: string;
  ligandSubstrateConcentrationUnits?: string;
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
  invitroAssaySets?: Array<InvitroAssaySet>;
  invitroAssayScreenings?: Array<InvitroAssayScreening>;
  invitroSummaries?: Array<InvitroSummary>;
}

export interface InvitroAssaySet {
  id?: number;
  assaySet?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
}

export interface InvitroAssayScreening {
  id?: number;
  invitroReference?: InvitroReference;
  invitroTestAgent?: InvitroTestAgent;
  invitroAssayResult?: InvitroAssayResult;
  invitroControls?: Array<InvitroControl>;
  invitroLaboratory?: InvitroLaboratory;
  invitroSubmitterReport?: InvitroSubmitterReport;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
}

export interface InvitroReference {
  id?: number;
  referenceSourceType?: string;
  referenceSourceNumber?: string;
  digitalObjectIdentifier?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
  invitroSponsor?: InvitroSponsor;
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
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
}

export interface InvitroTestAgent {
  id?: number;
  testAgent?: string;
  testAgentApprovalId?: string;
  testAgentSubstanceUuid?: string;
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

export interface InvitroAssayResult {
  id?: number;
  plasmaProteinAdded?: string;
  plasmaProtein?: string;
  plasmaProteinConcentration?: string;
  plasmaProteinConcentrationUnits?: string;
  dataType?: string;
  numberOfTests?: string;
  testAgentConcentration?: number;
  testAgentConcentrationUnits?: string;
  testConcentrationActiveMoiety?: number;
  testConcentrationUnitsActiveMoiety?: string;
  resultValue?: number;
  resultValueUnits?: string;
  assayMode?: string;
  assayMeasurement?: string;
  comments?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
}

export interface InvitroControl {
  id?: number;
  control?: string;
  controlApprovalId?: string;
  controlType?: string;
  controlReferenceValue?: string;
  controlReferenceValueUnits?: string;
  resultType?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
}

export interface InvitroSummary {
  id?: number;
  testAgent?: string;
  relationshipType?: string;
  interactionType?: string;
  resultType?: string;
  resultValueAverage?: number;
  resultValueLow?: number;
  resultValueHigh?: number;
  resultValueUnits?: string;
  comments?: string;
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

export interface InvitroSubmitterReport {
  id?: number;
  reportNumber?: string;
  reportDate?: number;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
  invitroSponsorSubmitters?: Array<InvitroSponsorSubmitter>;
}

export interface InvitroSponsorSubmitter {
  id?: number;
  sponsorReportSubmitterName?: string;
  sponsorRepoortSubmitterTitle?: string;
  sponsorReportSubmitterAffiliation?: string;
  sponsorReportSubmitterEmail?: string;
  sponsorReportSubmitterPhoneNumber?: string;
  sponsorReportSubmitterAssayType?: string;
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