import { Component, OnInit } from '@angular/core';
import {Linkage, Site} from '../../substance/substance.model';
import {SubstanceCardBase} from '../substance-card-base';

@Component({
  selector: 'app-substance-na-linkages',
  templateUrl: './substance-na-linkages.component.html',
  styleUrls: ['./substance-na-linkages.component.scss']
})
export class SubstanceNaLinkagesComponent extends SubstanceCardBase implements OnInit {
  linkages: Array<Linkage>;
  displayedColumns: string[] = ['linkage' , 'Site Range' , 'Site Count' ];
  siteCount: number;

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null
      && this.substance.nucleicAcid != null
      && this.substance.nucleicAcid.linkages != null
      && this.substance.nucleicAcid.linkages.length) {
      this.linkages = this.substance.nucleicAcid.linkages;
      this.countUpdate.emit(this.linkages.length);
      this.getTotalSites();
    }
  }

  getTotalSites() {
    this.siteCount = 0;
    for (const linkage of this.linkages) {
      this.siteCount = this.siteCount + linkage.sites.length;
    }

  }

  getSiteCount(sites: Array<Site>): string {
    return sites.length + '/' + this.siteCount;
  }

}
