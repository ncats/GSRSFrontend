import { ChangeDetectionStrategy, Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { OutcomeResultNote } from '../../clinical-trial/clinical-trial.model';
import { ConfigService } from '@gsrs-core/config';
import { FormControl, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
    selector: 'app-clinical-trial-edit-outcome-result-note',
    templateUrl: './clinical-trial-edit-outcome-result-note.component.html',
    styleUrls: ['./clinical-trial-edit-outcome-result-note.component.scss'],
    standalone: true,
    imports: [
      FormsModule,
      MatFormFieldModule,
      MatInputModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
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
