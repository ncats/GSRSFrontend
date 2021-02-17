import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ImpuritiesService } from '../../../impurities/service/impurities.service';
import { SubstanceDetailsBaseTableDisplay } from '../substance-details-base-table-display';
import { Impurities, ImpuritiesTesting, ImpuritiesDetails, IdentityCriteria } from '../../../impurities/model/impurities.model';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { take } from 'rxjs/operators';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-substance-impurities',
  templateUrl: './substance-impurities.component.html',
  styleUrls: ['./substance-impurities.component.scss']
})
export class SubstanceImpuritiesComponent extends SubstanceDetailsBaseTableDisplay implements OnInit, OnDestroy {

  @Input() substanceUuid: string;
  @Output() countImpuritiesOut: EventEmitter<number> = new EventEmitter<number>();
  private subscriptions: Array<Subscription> = [];
  showSpinner = false;
  impurities: any;
  impuritiesCount = 0;
  impuritiesTestTotal = 0;
  displayedColumns: string[] = [
    'details',
    'sourceType',
    'source',
    'sourceid',
    'type',
    'specType'
  ];

  constructor(
    public gaService: GoogleAnalyticsService,
    private impuritiesService: ImpuritiesService,
    private authService: AuthService
  ) {
    super(gaService, impuritiesService);
  }

  ngOnInit() {
    const rolesSubscription = this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
      this.isAdmin = response;
    });
    this.subscriptions.push(rolesSubscription);

    if (this.substanceUuid) {
      this.getSubstanceImpurities();
      this.impuritiesListExportUrl();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  getSubstanceImpurities(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.showSpinner = true;  // Start progress spinner
    this.impuritiesService.getSubstanceImpurities(this.substanceUuid, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.impurities = results;
      this.getImpuritiesTestTotal();
      this.impuritiesCount = this.totalRecords;
      this.countImpuritiesOut.emit(this.impuritiesCount);
      this.showSpinner = false;  // Stop progress spinner
    });
  }

  getImpuritiesTestTotal(): void {
    // Get Impurities Test Count
    // if (Object.keys(this.impurities).length > 0) {}
  }

  impuritiesListExportUrl() {
    if (this.substanceUuid != null) {
      this.exportUrl = this.impuritiesService.getImpuritiesListExportUrl(this.substanceUuid);
    }
  }

}
