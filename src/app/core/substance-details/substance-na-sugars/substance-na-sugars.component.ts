import { Component, OnInit } from '@angular/core';
import {Sugar, Site, SubstanceDetail} from '../../substance/substance.model';
import {SubstanceCardBase} from '../substance-card-base';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-na-sugars',
  templateUrl: './substance-na-sugars.component.html',
  styleUrls: ['./substance-na-sugars.component.scss']
})
export class SubstanceNaSugarsComponent extends SubstanceCardBase implements OnInit {
  sugars: Array<Sugar>;
  displayedColumns: string[] = ['Sugar' , 'Site Range' , 'Site Count' ];
  siteCount: number;
  substanceUpdated = new Subject<SubstanceDetail>();

  constructor() {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null
        && this.substance.nucleicAcid != null
        && this.substance.nucleicAcid.sugars != null
        && this.substance.nucleicAcid.sugars.length) {
        this.sugars = this.substance.nucleicAcid.sugars;
        this.countUpdate.emit(this.sugars.length);
        this.getTotalSites();
      }
    });
  }

  getTotalSites() {
    this.siteCount = 0;
    for (const sugar of this.sugars) {
      this.siteCount = this.siteCount + sugar.sites.length;
    }

  }

  getSiteCount(sites: Array<Site>): string {
    return sites.length + '/' + this.siteCount;
  }

}
