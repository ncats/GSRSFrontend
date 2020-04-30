import { Component, OnInit, Input } from '@angular/core';
import { AdminService } from '@gsrs-core/admin/admin.service';

@Component({
  selector: 'app-scheduled-job',
  templateUrl: './scheduled-job.component.html',
  styleUrls: ['./scheduled-job.component.scss']
})
export class ScheduledJobComponent implements OnInit {

    @Input() job: any;
    @Input() pollIn: any;
    monitor: any;
    quickLoad = false;
    mess: any;
  constructor(
    private adminService: AdminService
  ) { }

  ngOnInit() {
    this.monitor= this.pollIn;
     this.refresh(true);
    console.log('loaded');

  }

  refresh(spawn?: boolean) {
    this.adminService.fetchJob(this.job.id).subscribe( response =>{
      this.job = response;
      this.quickLoad = false;
      if ((this.monitor && spawn)|| this.job.id === 1) {
        this.mess = "Polling ... " + response.status;
        if(this.job.running){
          setTimeout(()=>{
            this.refresh(true);
          }, Math.min(this.untilNextRun(), 100));
        }else{
          setTimeout(()=>{
            this.refresh(true);
          }, Math.min(this.untilNextRun(), 5000));
        }
    }
    }, error => {
      this.monitor = false;
      console.log(error);
    });


  }

  untilNextRun(){
    const date = new Date();
    return this.job.nextRun-( date.getTime() -0);
  };

  set(n:any){
    this.job = n;
    if (n.cronSchedule){
      var t=n.cronSchedule.split(" ");
      t[0]=""; //quartz fix
      var mod=t.join(" ").trim();
      // n.cronScheduleHuman = prettyCron.toString(mod);
      n.cronScheduleHuman = "";
      if(n.cronSchedule.indexOf("#")>0){
        var nth = n.cronSchedule.split("#")[1].split(" ")[0];
        switch(nth){
          case "1":
            var cr=n.cronScheduleHuman;
            cr=cr.replace("on ", "on the first ");
            cr=cr + " of the month ";
            n.cronScheduleHuman=cr;
            break;
          case "2":
            var cr=n.cronScheduleHuman;
            cr=cr.replace("on ", "on the second ");
            cr=cr + " of the month ";
            n.cronScheduleHuman=cr;
            break;
          case "3":
            var cr=n.cronScheduleHuman;
            cr=cr.replace("on ", "on the third ");
            cr=cr + " of the month ";
            n.cronScheduleHuman=cr;
            break;
          case "4":
            var cr=n.cronScheduleHuman;
            cr=cr.replace("on ", "on the forth ");
            cr=cr + " of the month ";
            n.cronScheduleHuman=cr;
            break;
        }
      }
    
    }
    if (!n.running && n.lastFinished){
       n.lastDurationHuman=(n.lastFinished-n.lastStarted, { round: true });
    }
    return n;
  }

  stopMonitor() {
    this.monitor = false;
    this.mess = "";
}

disable (job: any) {
  this.adminService.runJob(job["@disable"]).subscribe( response =>{
    this.refresh();
  });
}

enable(job: any) {
  console.log(job);
      this.adminService.runJob(job["@enable"]).subscribe( response =>{
        this.refresh();
      });
}

execute(job: any) {
  this.quickLoad = true;
  console.log(job);
  this.adminService.runJob(job["@execute"]).subscribe( response =>{
    console.log(response);
    this.refresh();
  },error => {
    console.log(error);
    setTimeout(()=>{this.refresh()});
  });
}
cancel(job: any) {
  console.log(job);
  this.adminService.runJob(job["@cancel"]).subscribe( response =>{
    this.refresh();
  });
}

formatDate(ts){
  return new Date(ts)+"";
}

}
