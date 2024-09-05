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
  targetNameSubstanceKey?: string;
  targetNameSubstanceKeyType?: string;
  targetSpecies?: string;
  humanHomologTarget?: string;
  humanHomologTargetApprovalId?: string;
  humanHomologTargetSubstanceKey?: string;
  humanHomologTargetSubstanceKeyType?: string;
  ligandSubstrate?: string;
  ligandSubstrateApprovalId?: string;
  ligandSubstrateSubstanceKey?: string;
  ligandSubstrateSubstanceKeyType?: string;
  standardLigandSubstrateConcentration?: string;
  standardLigandSubstrateConcentrationUnits?: string;
  _assayTargetSubId?: string;
  _ligandSubstrateSubId?: string;
  _controlSubId?: string;
  _calculateIC50?: string;
  _resultInformationList?: Array<any>;
  _assayTargetSummaries?: Array<any>;
  _existingAssayList?: Array<any>;
  _totalResultRecords?: number;
  _totalSummaryRecords?: number;
  _assaySet?: string;
  invitroAssayAnalytes?: Array<InvitroAssayAnalyte>;
  invitroAssaySets?: Array<InvitroAssaySet>;
  invitroAssayScreenings?: Array<InvitroAssayScreening>;
  //invitroSummaries?: Array<InvitroSummary>;
}

export interface InvitroAssayAnalyte {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  analyte?: string;
  analyteSubstanceKey?: string;
  analyteSubstanceKeyType?: string;
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
  assaySet?: string;
  invitroAssayResultInformation?: InvitroAssayResultInformation;
  invitroAssayResult?: InvitroAssayResult;
  invitroControls?: Array<InvitroControl>;
  invitroSummary?: InvitroSummary;
  screeningImportFileName?: string;
  _calculateIC50Value?: string;
  _show?: boolean;
  _assayResults?: Array<any>;
  _selectedAssay?: any;
}

export interface InvitroAssayResultInformation {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  batchNumber?: string;
  invitroReferences?: Array<InvitroReference>;
  invitroLaboratory?: InvitroLaboratory;
  invitroSponsor?: InvitroSponsor;
  invitroSponsorReport?: InvitroSponsorReport;
  invitroTestAgent?: InvitroTestAgent;
}

export interface InvitroReference {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  sourceType?: string;
  sourceId?: string;
  sourceCitation?: string;
  sourceUrl?: string;
  digitalObjectIdentifier?: string;
  tags?: string;
  recordAccess?: string;
  uploadedFile?: string;
  publicDomain?: boolean;
  primaryReference?: boolean;
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
  reportDate?: string;
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

export interface InvitroTestAgent {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  testAgentCompanyCode?: string;
  testAgent?: string;
  testAgentApprovalId?: string;
  testAgentSubstanceUuid?: string;
  testAgentSubstanceKey?: string;
  testAgentSubstanceKeyType?: string;
  testAgentSmileString?: string;
  testAgentMolecularFormulaWeight?: string;
  activeMoiety?: string;
  activeMoietyApprovalId?: string;
  casRegistryNumber?: string;
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
  plasmaProteinAdded?: boolean;
  protein?: string;
  plasmaProteinConcentration?: number;
  plasmaProteinConcentrationUnits?: string;
  batchNumber?: string;
  testDate?: string;
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
  controlResultType?: string;
}

export interface InvitroSummary {
  id?: number;
  createdDate?: number;
  createdBy?: string;
  modifiedDate?: number;
  modifiedBy?: string;
  internalVersion?: number;
  testAgent?: string;
  testAgentSubstanceUuid?: string;
  targetName?: string;
  targetNameSubstanceKey?: string;
  targetNameSubstanceKeyType?: string;
  relationshipType?: string;
  interactionType?: string;
  resultType?: string;
  resultValueAverage?: number;
  resultValueLow?: number;
  resultValueHigh?: number;
  resultValueUnits?: string;
  comments?: string;
  isFromResult?: boolean;
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