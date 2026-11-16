import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';
import { Impurities, ImpuritiesSubstance, ImpuritiesInorganicTest } from '../../model/impurities.model';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { CvInputComponent } from '@gsrs-core/substance-form/cv-input/cv-input.component';
import { ImpuritiesInorganicFormComponent } from '../impurities-inorganic-form/impurities-inorganic-form.component';

@Component({
    selector: 'app-impurities-inorganic-form-test',
    templateUrl: './impurities-inorganic-form-test.component.html',
    styleUrls: ['./impurities-inorganic-form-test.component.scss'],
    standalone: true,
    imports: [
      FormsModule,
      MatFormFieldModule,
      MatInputModule,
      MatButtonModule,
      MatIconModule,
      MatTooltipModule,
      MatCardModule,
      MatBadgeModule,
      CvInputComponent,
      ImpuritiesInorganicFormComponent
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpuritiesInorganicFormTestComponent implements OnInit {

  @Input() impuritiesInorganicTest: ImpuritiesInorganicTest;
  @Input() inorganicTestIndex: number;
  @Input() impuritiesSubstanceIndex: number;

  private privateShowAdvancedSettings = false;
  configSettingsDisplay = {};

  constructor( 
    private impuritiesService: ImpuritiesService,
    private configService: ConfigService,
    private loadingService: LoadingService,
    private authService: AuthService,
    private dialog: MatDialog) { }

  ngOnInit() {
  }

  @Input()
  set showAdvancedSettings(showAdvancedSettings: boolean) {
    this.privateShowAdvancedSettings = showAdvancedSettings;

    // Get Config Settins from config file
    this.getConfigSettings();
  }

  get showAdvancedSettings(): boolean {
    return this.privateShowAdvancedSettings;
  }

  getConfigSettings(): void {
    // Get Impurities Config Settings from config.json file to show and hide fields in the form
    let configImpuritiesForm: any;
    configImpuritiesForm = this.configService.configData && this.configService.configData.impuritiesForm || null;
    
    // Get 'inorganicImpuritiesTest' json values from config
    const confSettings = configImpuritiesForm.settingsDisplay.inorganicImpuritiesTest;

    Object.keys(confSettings).forEach(key => {
      if (confSettings[key] != null) {
        if (confSettings[key] === 'simple') {
          this.configSettingsDisplay[key] = true;
        } else if (confSettings[key] === 'advanced') {
          if (this.privateShowAdvancedSettings === true) {
            this.configSettingsDisplay[key] = true;
          } else {
            this.configSettingsDisplay[key] = false;
          }
        } else if (confSettings[key] === 'removed') {
          this.configSettingsDisplay[key] = false;
        }
      } else {
        // if either value (simple,advanced,removed) missing in config, show field on the form
        this.configSettingsDisplay[key] = true;
      }
    });
  }

  addNewImpuritiesInorganic(event: Event) {
    event.stopPropagation();

    this.impuritiesService.addNewImpuritiesInorganic(this.impuritiesSubstanceIndex, this.inorganicTestIndex);
  }

  confirmDeleteInorganicTest() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Inorganic Impurities Test ' + (this.inorganicTestIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteInorganicTest();
      }
    });
  }

  deleteInorganicTest() {
    this.impuritiesService.deleteImpuritiesInorganicTest(this.impuritiesSubstanceIndex, this.inorganicTestIndex);
  }

  /*
  addNewImpuritiesDetails() {
    this.createNewImpurities(null);
  }

  createNewImpurities(relationshipUuid: string) {
    const newImpuritiesDetails: ImpuritiesDetails = { identityCriteriaList: [] };
    newImpuritiesDetails.relatedSubstanceUuid = relationshipUuid;
  //  this.impuritiesTest.impuritiesDetailsList.unshift(newImpuritiesDetails);
  }

  addNewImpuritiesUnspecified() {
    this.impuritiesService.addNewImpuritiesUnspecified(this.impuritiesSubstanceIndex, this.impuritiesTestIndex);
  }

  confirmDeleteImpuritiesTest() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Test ' + (this.impuritiesTestIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesTest();
      }
    });
  }

  deleteImpuritiesTest() {
    this.impuritiesService.deleteImpuritiesTest(this.impuritiesSubstanceIndex, this.impuritiesTestIndex);
  }
*/
}