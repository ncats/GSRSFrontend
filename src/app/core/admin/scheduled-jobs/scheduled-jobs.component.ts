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
    this.loading = true;
    setTimeout(() => {
      this.adminService.fetchJobs().pipe(take(1)).subscribe( resp => {
        this.loading = false;
        this.jobs = resp.content;
      });
    }, 1000);
  }


}
