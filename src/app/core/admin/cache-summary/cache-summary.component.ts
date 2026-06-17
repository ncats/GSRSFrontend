import { Component, OnInit, OnDestroy } from '@angular/core';
import { HealthInfo } from '@gsrs-core/admin/admin-objects.model';
import { AuthService } from '@gsrs-core/auth';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { Subscription, take } from 'rxjs';
import * as moment from 'moment';
import { MatSelectChange } from '@angular/material/select';
import { ConfigService } from '@gsrs-core/config';
import * as _ from 'lodash';
import { H } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-cache-summary',
  templateUrl: './cache-summary.component.html',
  styleUrls: ['./cache-summary.component.scss'],
  standalone: false
})
export class CacheSummaryComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['database', 'driver', 'product', 'latency', 'connected', 'max', 'active', 'usage'];
  health: HealthInfo;
  sub: Subscription;
  runtime = '';
  currentService: string = 'substances';
  services: Array<string> = [];
  loading: boolean;
  isError: boolean;

  constructor(
    private adminService: AdminService,
    private configService: ConfigService
  ) { }

  ngOnInit() {

    let activeAndHasEntitiesServices = _.filter(this.configService.configData?.services || [], { 'active': true, 'hasEntities': true });
    this.services = _.map(activeAndHasEntitiesServices, "name",).sort();
    //this.loading = true;
    // setTimeout(() => {
    //   this.adminService.fetchJobs(this.currentService).pipe(take(1)).subscribe( resp => {
    //     this.loading = false;
    //     //this.jobs = resp.content;
    //   });
    // }, 1000);

    this.reloadHealth();
  }

  reloadHealth() {
    this.isError = false;

    this.sub = this.adminService.getEnvironmentHealth(this.currentService).subscribe(response => {
      //this.loading = true;
      if (response.status != 200) {
        this.isError = true;
      }
      this.health = response.body;
      this.setStart();
      //this.loading = false;
    });
  }

  setStart() {
    if (this.health.epoch) {
      const date = new Date();
      const duration = moment.duration(((date.getTime() - 0) - this.health.epoch));
      let timestring = '';
      if (duration.years() !== 0) {
        timestring += duration.years() + (duration.years() > 1 ? ' years, ' : ' year, ');
      }
      if (duration.months() !== 0) {
        timestring += duration.months() + (duration.months() > 1 ? ' months, ' : ' month, ');
      }
      if (duration.days() !== 0) {
        timestring += duration.days() + (duration.days() > 1 ? ' days, ' : ' day, ');
      }
      if (duration.hours() !== 0) {
        timestring += duration.hours() + (duration.hours() > 1 ? ' hrs, ' : ' hr, ');
      }
      if (duration.minutes() !== 0) {
        timestring += duration.minutes() + (duration.minutes() > 1 ? ' min, ' : ' min, ');
      }
      if (duration.seconds() !== 0) {
        timestring += duration.seconds() + (duration.seconds() > 1 ? ' sec' : ' sec');
      } else if (timestring === '') {
        timestring = ((date.getTime() - 0) - this.health.epoch) + ' ms';
      }
      this.runtime = timestring;
    }
  }

  onServiceSelectionChange(event: MatSelectChange) {
    this.currentService = event.value;
    this.reloadHealth();
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }
}
