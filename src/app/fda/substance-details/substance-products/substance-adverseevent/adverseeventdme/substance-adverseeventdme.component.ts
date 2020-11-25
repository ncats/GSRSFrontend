import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverseevent/service/adverseevent.service';
import { SubstanceDetailsBaseTableDisplay } from '../../../substance-products/substance-details-base-table-display';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-substance-adverseeventdme',
  templateUrl: './substance-adverseeventdme.component.html',
  styleUrls: ['./substance-adverseeventdme.component.scss']
})

export class SubstanceAdverseEventDmeComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  advDmeCount = 0;
  showSpinner = false;

  @Output() countAdvDmeOut: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = [
    'dmeReactions', 'ptTermMeddra', 'caseCount', 'dmeCount', 'dmeCountPercent', 'weightedAvgPrr'
  ];

  constructor(
    public gaService: GoogleAnalyticsService,
    private adverseEventService: AdverseEventService
  ) {
    super(gaService, adverseEventService);
  }

  ngOnInit() {
    if (this.bdnum) {
      this.getSubstanceAdverseEventDme();
      this.adverseEventDmeListExportUrl();
    }
  }

  getSubstanceAdverseEventDme(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.showSpinner = true;  // Start progress spinner
    this.adverseEventService.getSubstanceAdverseEventDme(this.bdnum, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.advDmeCount = this.totalRecords;
      this.countAdvDmeOut.emit(this.advDmeCount);
      this.showSpinner = false;  // Stop progress spinner
    });
      /*
      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.adverseevents, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.countUpdate.emit(adverseevents.length);
    });
    */
  }

  adverseEventDmeListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.adverseEventService.getAdverseEventDmeListExportUrl(this.bdnum);
    }
  }

}
