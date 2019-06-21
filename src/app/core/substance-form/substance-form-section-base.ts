import { SubstanceDetail } from '../substance/substance.model';
import { Output, EventEmitter } from '@angular/core';
import { Subject } from 'rxjs';

export abstract class SubstanceFormSectionBase {
    @Output() menuLabelUpdate = new EventEmitter<string>();
}
