import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {DisulfideLink, Site, SubstanceDetail} from '../../substance/substance.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-disulfide-links',
  templateUrl: './substance-disulfide-links.component.html',
  styleUrls: ['./substance-disulfide-links.component.scss']
})
export class SubstanceDisulfideLinksComponent extends SubstanceCardBase implements OnInit {
  disulfideLinks: Array<DisulfideLink>;
  formatted: any = [];
  displayedColumns: string[] = ['to', 'from'];
  substanceUpdated = new Subject<SubstanceDetail>();


  constructor() {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      this.formatted = [];
      if (this.substance != null
        && this.substance.protein != null
        && this.substance.protein.disulfideLinks != null
        && this.substance.protein.disulfideLinks.length) {
        this.disulfideLinks = this.substance.protein.disulfideLinks;
        for (const link of this.disulfideLinks) {
          if (link.sites && link.sites.length > 1) {
            const tocol = link.sites[0].subunitIndex + '_' + link.sites[0].residueIndex;
            const fromcol = link.sites[1].subunitIndex + '_' + link.sites[1].residueIndex;
            this.formatted.push({start: tocol, end: fromcol});
          }
        }
        this.countUpdate.emit(this.disulfideLinks.length);
      }
    });
  }


  getFullSite(site: Site ): string {
    return site.subunitIndex + '_' + site.residueIndex;
  }
}
