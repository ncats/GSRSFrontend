import { Component, OnInit, OnDestroy } from '@angular/core';
import { HealthInfo } from '@gsrs-core/admin/admin-objects.model';
import { AuthService } from '@gsrs-core/auth';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

@Component({
  selector: 'app-cache-summary',
  templateUrl: './cache-summary.component.html',
  styleUrls: ['./cache-summary.component.scss']
})
export class CacheSummaryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['database', 'driver', 'product', 'latency', 'connected'];
  health: HealthInfo;
  sub: Subscription;
  runtime = '';
  constructor(
     private adminService: AdminService
  ) { }

  ngOnInit() {
    this.sub = this.adminService.getEnvironmentHealth().subscribe(response => {
          this.health = response;
          this.setStart();
      });
  }

  setStart() {
    if (!this.health.epoch) {
      const date = new Date();
      const duration = moment.duration((( date.getTime() - 0) - this.health.epoch));
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
        timestring = (( date.getTime() - 0) - this.health.epoch) + ' ms';
      }
      this.runtime = timestring;
  }
}


  ngOnDestroy() {
      this.sub.unsubscribe();
  }

}
