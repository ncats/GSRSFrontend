import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';
import { Impurities, ImpuritiesDetails, ImpuritiesResidualSolvents } from '../../model/impurities.model';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';


@Component({
  selector: 'app-impurities-residual-solvents-form',
  templateUrl: './impurities-residual-solvents-form.component.html',
  styleUrls: ['./impurities-residual-solvents-form.component.scss']
})
export class ImpuritiesResidualSolventsFormComponent implements OnInit {

  @Input() impuritiesResidualSolvents: ImpuritiesResidualSolvents;
  @Input() impuritiesResidualIndex: number;
  @Input() impuritiesSubstanceIndex: number;
  @Input() residualSolventsTestIndex: number;

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
    
    // Get 'residualSolvents' json values from config
    const confSettings = configImpuritiesForm.settingsDisplay.residualSolvents;

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

  confirmDeleteImpuritiesResidualSolvents() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Residual Solvents ' + (this.impuritiesResidualIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesResidualSolvents();
      }
    });
  }

  deleteImpuritiesResidualSolvents() {
    this.impuritiesService.deleteImpuritiesResidualSolvents(this.impuritiesSubstanceIndex, this.residualSolventsTestIndex, this.impuritiesResidualIndex);
  }

  relatedSubstanceUpdated(substance: any): void {
    if (substance != null) {
      this.impuritiesResidualSolvents.relatedSubstanceUuid = substance.uuid;
      this.impuritiesResidualSolvents.relatedSubstanceUnii = substance.approvalID;
    }
  }

}