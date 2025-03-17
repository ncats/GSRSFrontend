import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { LoadingService } from '@gsrs-core/loading';
import { ImpuritiesService } from '../../service/impurities.service';
import { ImpuritiesInorganic } from '../../model/impurities.model';
import { ConfirmDialogComponent } from '../../../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-impurities-inorganic-form',
  templateUrl: './impurities-inorganic-form.component.html',
  styleUrls: ['./impurities-inorganic-form.component.scss']
})
export class ImpuritiesInorganicFormComponent implements OnInit {

  @Input() impuritiesInorganic: ImpuritiesInorganic;
  @Input() impuritiesInorganicIndex: number;
  @Input() impuritiesSubstanceIndex: number;
  @Input() inorganicTestIndex: number;

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
    
    // Get 'inorganicImpurities' json values from config
    const confSettings = configImpuritiesForm.settingsDisplay.inorganicImpurities;

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

  relatedSubstanceUpdated(substance: any): void {
    if (substance != null) {
      this.impuritiesInorganic.relatedSubstanceUuid = substance.uuid;
      this.impuritiesInorganic.relatedSubstanceUnii = substance.approvalID;
    }
  }

  confirmDeleteImpuritiesInorganic() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delete Inorganic Impurities ' + (this.impuritiesInorganicIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteImpuritiesInorganic();
      }
    });
  }

  deleteImpuritiesInorganic() {
    this.impuritiesService.deleteImpuritiesInorganic(this.impuritiesSubstanceIndex, this.inorganicTestIndex, this.impuritiesInorganicIndex);
  }

}