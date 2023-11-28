export interface AdverseEventPt {
  id?: number;
  substanceId?: string;
  substanceKey?: string;
  name?: string;
  ptTerm?: string;
  primSoc?: string;
  caseCount?: string;
  socCount?: string;
  ptCount?: string;
  socCountPercent?: string;
  ptCountPercent?: string;
  ptCountTotalVsDrug?: string;
  prr?: string;
  _faersDashboardUrl?: string;
}

export interface AdverseEventDme {
  id?: number;
  substanceId?: string;
  substanceKey?: string;
  name?: string;
  dmeReactions?: string;
  ptTermMeddra?: string;
  caseCount?: string;
  dmeCount?: string;
  dmeCountPercent?: string;
}

export interface AdverseEventCvm {
  id?: number;
  substanceId?: string;
  substanceKey?: string;
  name?: string;
  routeOfAdmin?: string;
  species?: string;
  adverseEvent?: string;
  aeCount?: string;
}
