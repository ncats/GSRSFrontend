import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule } from '@angular/forms';

/* GSRS Imports */
import { InvitroAssayInformation, ValidationMessage } from './model/invitro-pharmacology.model';


@Component({
    selector: 'app-invitro-pharmacology',
    templateUrl: './invitro-pharmacology.component.html',
    styleUrls: ['./invitro-pharmacology.component.scss'],
    standalone: true,
    imports: [MatButtonModule, MatIconModule, MatCardModule, MatFormFieldModule, MatInputModule, MatTooltipModule, FormsModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class InvitroPharmacologyComponent implements OnInit {

  assayInfo: InvitroAssayInformation;
  id?: number;

  isLoading = true;

  showSubmissionMessages = false;
  validationResult = false;
  submissionMessage: string;
  validationMessages: Array<ValidationMessage> = [];

  private subscriptions: Array<Subscription> = [];
  copy: string;
  private overlayContainer: HTMLElement;
  serverError: boolean;
  isDisableData = false;
  username = null;
  title = null;
  submitDateMessage = '';
  statusDateMessage = '';
  // appForm: FormGroup;
  
  constructor() { }

  ngOnInit(): void {
  }


  showJSON(): void {
  }

}