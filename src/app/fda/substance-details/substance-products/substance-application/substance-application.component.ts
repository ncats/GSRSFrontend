import { Component, OnInit, Input } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ApplicationService } from '../../../applications/service/application.service';
import { SubstanceDetailsBaseTableDisplay } from '../../substance-products/substance-details-base-table-display';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-substance-application',
  templateUrl: './substance-application.component.html',
  styleUrls: ['./substance-application.component.scss']
})

export class SubstanceApplicationComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  displayedColumns: string[] = [
    'appType', 'appNumber', 'center', 'sponsorName', 'applicationStatus', 'applicationSubType'];

  constructor(
    public gaService: GoogleAnalyticsService,
    private applicationService: ApplicationService
  ) {
    super(gaService, applicationService);
  }

  ngOnInit() {
    if (this.bdnum) {
      this.getSubstanceApplications();
    }
  }

  getSubstanceApplications(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.applicationService.getSubstanceApplications(this.bdnum, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
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

}
