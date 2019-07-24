import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {SubstanceDetail, SubstanceRelated} from '../../substance/substance.model';
import {UtilsService} from '../../utils/utils.service';
import {SafeUrl} from '@angular/platform-browser';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-primary-definition',
  templateUrl: './substance-primary-definition.component.html',
  styleUrls: ['./substance-primary-definition.component.scss']
})
export class SubstancePrimaryDefinitionComponent extends SubstanceCardBase implements OnInit {
  definition: string;
  primary: SubstanceRelated;
  substanceUpdated = new Subject<SubstanceDetail>();

  constructor(
    private utilsService: UtilsService
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.definitionType === 'ALTERNATIVE') {
        for (const rel of this.substance.relationships) {
          if (rel.type === 'SUB_ALTERNATE->SUBSTANCE') {
            this.primary = rel.relatedSubstance;
          }
        }

      }
    });
  }

  getSafeStructureImgUrl(structureId: string, size: number = 400): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size);
  }

}
