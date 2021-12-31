import { Component, OnInit, Input, AfterViewInit, OnDestroy } from '@angular/core';
import { ViewEncapsulation, Output, EventEmitter, ViewChildren, QueryList } from '@angular/core';
import { ClinicalTrialUSService } from '../../service/clinical-trial-us.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '@gsrs-core/controlled-vocabulary/vocabulary.model';
import { ClinicalTrialUSDrug, ValidationMessage } from '../../model/clinical-trial-us.model';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { JsonDialogFdaComponent } from '../../../json-dialog-fda/json-dialog-fda.component';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { SubstanceSearchSelectorComponent } from '../../../substance-search-select/substance-search-selector.component';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { GeneralService } from '../../../service/general.service';
import { ConfigService } from '@gsrs-core/config/config.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-clinical-trial-us-substance-form',
  templateUrl: './clinical-trial-us-substance-form.component.html',
  styleUrls: ['./clinical-trial-us-substance-form.component.scss']
})
@NgModule({
  imports: [
    FormsModule,
    ReactiveFormsModule
  ]
})

export class ClinicalTrialUSSubstanceFormComponent implements OnInit {

  @ViewChildren('checkBox') checkBox: QueryList<any>;
  @Input() substance: ClinicalTrialUSDrug;
  @Input() substanceIndex: number;
  @Input() totalSubstance: number;

  username = null;

  substanceKey: string;
  substanceName: string;
  clinicalTrialUSSubstanceOrgDisplayKey?: string;
  clinicalTrialUSSubstanceOrgDisplayKeyType?: string;

  substanceKeyOld: string;
  substanceNameMessage = '';
  substanceKeyTypeConfig = '';
  private subscriptions: Array<Subscription> = [];

  constructor(
    public generalService: GeneralService,
    private clinicalTrialUSService: ClinicalTrialUSService,
    public cvService: ControlledVocabularyService,
    private authService: AuthService,
    private configService: ConfigService,
    private dialog: MatDialog) { }

  ngOnInit() {

    setTimeout(() => {
      this.username = this.authService.getUser();
      this.substanceKeyOld = this.substance.substanceKey;
      // Get Substance Linking Key Type from Config
      this.substanceKeyTypeConfig = this.generalService.getClinicalTrialUSSubstanceKeyType();
      if (!this.substanceKeyTypeConfig) {
        alert('There is no Substance configuration found in config file: substance.linking.keyType.default. Unable to add Substance Name');
      }
      this.getSubstanceBySubstanceKey();
    }, 600);

  }

  confirmDeleteSubstance(substanceIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Substance Details ' + (substanceIndex + 1) + ' data?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteSubstance(substanceIndex);
      }
    });
  }

  deleteSubstance(index: number) {
    this.clinicalTrialUSService.deleteClinicalTrialUSDrug(index);
  }

  // copySubstance() {
  //  this.clinicalTrialUSService.copySubstance(this.substance);
  // }

  confirmDeleteSubstanceName() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Substance Name ' + (this.substanceIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteSubstanceName();
      }
    });
  }

  deleteSubstanceName() {
    this.substanceNameMessage = '';
    if (this.substance.id != null) {
      // Display this message if deleting existing Substance Name which is in database.
      if (this.substanceKeyOld != null) {
        this.substanceNameMessage = 'Click Validate and Submit button to delete ' + this.substanceName;
      }
    }
    this.substanceKey = null;
    this.substanceKeyOld = null;
    this.substanceName = null;
    this.substance.substanceKey = null;
    this.substance.substanceKeyType = null;
  }
/*
  getSubstanceCode(substanceUuid: string) {
    const subCodeSubscription = this.generalService.getSubstanceCodesBySubstanceUuid(substanceUuid).subscribe(response => {
      if (response) {
        const substanceCodes = response;
        for (let index = 0; index < substanceCodes.length; index++) {
          if (substanceCodes[index].codeSystem) {
            if ((substanceCodes[index].codeSystem === this.substanceKeyTypeConfig) &&
              (substanceCodes[index].type === 'PRIMARY')) {
                this.substance.substanceKey = substanceCodes[index].code;
                this.substance.substanceKeyType = this.substanceKeyTypeConfig;
            }
          }
        }
      }
    });
    this.subscriptions.push(subCodeSubscription);
  }
*/
  getSubstanceBySubstanceKey() {
    if (this.substance != null) {
      // Get Substance Details, uuid, approval_id, substance name
      if (this.substance.substanceKey) {
        const subSubscription = this.generalService.getFullSubstanceByAnyId(this.substance.substanceKey).subscribe(response => {
          if (response) {
            if (response.uuid) {
              this.substanceKey = response.uuid;
              this.substanceName = response._name;
            }
          }
        });
        this.subscriptions.push(subSubscription);
      }
    }
  }

substanceNameUpdated(substance: SubstanceSummary): void {
  this.substanceNameMessage = '';
  if (substance != null) {
      if (substance.uuid != null) {
        this.substanceNameMessage = '';
        if (!this.substanceKeyTypeConfig) {
          alert('There is no Substance configuration found in config file: '
          + 'substance.linking.keyType.clinicalTrialUSKeyType. Unable to add Ingredient Name');
          this.substanceNameMessage = 'Add Substance Key Type in Config';
        } else {
          this.substanceKey = substance.uuid;
          this.substanceName = substance._name;
          this.substance.substanceKey = substance.uuid;
          this.substance.substanceKeyType = this.substanceKeyTypeConfig;
        }
      }
  } else {
    this.substanceKey = null;
  }
}

  showMessageSubstanceName(message: string): void {
    this.substanceNameMessage = message;
  }



}


