import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {SubstanceDetail, SubstanceRelated, SubstanceRelationship} from '../../substance/substance.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-concept-definition',
  templateUrl: './substance-concept-definition.component.html',
  styleUrls: ['./substance-concept-definition.component.scss']
})
export class SubstanceConceptDefinitionComponent extends SubstanceCardBase implements OnInit {
  relationships: Array<SubstanceRelationship> = [];
  definitions: Array<SubstanceRelated> = [];
  substanceUpdated = new Subject<SubstanceDetail>();


  constructor() {
    super();
  }


  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null) {
        this.getConceptDefinition();
      }
    });
  }

  private getConceptDefinition(): void {
    this.definitions = [];
    if (this.substance.relationships && this.substance.relationships.length > 0) {
      this.substance.relationships.forEach(relationship => {
        if (relationship.type === 'SUBSTANCE->SUB_CONCEPT') {
          this.definitions.push(relationship.relatedSubstance);
        }
      });
      this.countUpdate.emit(this.definitions.length);
    }
  }
}
