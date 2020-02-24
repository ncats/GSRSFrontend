import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ApplicationService } from '../../../applications/service/application.service';
import { SubstanceDetailsBaseTableDisplay } from '../../substance-products/substance-details-base-table-display';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from '@gsrs-core/auth';

@Component({
  selector: 'app-substance-application',
  templateUrl: './substance-application.component.html',
  styleUrls: ['./substance-application.component.scss']
})

export class SubstanceApplicationComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  applicationCount = 0;
  centerList = '';
  center = '';
  fromTable = '';
  loadingStatus = '';

  @Output() countApplicationOut: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = [
    'appType', 'appNumber', 'center', 'sponsorName', 'applicationStatus', 'applicationSubType'];

  constructor(
    public gaService: GoogleAnalyticsService,
    private applicationService: ApplicationService,
    public authService: AuthService
  ) {
    super(gaService, applicationService);
  }

  ngOnInit() {

    this.isAdmin = this.authService.hasAnyRoles('Admin', 'Updater', 'SuperUpdater');

    if (this.bdnum) {
      this.getApplicationCenterByBdnum();
      // this.getSubstanceApplications();
    }
  }

  getApplicationCenterByBdnum(): string {
    this.applicationService.getApplicationCenterByBdnum(this.bdnum).subscribe(results => {
      this.centerList = results.centerList;
    });
    return this.centerList;
  }

  applicationTabSelected($event) {
    if ($event) {
      const evt: any = $event.tab;
      const textLabel: string = evt.textLabel;
      // Get Center and fromTable/Source from Tab Label
      if (textLabel != null) {
        this.loadingStatus = 'Loading data...';
        const index = textLabel.indexOf(' ');
        this.center = textLabel.slice(0, index);
        this.fromTable = textLabel.slice(index + 1, textLabel.length);

        // set the current result data to empty or null.
        this.paged = [];

        this.getSubstanceApplications();

      }

    }
  }

  getSubstanceApplications(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.applicationService.getSubstanceApplications(this.bdnum, this.center, this.fromTable, this.page, this.pageSize)
      .subscribe(results => {
        this.setResultData(results);
        this.applicationCount = this.totalRecords;
        this.countApplicationOut.emit(this.applicationCount);
        this.loadingStatus = '';
      });

    /*
        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.clinicaltrials, this.analyticsEventCategory);
        }, error => {
          console.log(error);
        });
        this.countUpdate.emit(clinicaltrials.length);
      });
      */
  }


  get updateApplicationUrl(): string {
    return this.applicationService.getUpdateApplicationUrl();
  }

}
