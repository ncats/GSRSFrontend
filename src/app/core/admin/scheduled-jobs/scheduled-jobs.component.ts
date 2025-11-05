import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { ConfigService } from '@gsrs-core/config';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';


@Component({
    selector: 'app-scheduled-jobs',
    templateUrl: './scheduled-jobs.component.html',
    styleUrls: ['./scheduled-jobs.component.scss'],
    standalone: false
})
export class ScheduledJobsComponent implements OnInit {

    jobs: any = [];
    loading: boolean;
    currentService: string = 'substances';
    services: Array<string> = [];

  constructor(
    private adminService: AdminService,
    private configService: ConfigService
  ) { }

  onServiceSelectionChange(event: MatSelectChange) {
    this.currentService=event.value;
    this.reloadJobs();
  }

  reloadJobs() { 
    this.loading = true;
    this.adminService.fetchJobs(this.currentService).pipe(take(1)).subscribe( resp => {
      this.jobs = [];
      this.loading = false;
      this.jobs = resp.content;
    });
  }
  
  ngOnInit() {
    let activeAndHasEntitiesServices = _.filter(this.configService.configData?.services || [], {  'active': true, 'hasEntities': true });
    this.services = _.map(activeAndHasEntitiesServices, "name", ).sort();
    this.loading = true;
    setTimeout(() => {
      this.adminService.fetchJobs(this.currentService).pipe(take(1)).subscribe( resp => {
        this.loading = false;
        this.jobs = resp.content;
      });
    }, 1000);
  }


}
