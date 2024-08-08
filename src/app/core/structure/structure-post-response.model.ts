import { SubstanceStructure, SubstanceMoiety } from '../substance/substance.model';
import { StructuralUnit } from '../substance/structural-unit.model';

/**
 * API response object for structure post call
 */
export interface InterpretStructureResponse {
    structure: SubstanceStructure;
    moieties: Array<SubstanceMoiety>;
    structuralUnits: Array<StructuralUnit>;
    featureList?: Array<any>;
}

export interface ResolverResponse {
  source: string;
  results: SubstanceStructure;
  name?: string;
  uuid?: string;
}
