import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {UtilsService} from '../../utils/utils.service';
import {SubstanceRelated} from '../../substance/substance.model';
import {SafeUrl} from '@angular/platform-browser';

@Component({
  selector: 'app-substance-variant-concepts',
  templateUrl: './substance-variant-concepts.component.html',
  styleUrls: ['./substance-variant-concepts.component.scss']
})
export class SubstanceVariantConceptsComponent extends SubstanceCardBase implements OnInit {
  definition: string;
  variants: Array<SubstanceRelated>;

  constructor(
    private utilsService: UtilsService
  ) {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.substance.relationships.length > 0) {
      this.variants = [];
      for (const rel of this.substance.relationships) {
        if (rel.type === 'SUB_CONCEPT->SUBSTANCE') {
          console.log(rel);
          console.log(this.variants);
          this.variants.push(rel.relatedSubstance);
        }
      }

    }
  }

  getSafeStructureImgUrl(structureId: string, size: number = 400): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size);
  }

}
