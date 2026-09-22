/**
 * Shared constants for the SD File Tools hub.
 *
 * The SD File Validator is an FDA-authored, fully self-contained HTML tool that GSRS
 * embeds verbatim. Bumping to a new version should be a two-step change: drop the new
 * file into src/app/core/assets/sdf-tools/ and update SDF_VALIDATOR_FILENAME here.
 */

export const SDF_TOOLS_ASSET_DIR = 'assets/sdf-tools/';

export const SDF_VALIDATOR_FILENAME = 'SD_File_Validator_2_1.html';

export const SDF_QUICK_GUIDE_FILENAME = 'Quick_Guide_SDF_eCTD_508.pdf';

export const SDF_SAMPLE_FILENAME = '00_SampleSDF_MF012345_API_Name.sdf';

export type SdfToolsTab = 'validate' | 'import' | 'guide';

export const SDF_TOOLS_TABS: Array<SdfToolsTab> = ['validate', 'import', 'guide'];

/** File extensions the SD File Quick Guide permits for an SD File. */
export const SDF_ACCEPTED_EXTENSIONS = '.sdf,.txt';

/**
 * Data headers the GSRS Quick Guide asks Sponsors to supply.
 */
export const SDF_RECOMMENDED_HEADERS: Array<{ header: string; description: string }> = [
  { header: 'NAME', description: 'The chemical name (common or IUPAC).' },
  { header: 'CAS', description: 'The CAS Registry Number.' },
  {
    header: 'ROLE',
    description: 'The function of the substance (e.g. "drug substance", "process impurity").'
  },
  { header: 'ID', description: 'Any unique company code or identifier used in the submission.' },
  { header: 'UNII', description: 'The FDA Unique Ingredient Identifier.' },
  {
    header: 'APPLICATION NUMBER',
    description: 'The submission application number with the correct prefix (e.g. "ANDA012345", "MF012345").'
  },
  { header: 'NOTES', description: 'Any additional qualifying information.' }
];

export const SDF_SUPPORT_CONTACTS: Array<{ label: string; email: string }> = [
  { label: 'SD File formatting questions', email: 'FDA-SRS@fda.hhs.gov' },
  { label: 'DMF submission issues', email: 'DMFOGD@fda.hhs.gov' },
  { label: 'CDER eCTD technical support', email: 'esub@fda.hhs.gov' }
];

/** "Online Resources" from section 9 of the FDA SD File Validator user guide. */
export const SDF_ONLINE_RESOURCES: Array<{ label: string; url: string }> = [
  { label: 'FDA UNII Search', url: 'https://precision.fda.gov/uniisearch' },
  { label: 'NCATS GSRS database', url: 'https://gsrs.ncats.nih.gov/ginas/app/ui/home' },
  {
    label: 'Quick Guide for DMF submissions',
    url: 'https://www.fda.gov/drugs/drug-master-files-dmfs/drug-master-file-dmf-submission-resources'
  },
  {
    label: 'Quick Guide for other submission types (NDA, ANDA, BLA, IND)',
    url: 'https://www.fda.gov/media/161877/download?attachment'
  }
];
