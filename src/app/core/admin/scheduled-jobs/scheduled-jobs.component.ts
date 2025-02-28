import { Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
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
    currentService: string = 'clinical-trials';
    services: Array<string> = ["substances", "clinical-trials"];

  constructor(
    private adminService: AdminService
  ) { }

  onServiceSelectionChange(event: MatSelectChange) {
      this.currentService=event.value;
     this.reloadJobs();
    }


  reloadJobs() { 
    this.loading = true;
    this.adminService.fetchJobs((this.currentService)).pipe(take(1)).subscribe( resp => {
      this.jobs = [];
      this.loading = false;
      this.jobs = resp.content;
    });
  }

  
  ngOnInit() {
    this.loading = true;
    setTimeout(() => {
      this.adminService.fetchJobs((this.currentService)).pipe(take(1)).subscribe( resp => {
        this.loading = false;
        this.jobs = resp.content;
        console.log(this.jobs);
      });
  
    }, 1000);
  }


}
