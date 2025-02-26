import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';
import { ImpuritiesUnspecified, SubRelationship, ValidationMessage } from '../../model/impurities.model';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-unspecified-form',
  templateUrl: './impurities-unspecified-form.component.html',
  styleUrls: ['./impurities-unspecified-form.component.scss']
})
export class ImpuritiesUnspecifiedFormComponent implements OnInit {

  @Input() impuritiesUnspecified: ImpuritiesUnspecified;
  @Input() impuritiesUnspecifiedIndex: number;
  @Input() impuritiesTestIndex: number;
  @Input() impuritiesSubstanceIndex: number;

  impurity: any;
  public subRelationship: Array<SubRelationship> = [];
  substanceName: string;
  isDisableData: false;
  isLoading = false;

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
    
    // Get 'unspecifiedImpurities' json values from config
    const confSettings = configImpuritiesForm.settingsDisplay.unspecifiedImpurities

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

  confirmDeleteImpuritiesUnspecified() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Unspecified Impurities ' + (this.impuritiesUnspecifiedIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesUnspecified();
      }
    });
  }

  deleteImpuritiesUnspecified() {
    this.impuritiesService.deleteImpuritiesUnspecified(this.impuritiesSubstanceIndex,
      this.impuritiesTestIndex, this.impuritiesUnspecifiedIndex);
  }

  addNewIdentityCriteria() {
    this.impuritiesService.addNewIdentityCriteriaUnspecified(this.impuritiesSubstanceIndex,
       this.impuritiesTestIndex, this.impuritiesUnspecifiedIndex);
  }

  confirmDeleteIdentityCriteria(impuritiesUnspecifiedIndex: number) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Identity Critieria ' + (impuritiesUnspecifiedIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteIdentityCriteria(impuritiesUnspecifiedIndex);
      }
    });
  }

  deleteIdentityCriteria(identityCriteriaUnspecIndex: number) {
    this.impuritiesService.deleteIdentityCriteriaUnspecified(this.impuritiesSubstanceIndex,
      this.impuritiesTestIndex, this.impuritiesUnspecifiedIndex, identityCriteriaUnspecIndex);
  }


}