import { Component, OnInit } from '@angular/core';
import {SubstanceDetail, SubstanceRelated} from '../../substance/substance.model';
import {SubstanceCardBase} from '../substance-card-base';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-mixture-source',
  templateUrl: './substance-mixture-source.component.html',
  styleUrls: ['./substance-mixture-source.component.scss']
})
export class SubstanceMixtureSourceComponent extends SubstanceCardBase implements OnInit {
 parent: SubstanceRelated;
  substanceUpdated = new Subject<SubstanceDetail>();
  constructor(
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null && this.substance.mixture.parentSubstance != null) {
        this.parent = this.substance.mixture.parentSubstance;
      }
    });
  }

}

