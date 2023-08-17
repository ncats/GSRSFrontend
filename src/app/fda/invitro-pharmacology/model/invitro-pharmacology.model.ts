export interface InvitroPharmacologyOverview {
  id?: number;
  applicationType?: string;
  applicationNumber?: string;
  studyType?: string;
  reference?: string;
  internalVersion?: number;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  invitroApprovers?: Array<InvitroApprover>;
  invitroLaboratories?: Array<InvitroApprover>;
}

export interface InvitroAssayScreening {
  id?: number;
  assayExternalId?: string;
  assayExternalSource?: string;
  assayTitle?: string;
  assayStudyType?: string;
  assayTarget?: string;
  assayTargetUnii?: string;
  testCompound?: string;
  testCompoundUnii?: string;
  ligandSubstrate?: string;
  ligandSubstrateUnii?: string;
  control?: string;
  controlUnii?: string;
  assayType?: string;
  studyType?: string;
  batchId?: string;
  testDate?: number;
  internalVersion?: number;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  _assayTargetSubId?: string;
  _testCompoundSubId?: string;
  _ligandSubstrateSubId?: string;
  _controlSubId?: string;
  invitroApprovers?: InvitroApprover;
  invitroLaboratories?: InvitroApprover;
}

export interface InvitroApprover {
  id?: number;
  approverName?: string;
  approverTitle?: string;
  approverAffiliation?: string;
  approverPhoneNumber?: string;
  approverEmail?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
}

export interface InvitroLaboratory {
  id?: number;
  laboratoryName?: string;
  laboratoryType?: string;
  laboratoryAffiliation?: string;
  laboratoryAddress?: string;
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