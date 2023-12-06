import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OutcomeResultNote } from '../../clinical-trial/clinical-trial.model';
import { ConfigService } from '@gsrs-core/config';
import * as _ from 'lodash';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-clinical-trial-edit-outcome-result-note',
  templateUrl: './clinical-trial-edit-outcome-result-note.component.html',
  styleUrls: ['./clinical-trial-edit-outcome-result-note.component.scss']
})
export class ClinicalTrialEditOutcomeResultNoteComponent implements OnInit {
  @Input() outcomeResultNote: OutcomeResultNote;
  @Input() disabled: boolean = true;
  @Input() index: number;

  constructor(public configService: ConfigService) { 
  }
  ngOnInit() {}

  preventNewLine(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      event.preventDefault();
    }
  }
}
