import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { SpecifiedSubstanceG4mStartingMaterial } from '@gsrs-core/substance/substance.model';
import { ConfirmDialogComponent } from '../../../fda/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ssg4m-starting-materials-form',
  templateUrl: './ssg4m-starting-materials-form.component.html',
  styleUrls: ['./ssg4m-starting-materials-form.component.scss']
})
export class Ssg4mStartingMaterialsFormComponent implements OnInit, OnDestroy {

  @Input() startingMaterialIndex: number;
  privateProcessIndex: number;
  privateSiteIndex: number;
  privateStageIndex: number;
  privateShowAdvancedSettings: boolean;
  privateStartingMaterial: SpecifiedSubstanceG4mStartingMaterial;
  relatedSubstanceUuid: string;
  substance: SubstanceDetail;
  subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService,
    private dialog: MatDialog
    ) { }

  @Input()
  set startingMaterial(startingMaterial: SpecifiedSubstanceG4mStartingMaterial) {
    this.privateStartingMaterial = startingMaterial;
  }

  get startingMaterial(): SpecifiedSubstanceG4mStartingMaterial {
    return this.privateStartingMaterial;
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
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
    });
    this.subscriptions.push(subscription);

    // Load Substance Name
    if (this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].startingMaterials[this.startingMaterialIndex].substanceName) {
      let substanceRelated = this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].startingMaterials[this.startingMaterialIndex].substanceName;
      this.relatedSubstanceUuid = substanceRelated.refuuid;
    }
  }

  ngOnDestroy(): void {
    // this.substanceFormService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  updateSubstanceRole(role: string): void {
    this.privateStartingMaterial.substanceRole = role;
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

      this.privateStartingMaterial.substanceName = relatedSubstance;
    }
  }

  confirmDeleteStartingMaterial() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Starting Material ' + (this.startingMaterialIndex + 1) + ' for Stage ' + (this.stageIndex + 1) + ' for Site ' + (this.siteIndex + 1) + ' for Process ' + (this.processIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteStartingMaterial();
      }
    });
  }

  deleteStartingMaterial(): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].startingMaterials.splice(this.startingMaterialIndex, 1);
  }

  /*
  deleteProductLot(prodComponentIndex: number, prodLotIndex: number) {
    this.productService.deleteProductLot(prodComponentIndex, prodLotIndex);
  }

  deleteProductLot(prodComponentIndex: number, prodLotIndex: number): void {
    this.product.productComponentList[prodComponentIndex].productLotList.splice(prodLotIndex, 1);
  }
  */
}
