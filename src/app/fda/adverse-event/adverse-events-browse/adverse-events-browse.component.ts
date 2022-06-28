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
  adverseEventPtCount = 0;
  adverseEventDmeCount = 0;
  adverseEventCvmCount = 0;
  tabSelectedIndex = 0;
  category = 'Adverse Event PT';

  constructor(
    public adverseEventService: AdverseEventService,
    private facetManagerService: FacetsManagerService) { }

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

  getAdverseEventPtCount($event: any) {
    this.adverseEventPtCount = $event;
    if (this.adverseEventPtCount > 0) {
      this.tabSelectedIndex = 0;
    }
  }

  getAdverseEventDmeCount($event: any) {
    this.adverseEventDmeCount = $event;
    // if PT and CVM counts are 0, and DME count is greater than 0, set the tab to DME
    if (((this.adverseEventPtCount == 0) && (this.adverseEventCvmCount == 0)) && (this.adverseEventDmeCount > 0)) {
      this.tabSelectedIndex = 1;
    }
  }

  getAdverseEventCvmCount($event: any) {
    this.adverseEventCvmCount = $event;
    // if PT and DME counts are 0, and CVM count is greater than 0, set the tab to CVM
    if (((this.adverseEventPtCount == 0) && (this.adverseEventDmeCount == 0)) && (this.adverseEventCvmCount > 0)) {
      this.tabSelectedIndex = 2;
    }
  }

}
