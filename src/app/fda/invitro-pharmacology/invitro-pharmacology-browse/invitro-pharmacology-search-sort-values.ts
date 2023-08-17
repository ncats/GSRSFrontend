export const invitroPharmacologySearchSortValues = [
  {
    'value': 'default',
    'display': 'Relevance'
  },
  {
    'value': '^root_assayTarget',
    'display': 'Assay Target, A-Z',
    'displayedColumns': 'assayTarget',
    'direction': 'asc'
  },
  {
    'value': '$root_assayTarget',
    'display': 'Assay Target, Z-A',
    'displayedColumns': 'assayTarget',
    'direction': 'desc'
  },
  {
    'value': '^root_testCompound',
    'display': 'Test Compound, A-Z',
    'displayedColumns': 'testCompound',
    'direction': 'asc'
  },
  {
    'value': '$root_testCompound',
    'display': 'Test Compound, Z-A',
    'displayedColumns': 'testCompound',
    'direction': 'desc'
  },
  {
    'value': '^root_creationDate',
    'display': 'Oldest Creation'
  },
  {
    'value': '$root_creationDate',
    'display': 'Newest Creation'
  },
  {
    'value': '^root_lastModifiedDate',
    'display': 'Oldest Change'
  },
  {
    'value': '$root_lastModifiedDate',
    'display': 'Newest Change'
  }

];
