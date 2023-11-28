import {SubstanceRelated} from '@gsrs-core/substance';

export interface SubstanceDependenciesImageNode {
  relatedSubstance?: SubstanceRelated;
  structure?: string;
  relationshipType?: string;
  interactionType?: string;
  mediatorSubstance?: SubstanceRelated;
  comments?: string;
}
