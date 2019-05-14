import { SubstanceDetail } from '../substance/substance.model';
import { Output, EventEmitter } from '@angular/core';

export abstract class SubstanceFormSectionBase {
    substance: SubstanceDetail;
}
