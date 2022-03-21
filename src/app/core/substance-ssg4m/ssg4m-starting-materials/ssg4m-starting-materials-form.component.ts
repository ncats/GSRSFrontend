import { Component, OnInit, Input } from '@angular/core';
import { SubstanceRelated, SubstanceSummary } from '@gsrs-core/substance';
import { SpecifiedSubstanceG4mStartingMaterial } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-ssg4m-starting-materials-form',
  templateUrl: './ssg4m-starting-materials-form.component.html',
  styleUrls: ['./ssg4m-starting-materials-form.component.scss']
})
export class Ssg4mStartingMaterialsFormComponent implements OnInit {

  privateStartingMaterial: SpecifiedSubstanceG4mStartingMaterial;
  relatedSubstanceUuid: string;

  constructor() { }

  @Input()
  set startingMaterial(startingMaterial: SpecifiedSubstanceG4mStartingMaterial) {
    this.privateStartingMaterial = startingMaterial;
  }

  get startingMaterial(): SpecifiedSubstanceG4mStartingMaterial {
    return this.privateStartingMaterial;
  }

  ngOnInit(): void {
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

  deleteStartingMaterial(): void {

  }
}
