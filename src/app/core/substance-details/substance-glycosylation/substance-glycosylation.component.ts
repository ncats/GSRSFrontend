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
  sites: any = [];
  displayedColumns = ['glycosylationLinkType', 'site'];

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null
      && this.substance.protein != null
      && this.substance.protein.glycosylation.glycosylationType != null) {
        this.glycosylation = this.substance.protein.glycosylation;
        for (const link of this.glycosylation.CGlycosylationSites) {
          this.sites.push({type: 'C', site: link.subunitIndex + '_' + link.residueIndex});
        }
        for (const link of this.glycosylation.NGlycosylationSites) {
          this.sites.push({type: 'N', site: link.subunitIndex + '_' + link.residueIndex});
        }
        for (const link of this.glycosylation.OGlycosylationSites) {
          this.sites.push({type: 'O', site: link.subunitIndex + '_' + link.residueIndex});
        }
        this.countUpdate.emit(this.sites.length);
      }
    }

  getFullSite(site: Site ): string {
    return site.subunitIndex + '_' + site.residueIndex;
  }

}
