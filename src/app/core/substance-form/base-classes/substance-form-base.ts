import { Output, EventEmitter, Injectable } from '@angular/core';

@Injectable()
export abstract class SubstanceFormBase {
    analyticsEventCategory: string;
    @Output() menuLabelUpdate = new EventEmitter<string>();
    @Output() hiddenStateUpdate = new EventEmitter<boolean>();
    @Output() canAddItemUpdate = new EventEmitter<boolean>();
    @Output() componentDestroyed = new EventEmitter<void>();
}
