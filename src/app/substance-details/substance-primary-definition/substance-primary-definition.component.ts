import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {SubstanceReference, SubstanceRelated, SubstanceRelationship} from '../../substance/substance.model';
import {UtilsService} from '../../utils/utils.service';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-substance-primary-definition',
  templateUrl: './substance-primary-definition.component.html',
  styleUrls: ['./substance-primary-definition.component.scss']
})
export class SubstancePrimaryDefinitionComponent extends SubstanceCardBase implements OnInit {
  definition: string;
  primary: SubstanceRelated;

  constructor(
    private utilsService: UtilsService
  ) {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.substance.definitionType == 'ALTERNATIVE') {
      console.log(this.substance);
      console.log(this.substance.relationships);
      for (const rel of this.substance.relationships) {
        if (rel.type == 'SUB_ALTERNATE->SUBSTANCE') {
          this.primary = rel.relatedSubstance;
        }
      }

    }
  }

  getSafeStructureImgUrl(structureId: string, size: number = 400): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size);
  }

}
