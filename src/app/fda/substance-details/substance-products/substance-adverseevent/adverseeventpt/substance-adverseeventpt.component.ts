import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverseevent/service/adverseevent.service';
import { SubstanceDetailsBaseTableDisplay } from '../../../substance-products/substance-details-base-table-display';

@Component({
  selector: 'app-substance-adverseeventpt',
  templateUrl: './substance-adverseeventpt.component.html',
  styleUrls: ['./substance-adverseeventpt.component.scss']
})

export class SubstanceAdverseEventPtComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  advPtCount = 0;

  @Output() countAdvPtOut: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = [
    'ptTerm',
    'primSoc',
    'caseCount',
    'ptCount',
    'prr'
  ];

  constructor(
    public gaService: GoogleAnalyticsService,
    private adverseEventService: AdverseEventService
  ) {
    super(gaService, adverseEventService);
  }

  ngOnInit() {
      if (this.bdnum) {
      this.getSubstanceAdverseEventPt();
      this.adverseEventPtListExportUrl();
    }
  }

  getSubstanceAdverseEventPt(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.adverseEventService.getSubstanceAdverseEventPt(this.bdnum, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.advPtCount = this.totalRecords;
      this.countAdvPtOut.emit(this.advPtCount);
    });

/*
      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.adverseevents, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.countUpdate.emit(adverseevents.length);
    });*/
  }

  adverseEventPtListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.adverseEventService.getAdverseEventPtListExportUrl(this.bdnum);
    }
  }

}
