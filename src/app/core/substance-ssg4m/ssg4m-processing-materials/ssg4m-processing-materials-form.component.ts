import { Component, OnInit, Input } from '@angular/core';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { SpecifiedSubstanceG4mProcessingMaterial } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-ssg4m-processing-materials-form',
  templateUrl: './ssg4m-processing-materials-form.component.html',
  styleUrls: ['./ssg4m-processing-materials-form.component.scss']
})
export class Ssg4mProcessingMaterialsFormComponent implements OnInit {

  privateProcessingMaterial: SpecifiedSubstanceG4mProcessingMaterial;
  relatedSubstanceUuid: string;

  constructor() { }

  @Input()
  set processingMaterial(startingMaterial: SpecifiedSubstanceG4mProcessingMaterial) {
    this.privateProcessingMaterial = startingMaterial;
  }

  get processingMaterial(): SpecifiedSubstanceG4mProcessingMaterial {
    return this.privateProcessingMaterial;
  }

  ngOnInit(): void {
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

  }
}
