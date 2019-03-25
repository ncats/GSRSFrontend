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
  formatted: any = [];
  displayedColumns: string[] = ['to', 'from'];


  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null
      && this.substance.protein != null
      && this.substance.protein.disulfideLinks != null
      && this.substance.protein.disulfideLinks.length) {
        this.disulfideLinks = this.substance.protein.disulfideLinks;
        for (const link of this.disulfideLinks) {
          const tocol = link.sites[0].subunitIndex + '_' + link.sites[0].residueIndex;
          const fromcol = link.sites[1].subunitIndex + '_' + link.sites[1].residueIndex;
         this.formatted.push({to: tocol, from: fromcol});
        }
    }
  }


  getFullSite(site: Site ): string {
    return site.subunitIndex + '_' + site.residueIndex;
  }
}
