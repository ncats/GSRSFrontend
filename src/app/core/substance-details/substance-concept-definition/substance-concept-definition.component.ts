import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {SubstanceDetail, SubstanceRelated, SubstanceRelationship} from '../../substance/substance.model';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {UtilsService} from '../../utils/utils.service';

@Component({
  selector: 'app-substance-concept-definition',
  templateUrl: './substance-concept-definition.component.html',
  styleUrls: ['./substance-concept-definition.component.scss']
})
export class SubstanceConceptDefinitionComponent extends SubstanceCardBase implements OnInit {
  relationships: Array<SubstanceRelationship> = [];
  definitions: Array<SubstanceRelated> = [];



  constructor(
    public utilsService: UtilsService
  ) {
    super();
  }


  ngOnInit() {
    if (this.substance != null) {
      this.getConceptDefinition();
    }
  }

  private getConceptDefinition(): void {
    if (this.substance.relationships && this.substance.relationships.length > 0) {
      this.substance.relationships.forEach(relationship => {
        if (relationship.type === 'SUBSTANCE->SUB_CONCEPT') {
          this.definitions.push(relationship.relatedSubstance);
        }
      });
    }
  }

  getSafeStructureImgUrl(substanceId: string, size: number = 150): SafeUrl {
      return this.utilsService.getSafeStructureImgUrl(substanceId, size);
  }
}
