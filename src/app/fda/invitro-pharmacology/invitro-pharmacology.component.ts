import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

/* GSRS Imports */
import { InvitroAssayScreening, ValidationMessage } from './model/invitro-pharmacology.model';


@Component({
  selector: 'app-invitro-pharmacology',
  templateUrl: './invitro-pharmacology.component.html',
  styleUrls: ['./invitro-pharmacology.component.scss']
})
export class InvitroPharmacologyComponent implements OnInit {

  invitropharm: InvitroAssayScreening;
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
    /*
    let cleanApplication = this.cleanApplication();
    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: cleanApplication
    });

    //   this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
    */
  }

}