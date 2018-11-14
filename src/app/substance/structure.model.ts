import { SubstanceStructure } from './substance.model';

export interface StructuralUnit {
    structure: string;
    type: string;
    label: string;
    attachmentMap: any;
    amap: Array<number>;
    attachmentCount: number;
    _structure: SubstanceStructure;
}
