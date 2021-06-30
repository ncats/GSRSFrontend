import { Component, OnInit } from '@angular/core';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { Subject } from 'rxjs';
import { SubstanceCardBase } from '@gsrs-core/substance-details/substance-card-base';

@Component({
  selector: 'app-substance-mixture-parent',
  templateUrl: './substance-mixture-parent.component.html',
  styleUrls: ['./substance-mixture-parent.component.scss']
})
export class SubstanceMixtureParentComponent extends SubstanceCardBase implements OnInit {
  substanceUpdated = new Subject<SubstanceDetail>();
  mixtures: Array<any>;

  constructor() {
    super();
  }
ngOnInit(){

  this.substanceUpdated.subscribe(substance => {
    this.substance = substance;
    this.mixtures = [];
    if ((this.substance != null) && (this.substance.$$mixtureParents) && (this.substance.$$mixtureParents.length > 0)) {
      this.substance.$$mixtureParents.forEach( parent => {
        parent.mixture.components.forEach(comp => {
          if (comp.substance.refuuid === this.substance.uuid) {
            this.mixtures.push(parent);
          }
          });

      });
      }
  });
  }
}
