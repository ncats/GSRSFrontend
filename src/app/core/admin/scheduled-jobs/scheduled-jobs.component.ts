import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { ConfigService } from '@gsrs-core/config';
import { take } from 'rxjs/operators';
import lodashFilter from 'lodash/filter';
import lodashMap from 'lodash/map';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { ScheduledJobComponent } from '@gsrs-core/admin/scheduled-jobs/scheduled-job/scheduled-job.component';


@Component({
    selector: 'app-scheduled-jobs',
    templateUrl: './scheduled-jobs.component.html',
    styleUrls: ['./scheduled-jobs.component.scss'],
    standalone: true,
    imports: [FormsModule, MatCardModule, MatFormFieldModule, MatOptionModule, MatProgressSpinnerModule, MatSelectModule, ScheduledJobComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ScheduledJobsComponent implements OnInit {

    jobs: any = [];
    loading: boolean;
    currentService: string = 'substances';
    services: Array<string> = [];

  constructor(
    private adminService: AdminService,
    private configService: ConfigService,
    private cdr: ChangeDetectorRef
  ) { }

  onServiceSelectionChange(event: MatSelectChange) {
    this.currentService=event.value;
    this.reloadJobs();
  }

  reloadJobs() {
    this.loading = true;
    this.adminService.fetchJobs(this.currentService).pipe(take(1)).subscribe( resp => {
      this.jobs = [];
      this.loading = false;
      this.jobs = resp.content;
      this.cdr.markForCheck();
    });
  }

  ngOnInit() {
    let activeAndHasEntitiesServices = lodashFilter(this.configService.configData?.services || [], {  'active': true, 'hasEntities': true });
    this.services = lodashMap(activeAndHasEntitiesServices, "name", ).sort();
    this.loading = true;
    setTimeout(() => {
      this.adminService.fetchJobs(this.currentService).pipe(take(1)).subscribe( resp => {
        this.loading = false;
        this.jobs = resp.content;
        this.cdr.markForCheck();
      });
    }, 1000);
  }


}
