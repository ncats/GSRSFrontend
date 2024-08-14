import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

/* GSRS Imports */
import { InvitroAssayInformation, ValidationMessage } from './model/invitro-pharmacology.model';


@Component({
  selector: 'app-invitro-pharmacology',
  templateUrl: './invitro-pharmacology.component.html',
  styleUrls: ['./invitro-pharmacology.component.scss']
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
  isAdmin = false;

  constructor() { }

  ngOnInit(): void {
  }


  showJSON(): void {
  }

}