import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ConfigService } from '@gsrs-core/config/config.service';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { SpecifiedSubstanceG4mCriticalParameter } from '@gsrs-core/substance/substance.model';
import { ConfirmDialogComponent } from '../../../fda/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ssg4m-critical-parameter-form',
  templateUrl: './ssg4m-critical-parameter-form.component.html',
  styleUrls: ['./ssg4m-critical-parameter-form.component.scss']
})
export class Ssg4mCriticalParameterFormComponent implements OnInit {

  @Input() criticalParameterIndex: number;
  privateProcessIndex: number;
  privateSiteIndex: number;
  privateStageIndex: number;
  privateShowAdvancedSettings: boolean;
  privateCriticalParameter: SpecifiedSubstanceG4mCriticalParameter;
  relatedSubstanceUuid: string;
  substance: SubstanceDetail;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    public configService: ConfigService,
    private dialog: MatDialog
  ) { }

  @Input()
  set criticalParameter(criticalParameter: SpecifiedSubstanceG4mCriticalParameter) {
    this.privateCriticalParameter = criticalParameter;
  }

  get criticalParameter(): SpecifiedSubstanceG4mCriticalParameter {
    return this.privateCriticalParameter;
  }

  @Input()
  set processIndex(processIndex: number) {
    this.privateProcessIndex = processIndex;
  }

  get processIndex(): number {
    return this.privateProcessIndex;
  }

  @Input()
  set siteIndex(siteIndex: number) {
    this.privateSiteIndex = siteIndex;
  }

  get siteIndex(): number {
    return this.privateSiteIndex;
  }

  @Input()
  set stageIndex(stageIndex: number) {
    this.privateStageIndex = stageIndex;
  }

  get stageIndex(): number {
    return this.privateStageIndex;
  }

  @Input()
  set showAdvancedSettings(showAdvancedSettings: boolean) {
    this.privateShowAdvancedSettings = showAdvancedSettings;
  }

  get showAdvancedSettings(): boolean {
    return this.privateShowAdvancedSettings;
  }

  ngOnInit(): void {
  }

  confirmDeleteCriticalParameter() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Critical Parameter ' + (this.criticalParameterIndex + 1) + ' for Stage ' + (this.stageIndex + 1) + ' for Site ' + (this.siteIndex + 1) + ' for Process ' + (this.processIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteCriticalParameter();
      }
    });
  }

  deleteCriticalParameter(): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].criticalParameters.splice(this.criticalParameterIndex, 1);
  }

  relatedSubstanceUpdated(substance: SubstanceSummary): void {
    if (substance != null) {
      const relatedSubstance: SubstanceRelated = {
        refPname: substance._name,
        name: substance._name,
        refuuid: substance.uuid,
        substanceClass: 'reference',
        approvalID: substance.approvalID
      };

   //   this.privateCriticalParameter.substanceName = relatedSubstance;
    }
  }
}
