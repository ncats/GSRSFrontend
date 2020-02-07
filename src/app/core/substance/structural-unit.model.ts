import {SubstanceAmount, SubstanceStructure} from './substance.model';

export interface StructuralUnit {
    uuid?: string;
    structure: string;
    type: string;
    label: string;
    attachmentMap: any;
    amap: Array<number>;
    attachmentCount: number;
    _structure: SubstanceStructure;
  _displayConnectivity?: string;
    amount?: SubstanceAmount;
  $$deletedCode?: string;
}
