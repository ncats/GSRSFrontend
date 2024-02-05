export interface InvitroAssayScreening {
  id?: number;
  assayId?: string;
  assayTitle?: string;
  assayFormat?: string;
  assayType?: string;
  studyType?: string;
  bioassayType?: string;
  bioassay?: string;
  detectionMethod?: string;
  bufferPlasmaProteinConcent?: string;
  purity?: string;
  batchNumber?: string;
  reportDate?: number;
  formReceived?: string;
  formulaMolecularWeight?: string;
  percentInhibition?: number;
  presentationType?: string;
  presentation?: string;
  stockConcentration?: string;
  stockSolvent?: string;
  solutionState?: string;
  vehicleComposition?: string;
  endpointType?: string;
  resultType?: string;
  valueType?: string;
  controlReferenceValue?: string;
  controlReferenceUnit?: string;
  valueFlags?: string;
  comments?: string;
  assayTarget?: string;
  assayTargetUnii?: string;
  testAgent?: string;
  testAgentUnii?: string;
  ligandSubstrate?: string;
  ligandSubstrateUnii?: string;
  control?: string;
  controlUnii?: string;
  controlType?: string;
  ligandSubstrateConcentration?: string;
  ligandSubstrateConcentrationUnit?: string;
  testConcentration?: string;
  testConcentrationUnit?: string;
  screeningConcentration?: string;
  screeningConcentrationUnit?: string;
  solventConcentration?: string;
  solventConcentrationUnit?: string;
  applicationReferenceSourceType?: string;
  applicationReferenceSourceNumber?: string;
  externalAssayId?: string;
  externalAssaySource?: string;
  externalAssayReferenceUrl?: string;
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
  invitroRelationship?: InvitroRelationship;
  invitroSponsor?: InvitroSponsor;
  invitroLaboratory?: InvitroLaboratory;
}

export interface InvitroTestCompound {
  id?: number;
  testCompound?: string;
  testCompoundUnii?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
  _testCompoundSubId: string;
  invitroRelationships?: InvitroRelationship;
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