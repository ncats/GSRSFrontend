import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {SubstanceDetail, SubstanceRelationship} from '../../substance/substance.model';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {SubstanceService} from '../../substance/substance.service';
import {UtilsService} from '../../utils/utils.service';

@Component({
  selector: 'app-substance-concept-definition',
  templateUrl: './substance-concept-definition.component.html',
  styleUrls: ['./substance-concept-definition.component.scss']
})
export class SubstanceConceptDefinitionComponent extends SubstanceCardBase implements OnInit {
  relationships: Array<SubstanceRelationship> = [];
  definitions: Array<SubstanceDetail> = [];
  definition: SubstanceDetail;


  constructor(
    private substanceService: SubstanceService,
    private sanitizer: DomSanitizer,
    public utilsService: UtilsService
  ) {
    super();
  }


  ngOnInit() {
    if (this.substance != null) {
      console.log(this.substance);
      this.getConceptDefinition();
    }
  }

  private getConceptDefinition(): void {
    if (this.substance.relationships && this.substance.relationships.length > 0) {
      this.substance.relationships.forEach(relationship => {
        if (relationship.type === 'SUBSTANCE->SUB_CONCEPT') {
          this.getSubstanceDetails(relationship.relatedSubstance.refuuid);
        }
      });
      console.log(this.definitions);
    }
  }

  getSubstanceDetails(id: string) {
    this.substanceService.getSubstanceDetails(id).subscribe(response => {
      if (response) {
        this.definitions.push(response);
      }
    });
  }

  getSafeStructureImgUrl(substanceId: string, size: number = 150): SafeUrl {
      return this.utilsService.getSafeStructureImgUrl(substanceId, size);
  }
}
