import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {SubstanceDetail, SubstanceRelated} from '../../substance/substance.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-variant-concepts',
  templateUrl: './substance-variant-concepts.component.html',
  styleUrls: ['./substance-variant-concepts.component.scss']
})
export class SubstanceVariantConceptsComponent extends SubstanceCardBase implements OnInit {
  definition: string;
  variants: Array<SubstanceRelated>;
  substanceUpdated = new Subject<SubstanceDetail>();

  constructor(
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.relationships.length > 0) {
        this.variants = [];
        for (const rel of this.substance.relationships) {
          if (rel.type === 'SUB_CONCEPT->SUBSTANCE') {
            this.variants.push(rel.relatedSubstance);
          }
        }

      }
    });
  }

}
