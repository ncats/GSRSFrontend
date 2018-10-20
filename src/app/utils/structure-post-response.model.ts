import { SubstanceStructure, SubstanceMoiety } from '../substance/substance.model';
import { StructuralUnit } from '../substance/structure.model';

export interface StructurePostResponse {
    structure: SubstanceStructure;
    moieties: Array<SubstanceMoiety>;
    structuralUnits: Array<StructuralUnit>;
}
