export interface ClinicalTrialUSDrug {
  id: number;
  trialNumber: string;
  substanceKey: string;
  substanceKeyType: 'UUID';
  orgSubstanceKey: string;
  orgSubstanceKeyType: 'BDNUM';
  protectedMatch: boolean;
  substanceRoles: Array<SubstanceRole>;
  comment: string;
  substanceDisplayName: string;
}

export interface SubstanceRole {
  id: number;
  substanceRole: string;
}

export interface OutcomeResultNote {
  id: number;
  outcome: string;
  result: string;
  narrative: string;
}

export interface BdnumNameAll {
  name: string;
  bdnum: string;
  substanceId: string;
  unii: string;
  substanceType: string;
  locators: number;
}

export interface ClinicalTrial {
  trialNumber: string;
  title: string;
  recruitment: string;
  phases: string;
  fundedBys: string;
  studyTypes: string;
  studyDesigns: string;
  studyResults: string;
  gender: string;
  enrollment: string;
  otherIds: string;
  startDate: number;
  completionDate: number;
  lastUpdated: number;
  url: string;
  locations: string;
  locationList: Array<string>;
  sponsorList: Array<string>;
  clinicalTrialUSDrug: Array<ClinicalTrialUSDrug>;
  internalVersion: number;
  firstReceived: string;
  lastVerified: string;
  primaryCompletionDate: string;
  outcomeResultNotes: Array<OutcomeResultNote>;
}
