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

export interface InvitroAssay {
  id?: number;
  assayExternalId?: string;
  assayExternalSource?: string;
  assayTitle?: string;
  assayTarget?: string;
  assayTargetUnii?: string;
  assayType?: string;
  studyType?: string;
  batchId?: string;
  testDate?: number;
  internalVersion?: number;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  modifyDate?: number;
  invitroApprovers?: Array<InvitroApprover>;
  invitroLaboratories?: Array<InvitroApprover>;
  applicationIndicationList?: Array<InvitroLaboratory>;
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
