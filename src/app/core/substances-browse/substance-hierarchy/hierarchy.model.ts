import {SubstanceRelated} from '@gsrs-core/substance';

export interface HierarchyNode {
  id: number;
  parent: any;
  type: string;
  self?: boolean;
  value: SubstanceRelated;
  expandable: boolean;
  relationship?: string;
  children?: Array<HierarchyNode>;
}
