export interface ClinicalTrialDrug {
  id: number;
  nctNumber: string;
  substanceUuid: string;
  protectedMatch: boolean;
  substanceDisplayName: string;
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
  nctNumber: string;
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
  clinicalTrialDrug: Array<ClinicalTrialDrug>;
  internalVersion: number;

  firstReceived: string;
  lastVerified: string;
  primaryCompletionDate: string;
}
