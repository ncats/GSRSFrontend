import { SubstanceDetail } from '../substance/substance.model';
import { Output, EventEmitter } from '@angular/core';
import { Observable } from 'rxjs';

export abstract class SubstanceFormSectionBase {
    substance: SubstanceDetail;
    substanceUpdated: Observable<SubstanceDetail>;
    @Output() menuLabelUpdate = new EventEmitter<string>();
}
