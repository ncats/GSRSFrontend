import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ImpuritiesService } from '../../../impurities/service/impurities.service';
import { SubstanceDetailsBaseTableDisplay } from '../substance-details-base-table-display';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { take } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-substance-impurities',
  templateUrl: './substance-impurities.component.html',
  styleUrls: ['./substance-impurities.component.scss']
})
export class SubstanceImpuritiesComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  @Input() substanceUuid: string;
  @Output() countImpuritiesOut: EventEmitter<number> = new EventEmitter<number>();
  showSpinner = false;
  impuritiesCount = 0;
  
  displayedColumns: string[] = [
    'details',
    'source',
    'type',
    'specType',
    'impuritiesCount',
    'unspecifiedCount'
   // 'impurityType'
  ];

  constructor(
    public gaService: GoogleAnalyticsService,
    private impuritiesService: ImpuritiesService
  ) {
    super(gaService, impuritiesService);
  }

  ngOnInit() {
    if (this.substanceUuid) {
      this.getSubstanceImpurities();
      this.impuritiesListExportUrl();
    //  this.clinicalTrialListExportUrl();
    }
  }

  getSubstanceImpurities(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.showSpinner = true;  // Start progress spinner
    this.impuritiesService.getSubstanceImpurities(this.substanceUuid, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.impuritiesCount = this.totalRecords;
      this.countImpuritiesOut.emit(this.impuritiesCount);
      this.showSpinner = false;  // Stop progress spinner
    });
  }

  impuritiesListExportUrl() {
    if (this.substanceUuid != null) {
      this.exportUrl = this.impuritiesService.getImpuritiesListExportUrl(this.substanceUuid);
    }
  }

}
