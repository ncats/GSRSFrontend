import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverseevent/service/adverseevent.service';
import { SubstanceDetailsBaseTableDisplay } from '../../../substance-products/substance-details-base-table-display';
import { Sort } from '@angular/material';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-substance-adverseeventpt',
  templateUrl: './substance-adverseeventpt.component.html',
  styleUrls: ['./substance-adverseeventpt.component.scss']
})

export class SubstanceAdverseEventPtComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  advPtCount = 0;
  orderBy = 5;
  ascDescDir = 'desc';
  showSpinner = false;

  @Output() countAdvPtOut: EventEmitter<number> = new EventEmitter<number>();

  adverseEventShinySubstanceNameDisplay: string;
  adverseEventShinySubstanceNameURL: string;
  filtered: Array<any>;
  displayedColumns: string[] = [
    'ptTerm',
    'primSoc',
    'caseCount',
    'ptCount',
    'prr'
  ];

  constructor(
    public gaService: GoogleAnalyticsService,
    private adverseEventService: AdverseEventService,
    private loadingService: LoadingService,
    private configService: ConfigService,
  ) {
    super(gaService, adverseEventService);
  }

  ngOnInit() {
    if (this.bdnum) {
      this.getSubstanceAdverseEventPt();
      this.adverseEventPtListExportUrl();
      this.getAdverseEventShinyConfig();
    }
  }

  getSubstanceAdverseEventPt(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    this.adverseEventService.getSubstanceAdverseEventPtAdv(this.bdnum, this.page, this.pageSize,
      this.orderBy, this.ascDescDir).subscribe(results => {
        this.setResultData(results);
        this.advPtCount = this.totalRecords;
        this.countAdvPtOut.emit(this.advPtCount);
        this.showSpinner = false;  // Stop progress spinner
      });
  }

  adverseEventPtListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.adverseEventService.getAdverseEventPtListExportUrl(this.bdnum);
    }
  }

  sortData(sort: Sort) {
    if (sort.active) {
      this.orderBy = this.displayedColumns.indexOf(sort.active) + 2; // Adding 2, for name and bdnum.
      this.ascDescDir = sort.direction;
      this.getSubstanceAdverseEventPt();
    }
    return;
  }

  getAdverseEventShinyConfig(): void {
    if (this.configService.configData) {
      if (this.configService.configData.adverseEventShinySubstanceNameDisplay !== null) {
        this.adverseEventShinySubstanceNameDisplay = JSON.parse(this.configService.configData.adverseEventShinySubstanceNameDisplay);
      }
      if (this.configService.configData.adverseEventShinySubstanceNameURL !== null) {
        this.adverseEventShinySubstanceNameURL = this.configService.configData.adverseEventShinySubstanceNameURL;
      }
    }
  }

}

