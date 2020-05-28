import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { UploadObject } from '@gsrs-core/admin/admin-objects.model';

@Component({
  selector: 'app-monitor',
  templateUrl: './monitor.component.html',
  styleUrls: ['./monitor.component.scss']
})
export class MonitorComponent implements OnInit {
  jobId: any;
  loadJob: UploadObject;
  dynamic = 0;
  timeleft: string;
  max = 0;
  averagePersistRate: number;
  humanTimeTotal: string;
  humanTimeLeft: string;
  humanTimeEstimate: string;
  startedHuman: string;
  finishedHuman: string;
  message: string;
  monitor = true;
  stats: any = {};
  hide = false;
  test = {t: 0, f: 0, f2: 0, t2: 0, t3: 0, t1: 0, f1: 0};
  constructor(
    private activeRoute: ActivatedRoute,
    public adminService: AdminService,
    private router: Router
  ) { }

  ngOnInit() {
    this.activeRoute.params.subscribe(routeParams => {
      this.jobId = routeParams.id;
      this.adminService.queryLoad(this.jobId).pipe(take(1)).subscribe(response => {
      this.max = response.statistics.totalRecords.count;
      this.loadJob = response;
      this.stats.extractFail = 0;
      this.stats.extractPass = 0;
      this.stats.persistFail = 0;
      this.stats.persistPass = 0;
      this.stats.processedFail = 0;
      this.stats.processedPass = 0;
      this.humanizeFields(response);
      this.refresh(true);
      });
    });
  }

  clearJob(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: { 'function': 'data' }
    };
    this.router.navigate(['/admin'], navigationExtras);
  }

  refresh(bool?: boolean): void {
    this.adminService.queryLoad(this.loadJob.id).pipe(take(1)).subscribe(response => {
      if (this.test.f + this.test.t < 100 ) {
        this.test.t = this.test.t + 1;
        this.test.f =  this.test.f + 2;
      }
      if ((this.test.f2 + this.test.t2 < 100 )) {
        this.test.t2 = this.test.t2 + 1;
        this.test.f2 =  this.test.f2 + 2;
      }

      if ((this.test.f1 + this.test.t1 < 100 )) {
        if (this.test.t1 < 30) {
          this.test.t1 = this.test.t1 + 1;

        }
        if (this.test.t1 >= 30 && this.test.f1 < 30) {
          this.test.f1 = this.test.f1 + 1;

        }
        if (this.test.f1 >= 29 && this.test.t1 <= 60) {
          this.test.t1 = this.test.t1 + 1;
        }
        if (this.test.t1 >= 60) {
          this.test.f1++;
        }
      }
        this.loadJob = response;
        console.log(response);
        this.humanizeFields(response);
        if (response.status !== 'COMPLETE') {
          setTimeout(() => {
            if (this.monitor) {
              this.refresh();
            }
          });
        } else {
          this.monitor = false;
        }
      }, error => {
        this.message = 'invalid Job ID';
        this.jobId = null;
      });
  }

  humanizeFields(job: UploadObject): void {
    this.mixResultDisplay(job);
    this.dynamic = job.statistics.recordsPersistedSuccess +
    job.statistics.recordsPersistedFailed +
    job.statistics.recordsProcessedFailed +
    job.statistics.recordsExtractedFailed;
    const end = job.stop || null;
    this.humanTimeLeft = moment.duration(job.statistics.estimatedTimeLeft , 'milliseconds').humanize();
      if (!end) {
        this.averagePersistRate = 1000.0 / job.statistics.averageTimeToPersist;
      } else {
        this.averagePersistRate = job.statistics.recordsPersistedSuccess * 1000 / (end - job.start);
      }

      this.humanTimeTotal = moment.duration(end - job.start, 'milliseconds').humanize();
      // this.humanTimeTotal.full = this.toFullHumanTime(dur);
     // dur = moment.duration((end - job.start) + job.statistics.estimatedTimeLeft, 'milliseconds');
     ///  console.log(dur);

      this.humanTimeEstimate = moment.duration((end - job.start) + job.statistics.estimatedTimeLeft, 'milliseconds').humanize();
      if (job.start) {
        this.startedHuman = moment(job.start).fromNow();
      }
      if (job.stop) {
        this.finishedHuman = moment(job.stop).fromNow();
      }
     //  this.humanTimeEstimate.full = this.toFullHumanTime(dur);
  }

  mixResultDisplay(job): void  {
    this.stats.extractFail = (job.statistics.recordsExtractedFailed + job.statistics.recordsExtractedSuccess) / this.max * 100;
    this.stats.extractPass = (job.statistics.recordsExtractedSuccess);
    this.stats.persistFail = (job.statistics.recordsPersistedFailed + job.statistics.recordsPersistedSuccess) / this.max * 100;
    this.stats.persistPass = (job.statistics.recordsPersistedSuccess);
    this.stats.processedFail = (job.statistics.recordsProcessedFailed + job.statistics.recordsProcessedSuccess) / this.max * 100;
    this.stats.processedPass = (job.statistics.recordsProcessedSuccess);
    this.test.t3 = this.test.t1 + this.test.f1;

    console.log(this.stats);
  }

  toFullHumanTime(sent): string {
    let result = '0';
    if (sent.years() > 0) {
      result += sent.years() + ' years ';
    }
    if (sent.months() > 0 || result !== '') {
      result += sent.months() + ' months ';
    }
    if (sent.days() > 0 || result !== '') {
      result += sent.days() + ' days ';
    }
    if (sent.hours() > 0  || result !== '') {
      result += sent.hours() + ' hours ';
    }
    if (sent.minutes() > 0  || result !== '') {
      result += sent.minutes() + ' minutes ';
    }
    if (sent.seconds() > 0  || result !== '') {
      result += sent.seconds() + ' seconds';
    }
    return result;
  }

}
