import { SubstanceDetail } from '../substance/substance.model';
import { Output, EventEmitter } from '@angular/core';

export abstract class SubstanceCardBase {
    substance: SubstanceDetail;
    title: string;
    analyticsEventCategory: string;
    @Output() countUpdate = new EventEmitter<number>();
}
