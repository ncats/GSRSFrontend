import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceRelationship } from '../../substance/substance.model';
import { StructureService } from '../../structure/structure.service';
import { SafeUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-substance-relationships',
  templateUrl: './substance-relationships.component.html',
  styleUrls: ['./substance-relationships.component.scss']
})
export class SubstanceRelationshipsComponent extends SubstanceCardBase implements OnInit {
  type: string;
  relationships: Array<SubstanceRelationship> = [];
  displayedColumns = ['relatedRecord', 'mediatorRecord', 'type', 'details'];
  private specialRelationships = ['METABOLITE', 'IMPURITY', 'ACTIVE MOIETY'];

  constructor(
    private structureService: StructureService
  ) {
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
        const property = typeParts && typeParts.length && typeParts[0].trim() || '';
        if (property.indexOf(this.type) > -1) {
          this.relationships.push(relationship);
        } else if (this.type === 'RELATIONSHIPS') {
          let isSpecialRelationship = false;

          this.specialRelationships.forEach(specialRelationship => {
            if (property.indexOf(specialRelationship) > -1) {
              isSpecialRelationship = true;
            }
          });

          if (!isSpecialRelationship) {
            this.relationships.push(relationship);
          }
        }
      });
    }
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.structureService.getSafeStructureImgUrl(structureId, size);
  }

}
