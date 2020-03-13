import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverseevent/service/adverseevent.service';
import { SubstanceDetailsBaseTableDisplay } from '../../../substance-products/substance-details-base-table-display';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-substance-adverseeventcvm',
  templateUrl: './substance-adverseeventcvm.component.html',
  styleUrls: ['./substance-adverseeventcvm.component.scss']
})

export class SubstanceAdverseEventCvmComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  advCvmCount = 0;

  @Output() countAdvCvmOut: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = [
    'adverseEvent', 'species', 'adverseEventCount', 'routeOfAdmin'
  ];

  constructor(
    public gaService: GoogleAnalyticsService,
    private adverseEventService: AdverseEventService
  ) {
    super(gaService, adverseEventService);
  }

  ngOnInit() {
    if (this.bdnum) {
      this.getSubstanceAdverseEventCvm();
      this.adverseEventCvmListExportUrl();
    }
  }

  getSubstanceAdverseEventCvm(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.adverseEventService.getSubstanceAdverseEventCvm(this.bdnum, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.advCvmCount = this.totalRecords;
      this.countAdvCvmOut.emit(this.advCvmCount);

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

  adverseEventCvmListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.adverseEventService.getAdverseEventCvmListExportUrl(this.bdnum);
    }
  }

}

