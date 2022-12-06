import { SubstanceDetail } from '../substance/substance.model';
import { Output, EventEmitter, Injectable } from '@angular/core';

@Injectable()
export abstract class SubstanceCardBase {
    substance: SubstanceDetail;
    title: string;
    analyticsEventCategory: string;
    @Output() countUpdate = new EventEmitter<number>();
}
