import { Output, EventEmitter } from '@angular/core';

export abstract class SubstanceFormSectionBase {
    @Output() menuLabelUpdate = new EventEmitter<string>();
}
