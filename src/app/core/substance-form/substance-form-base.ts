import { Output, EventEmitter } from '@angular/core';

export abstract class SubstanceFormBase {
    analyticsEventCategory: string;
    @Output() menuLabelUpdate = new EventEmitter<string>();
    @Output() hiddenStateUpdate = new EventEmitter<boolean>();
}
