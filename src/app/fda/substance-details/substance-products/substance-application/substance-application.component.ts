import { Component, OnInit } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ApplicationService } from '../../../applications/service/application.service';

@Component({
  selector: 'app-substance-application',
  templateUrl: './substance-application.component.html',
  styleUrls: ['./substance-application.component.scss']
})

export class SubstanceApplicationComponent extends SubstanceCardBaseFilteredList<any> implements OnInit {
  public applications: Array<any> = [];
  displayedColumns: string[] = ['appType', 'appNumber', 'center', 'sponsorName', 'applicationStatus', 'applicationSubType'];
  //, 'applicationNumber', 'center', 'productName', 'sponsorName', 'applicationStatus', 'applicationSubType'];

  constructor(
    public gaService: GoogleAnalyticsService,
    private applicationService: ApplicationService
  ) {
    super(gaService);
  }

  ngOnInit() {
    console.log("inside app substance details: ");
    this.getSubstanceApplications();
    if (this.substance) {
      console.log("SUBSTANCE");
    }
    if (this.substance && this.substance.uuid) {
      this.getSubstanceApplications();
    }
  }

  getSubstanceApplications(): void {
    this.applicationService.getSubstanceApplications('AAAAAAA').subscribe(applications => {
      console.log("LENGTH: " + applications.length);
      this.applications = applications;
      this.filtered = applications;
      this.pageChange();

      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.applications, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.countUpdate.emit(applications.length);
    });
  }
    
}
