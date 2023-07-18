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
  applicationIndicationList?: Array<InvitroLaboratory>;
}

export interface InvitroApprover {
  id?: number;
  approverName?: string;
  approverTitle?: string;
  approverAffiliation?: string;
  createdBy?: string;
  creationDate?: number;
  modifiedBy?: string;
  lastModifiedDate?: number;
  internalVersion?: number;
}

export interface InvitroLaboratory {
  id?: number;
  laboratoryName?: string;
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
