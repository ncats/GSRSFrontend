import { Component, OnInit, Input } from '@angular/core';
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
  displayedColumns: string[] = [
    'appType', 'appNumber', 'center', 'sponsorName', 'applicationStatus', 'applicationSubType'];
 
  @Input() bdnum: string;
  
  constructor(
    public gaService: GoogleAnalyticsService,
    private applicationService: ApplicationService
  ) {
    super(gaService);
  }

  ngOnInit() {
    console.log("inside app substance details: ");
  
    //if (this.substance && this.substance.uuid) {
      this.getSubstanceApplications();
   // }
  }

  getSubstanceApplications(): void {
    this.applicationService.getSubstanceApplications(this.bdnum).subscribe(applications => {
      console.log("LENGTH: " + applications.length + '  ' + this.bdnum);
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
