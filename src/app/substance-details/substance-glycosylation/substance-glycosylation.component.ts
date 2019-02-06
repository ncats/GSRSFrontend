import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {Glycosylation, Site} from '../../substance/substance.model';

@Component({
  selector: 'app-substance-glycosylation',
  templateUrl: './substance-glycosylation.component.html',
  styleUrls: ['./substance-glycosylation.component.scss']
})
export class SubstanceGlycosylationComponent extends SubstanceCardBase implements OnInit {
  glycosylation: Glycosylation;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null
      && this.substance.protein != null
      && this.substance.protein.glycosylation != null) {
        this.glycosylation = this.substance.protein.glycosylation;
      }
    }

  getFullSite(site: Site ): string {
    return site.subunitIndex + '_' + site.residueIndex;
  }

}
