import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { Facet, FacetsManagerService, FacetUpdateEvent } from '@gsrs-core/facets-manager';
import { AdverseEventService } from '../service/adverseevent.service';

@Component({
  selector: 'app-adverse-events-browse',
  templateUrl: './adverse-events-browse.component.html',
  styleUrls: ['./adverse-events-browse.component.scss']
})
export class AdverseEventsBrowseComponent implements OnInit, AfterViewInit {

  tabSelectedIndex = 0;
  category = 'Adverse Event PT';

  constructor(
    public adverseEventService: AdverseEventService,
    private facetManagerService: FacetsManagerService)
    { }

  ngOnInit() {
    this.facetManagerService.registerGetFacetsHandler(this.adverseEventService.getAdverseEventPtFacets);
  }

  ngAfterViewInit() {
    this.facetManagerService.registerGetFacetsHandler(this.adverseEventService.getAdverseEventPtFacets);
  }

  tabSelectedUpdated(event: MatTabChangeEvent) {
    if (event) {
      this.category = event.tab.textLabel;

      this.setFacetsforTabs();
    }
  }

  setFacetsforTabs() {
    if (this.category) {
      if (this.category === 'Adverse Event PT') {
        this.facetManagerService.registerGetFacetsHandler(this.adverseEventService.getAdverseEventPtFacets);
      }
      if (this.category === 'Adverse Event DME') {
        this.facetManagerService.registerGetFacetsHandler(this.adverseEventService.getAdverseEventDmeFacets);
      }
      if (this.category === 'Adverse Event CVM') {
        this.facetManagerService.registerGetFacetsHandler(this.adverseEventService.getAdverseEventCvmFacets);
      }
    }
  }

}
