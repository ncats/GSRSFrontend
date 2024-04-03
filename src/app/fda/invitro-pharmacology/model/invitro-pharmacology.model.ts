export interface InvitroAssayInformation {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  assayId?: string;
  externalAssayId?: string;
  externalAssaySource?: string;
  externalAssayReferenceUrl?: string;
  assayTitle?: string;
  assayFormat?: string;
  assayMode?: string;
  bioassayType?: string;
  bioassayClass?: string;
  studyType?: string;
  detectionMethod?: string;
  presentationType?: string;
  presentation?: string;
  publicDomain?: string;
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
  _assayTargetSubId?: string;
  _ligandSubstrateSubId?: string;
  _controlSubId?: string;
  _calculateIC50?: string;
  _assayTargetSummaries?: Array<any>;
  _existingAssayList?: Array<any>;
  invitroAssaySets?: Array<InvitroAssaySet>;
  invitroAssayScreenings?: Array<InvitroAssayScreening>;
  invitroSummaries?: Array<InvitroSummary>;
}

export interface InvitroAssaySet {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  assaySet?: string;
}

export interface InvitroAssayScreening {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  invitroReference?: InvitroReference;
  invitroSponsorReport?: InvitroSponsorReport;
  invitroLaboratory?: InvitroLaboratory;
  invitroTestAgent?: InvitroTestAgent;
  invitroAssayResult?: InvitroAssayResult;
  invitroControls?: Array<InvitroControl>;
}

export interface InvitroReference {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  referenceSourceType?: string;
  referenceSource?: string;
  digitalObjectIdentifier?: string;
  invitroSponsor?: InvitroSponsor;
}

export interface InvitroSponsor {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  sponsorContactName?: string;
  sponsorAffiliation?: string;
  sponsorStreetAddress?: string;
  sponsorCity?: string;
  sponsorState?: string;
  sponsorZipcode?: string;
  sponsorCountry?: string;
}

export interface InvitroSponsorReport {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  reportNumber?: string;
  reportDate?: number;
  invitroSponsorSubmitters?: Array<InvitroSponsorSubmitter>;
}

export interface InvitroSponsorSubmitter {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  sponsorReportSubmitterName?: string;
  sponsorRepoortSubmitterTitle?: string;
  sponsorReportSubmitterAffiliation?: string;
  sponsorReportSubmitterEmail?: string;
  sponsorReportSubmitterPhoneNumber?: string;
  sponsorReportSubmitterAssayType?: string;
}

export interface InvitroLaboratory {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  laboratoryName?: string;
  laboratoryAffiliation?: string;
  laboratoryType?: string;
  laboratoryStreetAddress?: string;
  laboratoryCity?: string;
  laboratoryState?: string;
  laboratoryZipcode?: string;
  laboratoryCountry?: string;
}

export interface InvitroTestAgent {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  testAgent?: string;
  testAgentApprovalId?: string;
  testAgentSubstanceUuid?: string;
  testAgentSmileString?: string;
  testAgentMolecularFormulaWeight?: string;
  activeMoiety?: string;
  activeMoietyApprovalId?: string;
  casRegistryNumber?: string;
  batchNumber?: string;
  purity?: string;
  vehicleComposition?: string;
}

export interface InvitroAssayResult {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  testAgentConcentration?: number;
  testAgentConcentrationUnits?: string;
  resultValue?: number;
  resultValueUnits?: string;
  ligandSubstrateConcentration?: number;
  ligandSubstrateConcentrationUnits?: string;
  plasmaProteinAdded?: string;
  plasmaProtein?: string;
  plasmaProteinConcentration?: number;
  plasmaProteinConcentrationUnits?: string;
  dataType?: string;
  numberOfTests?: string;
  comments?: string;
  assayMeasurement?: string;
}

export interface InvitroControl {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  control?: string;
  controlApprovalId?: string;
  controlType?: string;
  controlReferenceValue?: string;
  controlReferenceValueUnits?: string;
  resultType?: string;
}

export interface InvitroSummary {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  testAgent?: string;
  relationshipType?: string;
  interactionType?: string;
  resultType?: string;
  resultValueAverage?: number;
  resultValueLow?: number;
  resultValueHigh?: number;
  resultValueUnits?: string;
  comments?: string;
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