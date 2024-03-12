export const invitroPharmacologySearchSortValues = [
  {
    'value': 'default',
    'display': 'Relevance'
  },
  {
    'value': '^root_targetName',
    'display': 'Target Name, A-Z',
    'displayedColumns': 'assayTarget',
    'direction': 'asc'
  },
  {
    'value': '$root_targetName',
    'display': 'Target Name, Z-A',
    'displayedColumns': 'assayTarget',
    'direction': 'desc'
  },
  {
    'value': '^root_invitroAssayScreenings_invitroTestAgent_testAgent',
    'display': 'Test Agent, A-Z',
    'displayedColumns': 'testCompound',
    'direction': 'asc'
  },
  {
    'value': '$root_invitroAssayScreenings_invitroTestAgent_testAgent',
    'display': 'Test Agent, Z-A',
    'displayedColumns': 'testAgent',
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
