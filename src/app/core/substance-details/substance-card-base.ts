import { SubstanceDetail } from '../substance/substance.model';
import { Output, EventEmitter, Directive } from '@angular/core';

@Directive()
export abstract class SubstanceCardBase {
    substance: SubstanceDetail;
    title: string;
    analyticsEventCategory: string;
    @Output() countUpdate = new EventEmitter<number>();
}
