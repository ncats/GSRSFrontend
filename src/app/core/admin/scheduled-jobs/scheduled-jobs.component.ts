import { Component, OnInit } from '@angular/core';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-scheduled-jobs',
  templateUrl: './scheduled-jobs.component.html',
  styleUrls: ['./scheduled-jobs.component.scss']
})
export class ScheduledJobsComponent implements OnInit {

    jobs: any = [];
    loading: boolean;

  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    //todo: come up with an elegant way of fetching from multiple URLs
    this.loading = true;
    setTimeout(() => {
      this.adminService.fetchJobs().pipe(take(1)).subscribe( resp => {
        this.loading = false;
        this.jobs = resp.content;
      });
    }, 1000);
    this.loading = true;
    console.log(`going to fetch additional jobs`);
    setTimeout(() => {
      this.adminService.fetchAdditionalJobs().pipe(take(1)).subscribe( resp => {
        console.log(`received additional jobs`);
        this.loading = false;
        let additionalJobs:any = resp.content;
        if( additionalJobs && additionalJobs.length >0) {
          console.log(`adding ${additionalJobs.length} jobs`);
          this.jobs = [...this.jobs, ...additionalJobs];
        }
      });
    }, 1000);
  }


}
