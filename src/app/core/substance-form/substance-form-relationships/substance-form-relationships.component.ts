import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceRelationship } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-substance-form-relationships',
  templateUrl: './substance-form-relationships.component.html',
  styleUrls: ['./substance-form-relationships.component.scss']
})
export class SubstanceFormRelationshipsComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  relationships: Array<SubstanceRelationship>;

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Relationships');
  }

  ngAfterViewInit() {
    this.substanceFormService.substanceRelationships.subscribe(relationships => {
      this.relationships = relationships;
    });
  }

  addRelationship(): void {
    this.substanceFormService.addSubstanceRelationship();
  }

  deleteRelationship(relationship: SubstanceRelationship): void {
    this.substanceFormService.deleteSubstanceRelationship(relationship);
  }

}
