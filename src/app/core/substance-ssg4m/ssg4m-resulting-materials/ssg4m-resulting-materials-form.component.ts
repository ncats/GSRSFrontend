import { Component, OnInit, Input } from '@angular/core';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { SpecifiedSubstanceG4mResultingMaterial } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-ssg4m-resulting-materials-form',
  templateUrl: './ssg4m-resulting-materials-form.component.html',
  styleUrls: ['./ssg4m-resulting-materials-form.component.scss']
})
export class Ssg4mResultingMaterialsFormComponent implements OnInit {

  privateResultingMaterial: SpecifiedSubstanceG4mResultingMaterial;
  relatedSubstanceUuid: string;

  constructor() { }

  @Input()
  set resultingMaterial(resultingMaterial: SpecifiedSubstanceG4mResultingMaterial) {
    this.privateResultingMaterial = resultingMaterial;
  }

  get resultingMaterial(): SpecifiedSubstanceG4mResultingMaterial {
    return this.privateResultingMaterial;
  }

  ngOnInit(): void {
  }

  updateSubstanceRole(role: string): void {
    this.privateResultingMaterial.substanceRole = role;
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

      this.privateResultingMaterial.substanceName = relatedSubstance;
    }
  }

  deleteResultingMaterial(): void {

  }
}
