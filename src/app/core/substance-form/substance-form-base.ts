import { Output, EventEmitter } from '@angular/core';

export abstract class SubstanceFormBase {
    analyticsEventCategory: string;
    @Output() menuLabelUpdate = new EventEmitter<string>();
    @Output() hiddenStateUpdate = new EventEmitter<boolean>();
    @Output() canAddItemUpdate = new EventEmitter<boolean>();
    @Output() componentDestroyed = new EventEmitter<void>();
}
