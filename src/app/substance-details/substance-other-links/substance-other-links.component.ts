import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {Link, Site} from '../../substance/substance.model';

@Component({
  selector: 'app-substance-other-links',
  templateUrl: './substance-other-links.component.html',
  styleUrls: ['./substance-other-links.component.scss']
})
export class SubstanceOtherLinksComponent extends SubstanceCardBase implements OnInit {
  otherLinks: Array<Link>;
  displayedColumns = ['linkageType', 'residueIndex'];


  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null
      && this.substance.protein != null
      && this.substance.protein.otherLinks != null
      && this.substance.protein.otherLinks.length) {
      this.otherLinks = this.substance.protein.otherLinks;


    }
  }

  getFullSite(site: Site ): string {
    return site.subunitIndex + '_' + site.residueIndex;
  }

}
