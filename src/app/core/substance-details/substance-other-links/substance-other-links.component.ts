import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {isPairedLinkageType, Link, Site, SubstanceDetail} from '../../substance/substance.model';
import {Subject} from 'rxjs';

@Component({
    selector: 'app-substance-other-links',
    templateUrl: './substance-other-links.component.html',
    styleUrls: ['./substance-other-links.component.scss'],
    standalone: false
})
export class SubstanceOtherLinksComponent extends SubstanceCardBase implements OnInit {
  otherLinks: Array<Link> = [];
  displayedColumns = ['linkageType', 'residueIndex'];
  // Paired-linkage links (e.g. Cys-linker-Cys) get their own To/From table, like Protein Disulfide Links.
  pairedLinks: Array<{linkageType: string, to: string, from: string}> = [];
  pairedDisplayedColumns = ['linkageType', 'to', 'from'];
  substanceUpdated = new Subject<SubstanceDetail>();


  constructor() {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      this.otherLinks = [];
      this.pairedLinks = [];
      if (this.substance != null
        && this.substance.protein != null
        && this.substance.protein.otherLinks != null
        && this.substance.protein.otherLinks.length) {
        for (const link of this.substance.protein.otherLinks) {
          if (isPairedLinkageType(link.linkageType) && link.sites && link.sites.length > 1) {
            for (let i = 0; i < link.sites.length; i += 2) {
              const to = link.sites[i];
              const from = link.sites[i + 1];
              this.pairedLinks.push({
                linkageType: link.linkageType,
                to: this.getFullSite(to),
                from: from ? this.getFullSite(from) : ''
              });
            }
          } else {
            this.otherLinks.push(link);
          }
        }
        // Count reflects Link records (matches Protein Disulfide Links), not expanded pair rows.
        this.countUpdate.emit(this.substance.protein.otherLinks.length);
      } else {
        this.countUpdate.emit(0);
      }
    });
  }

  getFullSite(site: Site ): string {
    return site.subunitIndex + '_' + site.residueIndex;
  }

}
