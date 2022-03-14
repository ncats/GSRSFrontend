import { Component, OnInit, Input, OnDestroy } from '@angular/core';
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
export class ScheduledJobComponent implements OnInit, OnDestroy {

    @Input() job: ScheduledJob;
    @Input() pollIn: any;
    monitor: boolean;
    quickLoad = false;
    mess: any;
  constructor(
    private adminService: AdminService,
  ) { }

  ngOnInit() {
    this.monitor = this.pollIn;
     this.refresh(true);

  }

  ngOnDestroy() {
    this.monitor = false;
    this.refresh(false);
    this.stopMonitor();
  }

  momentTime(time: any) {
    return moment(time).fromNow();
  }

  cronTime(time: any) {
    return cronstrue.toString(time);
  }

  refresh(spawn?: boolean) {
    this.adminService.fetchJob(this.job.id).pipe(take(1)).subscribe( response => {
      this.job = response;
      if (!this.job.running && this.job.lastFinished) {
        const duration = moment.duration((this.job.lastFinished - this.job.lastStarted));
        let timestring = '';
        if ( duration.years() !== 0) {
          timestring += duration.years() + (duration.years() > 1 ? ' years, ' : ' year, ');
        }
        if ( duration.months() !== 0) {
          timestring += duration.months() + (duration.months() > 1 ? ' months, ' : ' month, ');
        }
        if ( duration.days() !== 0) {
          timestring += duration.days() + (duration.days() > 1 ? ' days, ' : ' day, ');
        }
        if ( duration.hours() !== 0) {
          timestring += duration.hours() + (duration.hours() > 1 ? ' hrs, ' : ' hr, ');
        }
        if ( duration.minutes() !== 0) {
          timestring += duration.minutes() + (duration.minutes() > 1 ? ' min, ' : ' min, ');
        }
        if ( duration.seconds() !== 0) {
          timestring += duration.seconds() + (duration.seconds() > 1 ? ' sec' : ' sec');
        } else if (timestring === '') {
          timestring = (this.job.lastFinished - this.job.lastStarted) + ' ms';
        }
        this.job.lastDurationHuman = timestring;


     }
      this.quickLoad = false;
      if (this.monitor && spawn) {
        this.mess = 'Polling ... ' + response.status;
        if (this.job.running) {
          setTimeout(() => {
            this.refresh(true);
          }, Math.min(this.untilNextRun(), 200));
        } else {
          setTimeout(() => {
            this.refresh(true);
          }, Math.min(this.untilNextRun(), 10000));
        }
    }
    }, error => {
      this.monitor = false;
      console.log(error);
    });


  }

  untilNextRun() {
    const date = new Date();
    return this.job.nextRun - ( date.getTime() - 0);
  }

  stopMonitor() {
    this.monitor = false;
}

disable(job: any) {
  this.adminService.runJob(job['@disable']).pipe(take(1)).subscribe( response => {
    this.refresh();
  });
}

enable(job: any) {
      this.adminService.runJob(job['@enable']).pipe(take(1)).subscribe( response => {
        this.refresh();
      });
}

execute(job: any) {
  this.quickLoad = true;
  this.adminService.runJob(job['@execute']).pipe(take(1)).subscribe( response => {
    this.refresh(true);
  }, error => {
    setTimeout(() => {
      this.refresh();
    } );
  });
}
cancel(job: any) {
  this.adminService.runJob(job['@cancel']).pipe(take(1)).subscribe( response => {
    this.refresh();
  });
}

formatDate(ts) {
  return new Date(ts) + '';
}

}
