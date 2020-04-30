import { Component, OnInit } from '@angular/core';
import { AdminService } from '@gsrs-core/admin/admin.service';

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
    setTimeout(()=>{
      this.adminService.fetchJobs().subscribe( resp =>{
        this.loading = false;
        console.log(resp);
        console.log('picked up change');
        this.jobs = resp.content;
      });
    }, 1000);
  }


}
