import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from '@gsrs-core/admin/admin.service';
import * as moment from 'moment';
import cronstrue from 'cronstrue';
import { ScheduledJob } from '@gsrs-core/admin/scheduled-jobs/scheduled-job.model';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-scheduled-job',
  templateUrl: './scheduled-job.component.html',
  styleUrls: ['./scheduled-job.component.scss']
})
export class ScheduledJobComponent implements OnInit {

    @Input() job: ScheduledJob;
    @Input() pollIn: any;
    monitor: any;
    quickLoad = false;
    mess: any;
  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.monitor= this.pollIn;
     this.refresh(true);

  }

  momentTime(time: any) {
    return moment(time).fromNow();
  }

  cronTime(time: any) {
    return cronstrue.toString(time);
  }

  refresh(spawn?: boolean) {
    this.adminService.fetchJob(this.job.id).pipe(take(1)).subscribe( response =>{
      this.job = response;
      if (this.job.cronSchedule){
        if (!this.job.running && this.job.lastFinished){
          this.job.lastDurationHuman=(this.job.lastFinished-this.job.lastStarted);
        }
      }
      this.quickLoad = false;
      if ((this.monitor && spawn)|| this.job.id === 1) {
        this.mess = "Polling ... " + response.status;
        if (this.job.running){
          setTimeout(()=>{
            this.refresh(true);
          }, Math.min(this.untilNextRun(), 200));
        }else{
          setTimeout(()=>{
            this.refresh(true);
          }, Math.min(this.untilNextRun(), 10000));
        }
    }
    }, error => {
      this.monitor = false;
      console.log(error);
    });


  }

  untilNextRun(){
    const date = new Date();
    return this.job.nextRun-( date.getTime() - 0);
  };

  stopMonitor() {
    this.monitor = false;
    this.mess = "";
}

disable (job: any) {
  this.adminService.runJob(job["@disable"]).pipe(take(1)).subscribe( response =>{
    this.refresh();
  });
}

enable(job: any) {
      this.adminService.runJob(job["@enable"]).pipe(take(1)).subscribe( response =>{
        this.refresh();
      });
}

execute(job: any) {
  this.quickLoad = true;
  this.adminService.runJob(job["@execute"]).pipe(take(1)).subscribe( response =>{
    this.refresh(true);
  }, error => {
    setTimeout(()=>{this.refresh()});
  });
}
cancel(job: any) {
  this.adminService.runJob(job["@cancel"]).pipe(take(1)).subscribe( response =>{
    this.refresh();
  });
}

formatDate(ts){
  return new Date(ts)+"";
}

}
