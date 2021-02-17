import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
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

  @Input() substanceName: string;
  @Output() countAdvPtOut: EventEmitter<number> = new EventEmitter<number>();

  adverseEventShinySubstanceNameDisplay = false;
  adverseEventShinyAdverseEventDisplay = false;
  adverseEventShinySubstanceNameURL: string;
  adverseEventShinyAdverseEventURL: string;
  adverseEventShinySubstanceNameURLWithParam: string;
  adverseEventShinyAdverseEventURLWithParam: string;

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

      // Analysis by Substance in Shiny Config
      if (this.configService.configData.adverseEventShinySubstanceNameDisplay
         && this.configService.configData.adverseEventShinySubstanceNameDisplay !== null) {
        this.adverseEventShinySubstanceNameDisplay = JSON.parse(this.configService.configData.adverseEventShinySubstanceNameDisplay);
      }
      if (this.configService.configData.adverseEventShinySubstanceNameURL 
        && this.configService.configData.adverseEventShinySubstanceNameURL !== null) {
        this.adverseEventShinySubstanceNameURL = this.configService.configData.adverseEventShinySubstanceNameURL;
        this.adverseEventShinySubstanceNameURLWithParam = this.adverseEventShinySubstanceNameURL + decodeURIComponent(this.substanceName);
      }

      // Analysis by Adverse Event in Shiny Config
      if (this.configService.configData.adverseEventShinyAdverseEventDisplay
        && this.configService.configData.adverseEventShinyAdverseEventDisplay !== null) {
        this.adverseEventShinyAdverseEventDisplay = JSON.parse(this.configService.configData.adverseEventShinyAdverseEventDisplay);
      }
      if (this.configService.configData.adverseEventShinyAdverseEventURL
        && this.configService.configData.adverseEventShinyAdverseEventURL !== null) {
        this.adverseEventShinyAdverseEventURL = this.configService.configData.adverseEventShinyAdverseEventURL;
        this.adverseEventShinyAdverseEventURLWithParam = this.adverseEventShinyAdverseEventURL;
      }

    }
  }

  getDecodeURL(value: string): string {
    let result = '';
    if (value !== null) {
      result = decodeURIComponent(value);
    }
    return result;
  }

}

