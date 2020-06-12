import { Component, OnInit } from '@angular/core';
import { SubstanceDetail, SubstanceRelated } from '@gsrs-core/substance/substance.model';
import { Subject } from 'rxjs';
import { SubstanceCardBase } from '@gsrs-core/substance-details/substance-card-base';

@Component({
  selector: 'app-substance-alternative-definition',
  templateUrl: './substance-alternative-definition.component.html',
  styleUrls: ['./substance-alternative-definition.component.scss']
})
export class SubstanceAlternativeDefinitionComponent extends SubstanceCardBase implements OnInit {
  definition: string;
  alternatives: Array<SubstanceRelated>;
  substanceUpdated = new Subject<SubstanceDetail>();

  constructor(
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.alternatives = [];
      this.substance = substance;
      if (this.substance != null && this.substance.relationships) {
        for (const rel of this.substance.relationships) {
          if (rel.type === 'SUBSTANCE->SUB_ALTERNATE') {
            this.alternatives.push(rel.relatedSubstance );
          }
        }
        this.countUpdate.emit(this.alternatives.length);

      }
    });
  }

}
