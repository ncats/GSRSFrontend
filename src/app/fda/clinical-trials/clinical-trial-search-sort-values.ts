export const clinicalTrialSearchSortValues = [
  {
    'value': 'default',
    'display': 'Relevance'
  },
  {
    'value': '^root_trialNumber',
    'display': 'NCT Number, Ascending',
    'displayedColumns': 'trialNumber',
    'direction': 'asc'
  },
  {
    'value': '$root_trialNumber',
    'display': 'NCT Number, Descending',
    'displayedColumns': 'trialNumber',
    'direction': 'desc'
  },
  {
    'value': '^root_title',
    'display': 'Title, Ascending',
    'displayedColumns': 'title',
    'direction': 'asc'
  },
  {
    'value': '$root_title',
    'display': 'Title, Descending',
    'displayedColumns': 'title',
    'direction': 'desc'
  },
  {
    'value': '^root_sponsor',
    'display': 'Sponsor Name, Ascending',
    'displayedColumns': 'sponsor',
    'direction': 'asc'
  },
  {
    'value': '$root_sponsor',
    'display': 'Sponsor Name, Descending',
    'displayedColumns': 'sponsor',
    'direction': 'desc'
  },
  {
    'value': '^root_sponsorName',
    'display': 'Sponsor Name, Ascending',
    'displayedColumns': 'sponsorName',
    'direction': 'asc'
  },
  {
    'value': '$root_sponsorName',
    'display': 'Sponsor Name, Descending',
    'displayedColumns': 'sponsorName',
    'direction': 'desc'
  },
  {
    'value': '^root_conditions',
    'display': 'Conditions, Ascending',
    'displayedColumns': 'conditions',
    'direction': 'asc'
  },
  {
    'value': '$root_conditions',
    'display': 'Conditions, Descending',
    'displayedColumns': 'conditions',
    'direction': 'desc'
  },
  {
    'value': '^root_clinicalTrialEuropeMeddraList_meddraTerm',
    'display': 'Conditions, Ascending',
    'displayedColumns': 'conditionsEU',
    'direction': 'asc'
  },
  {
    'value': '$root_clinicalTrialEuropeMeddraList_meddraTerm',
    'display': 'Conditions, Descending',
    'displayedColumns': 'conditionsEU',
    'direction': 'desc'
  }
];
