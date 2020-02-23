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

    this.isAdmin = this.authService.hasAnyRoles('Updater', 'SuperUpdater');

    if (this.bdnum) {
      this.getSubstanceApplications();
    }
  }

  getSubstanceApplications(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.applicationService.getSubstanceApplications(this.bdnum, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.applicationCount = this.totalRecords;
      this.countApplicationOut.emit(this.applicationCount);
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
