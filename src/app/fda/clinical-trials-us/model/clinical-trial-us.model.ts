export interface ClinicalTrialUS {
  trialNumber?: string;
  title?: string;
  recruitment?: string;
  phases?: string;
  fundedBys?: string;
  studyTypes?: string;
  studyDesigns?: string;
  studyResults?: string;
  gender?: string;
  enrollment?: string;
  otherIds?: string;
  startDate?: number;
  completionDate?: number;
  lastUpdated?: number;
  url?: string;
  locations?: string;
  locationList?: Array<string>;
  sponsorList?: Array<string>;
  clinicalTrialUSDrug?: Array<ClinicalTrialUSDrug>;
  internalVersion?: number;
  firstReceived?: string;
  lastVerified?: string;
  primaryCompletionDate?: string;
  creationDate?: number;
  lastModifiedDate?: number;
}

export interface ClinicalTrialUSDrug {
  id?: number;
  trialNumber?: string;
  substanceKey?: string;
  substanceKeyType?: string;
  orgSubstanceKey?: string;
  orgSubstanceKeyType?: string;
  protectedMatch?: boolean;
  substanceDisplayName?: string;
}

export interface ClinicalTrialAll {
  trialNumber?: number;
  title?: string;
  kind?: string;
  creationDate?: number;
  lastModifiedDate?: number;
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
