import { ChangeDetectionStrategy, Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';
import { Impurities, ImpuritiesResidualSolventsTest, ImpuritiesTesting, ImpuritiesDetails, IdentityCriteria } from '../../model/impurities.model';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-impurities-residual-solvents-test',
    templateUrl: './impurities-residual-solvents-test.component.html',
    styleUrls: ['./impurities-residual-solvents-test.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ImpuritiesResidualSolventsTestComponent implements OnInit {

  @Input() impuritiesResidualSolventsTest: ImpuritiesResidualSolventsTest;
  @Input() residualSolventsTestIndex: number;
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
    
    // Get 'residualSolventsTest' json values from config
    const confSettings = configImpuritiesForm.settingsDisplay.residualSolventsTest;

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

  addNewImpuritiesResidualSolvents(event: Event) {
    event.stopPropagation();

    this.impuritiesService.addNewImpuritiesResidualSolvents(this.impuritiesSubstanceIndex, this.residualSolventsTestIndex);
  }

  confirmDeleteImpuritiesResdiualSolventTest() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Residual Solvent Test ' + (this.residualSolventsTestIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesResdiualSolventTest();
      }
    });
  }

  deleteImpuritiesResdiualSolventTest() {
    this.impuritiesService.deleteImpuritiesResdiualSolventTest(this.impuritiesSubstanceIndex, this.residualSolventsTestIndex);
  }

  confirmDeleteImpuritiesTest() {
    /*
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Test ' + (this.impuritiesTestIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesTest();
      }
    }); */
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