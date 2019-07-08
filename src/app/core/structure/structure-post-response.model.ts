import { SubstanceStructure, SubstanceMoiety } from '../substance/substance.model';
import { StructuralUnit } from '../substance/structural-unit.model';

/**
 * API response object for structure post call
 */
export interface StructurePostResponse {
    structure: SubstanceStructure;
    moieties: Array<SubstanceMoiety>;
    structuralUnits: Array<StructuralUnit>;
}

export interface ResolverResponse {
  source: string;
  results: SubstanceStructure;
  name?: string;
  uuid?: string;
}
