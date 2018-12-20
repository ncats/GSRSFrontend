import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceRelationship } from '../../substance/substance.model';

@Component({
  selector: 'app-substance-relationships',
  templateUrl: './substance-relationships.component.html',
  styleUrls: ['./substance-relationships.component.scss']
})
export class SubstanceRelationshipsComponent extends SubstanceCardBase implements OnInit {
  type: string;
  relationships: Array<SubstanceRelationship> = [];

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.type != null) {
      this.filterRelationhships();
    }
  }

  private filterRelationhships(): void {
    if (this.substance.relationships && this.substance.relationships.length > 1) {
      this.substance.relationships.forEach(relationship => {
        const typeParts = relationship.type.split('->');
        const property = typeParts[0].trim();
        if (property) {
          if (property.indexOf(this.type) > -1) {
            this.relationships.push(relationship);
          }
        }
      });
    }
    console.log(this.relationships);
  }

}
