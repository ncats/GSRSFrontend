import { SubstanceStructure, SubstanceMoiety } from '../substance/substance.model';
import { StructuralUnit } from '../substance/structure.model';

/**
 * API response object for structure post call
 */
export interface StructurePostResponse {
    structure: SubstanceStructure;
    moieties: Array<SubstanceMoiety>;
    structuralUnits: Array<StructuralUnit>;
}
