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
  //invitroInformationReferences?: Array<InvitroInformationReferences>;
  invitroAssayScreenings?: Array<InvitroAssayScreening>;
}

export interface InvitroAssayScreening {
  id?: number;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
  invitroReference?: InvitroReference;
  invitroTestAgent?: InvitroTestAgent;
  invitroAssayResult?: InvitroAssayResult;
  invitroControls?: Array<InvitroControl>;
 // invitroAssayInfoRefTestAgents?: Array<InvitroAssayInfoReferenceTestAgent>;
}

export interface InvitroInformationReferences {
  id?: number;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
  invitroReference?: InvitroReference;
  invitroAssayInfoRefTestAgents?: Array<InvitroAssayInfoReferenceTestAgent>;
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

export interface InvitroAssayInfoReferenceTestAgent {
  id?: number;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
  invitroTestAgent?: InvitroTestAgent;
  invitroAssayResult?: Array<InvitroAssayResult>
  invitroControls?: Array<InvitroControl>;
  invitroSummary?: InvitroSummary;
  invitroLaboratory?: InvitroLaboratory;
  invitroSubmitterReport?: invitroSubmitterReport;
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

export interface InvitroAssayResult {
  id?: number;
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
  summaryTestAgent?: string;
  summaryTargetName?: string;
  relationshipType?: string;
  resultType?: string;
  result?: string;
  resultUnits?: string;
  amountType?: string;
  amountAverage?: number;
  amountLow?: number;
  amountHigh?: number;
  amountUnits?: string;
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

export interface invitroSubmitterReport {
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