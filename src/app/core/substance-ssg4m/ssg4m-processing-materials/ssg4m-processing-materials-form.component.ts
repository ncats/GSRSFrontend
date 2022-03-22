import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { SpecifiedSubstanceG4mProcessingMaterial } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-ssg4m-processing-materials-form',
  templateUrl: './ssg4m-processing-materials-form.component.html',
  styleUrls: ['./ssg4m-processing-materials-form.component.scss']
})
export class Ssg4mProcessingMaterialsFormComponent implements OnInit, OnDestroy {

  @Input() processingMaterialIndex: number;
  privateProcessIndex: number;
  privateSiteIndex: number;
  privateStageIndex: number;
  privateProcessingMaterial: SpecifiedSubstanceG4mProcessingMaterial;
  relatedSubstanceUuid: string;
  substance: SubstanceDetail;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormService: SubstanceFormService) { }

  @Input()
  set processingMaterial(startingMaterial: SpecifiedSubstanceG4mProcessingMaterial) {
    this.privateProcessingMaterial = startingMaterial;
  }

  get processingMaterial(): SpecifiedSubstanceG4mProcessingMaterial {
    return this.privateProcessingMaterial;
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

  ngOnInit(): void {
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
    });
    this.subscriptions.push(subscription);

    // Load Substance Name
    if (this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].processingMaterials[this.processingMaterialIndex].substanceName) {
      let substanceRelated = this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].processingMaterials[this.processingMaterialIndex].substanceName;
      this.relatedSubstanceUuid = substanceRelated.refuuid;
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  updateSubstanceRole(role: string): void {
    this.privateProcessingMaterial.substanceRole = role;
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

      this.privateProcessingMaterial.substanceName = relatedSubstance;
    }
  }

  deleteProcessingMaterial(): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites[this.siteIndex].stages[this.stageIndex].processingMaterials.splice(this.processingMaterialIndex, 1);
  }

}
