import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {MixtureComponents, SubstanceDetail} from '../../substance/substance.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-mixture-components',
  templateUrl: './substance-mixture-components.component.html',
  styleUrls: ['./substance-mixture-components.component.scss']
})
export class SubstanceMixtureComponentsComponent extends SubstanceCardBase implements OnInit {
  components: Array<MixtureComponents>;
  required: Array<MixtureComponents>;
  presentInAny: Array<MixtureComponents>;
  presentInOne: Array<MixtureComponents>;
  substanceUpdated = new Subject<SubstanceDetail>();

  constructor() {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if ((this.substance != null) && (this.substance.mixture.components.length > 0)) {
        this.components = this.substance.mixture.components;
        this.required = this.components.filter(
          component => component.type === 'MUST_BE_PRESENT');
        this.presentInAny = this.components.filter(
          component => component.type === 'MAY_BE_PRESENT_ANY_OF');
        this.presentInOne = this.components.filter(
          component => component.type === 'MAY_BE_PRESENT_ONE_OF');
      }
    });
  }

}
