import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {DisulfideLink, Site} from '../../substance/substance.model';

@Component({
  selector: 'app-substance-disulfide-links',
  templateUrl: './substance-disulfide-links.component.html',
  styleUrls: ['./substance-disulfide-links.component.scss']
})
export class SubstanceDisulfideLinksComponent extends SubstanceCardBase implements OnInit {
  disulfideLinks: Array<DisulfideLink>;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null
      && this.substance.protein != null
      && this.substance.protein.disulfideLinks != null
      && this.substance.protein.disulfideLinks.length) {
        this.disulfideLinks = this.substance.protein.disulfideLinks;
    }
  }


  getFullSite(site: Site ): string {
    return site.subunitIndex + '_' + site.residueIndex;
  }
}
