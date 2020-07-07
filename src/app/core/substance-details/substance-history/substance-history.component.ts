import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {MatDialogModule, MatIconModule} from '@angular/material';
import {SubstanceCardBase} from '@gsrs-core/substance-details/substance-card-base';
import {SubstanceDetail, SubstanceEdit, SubstanceName} from '@gsrs-core/substance/substance.model';
import {SubstanceService} from '@gsrs-core/substance/substance.service';
import {LoadingService} from '@gsrs-core/loading/loading.service';
import {MainNotificationService} from '@gsrs-core/main-notification/main-notification.service';
import {Router} from '@angular/router';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics/google-analytics.service';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-details/substance-card-base-filtered-list';
import {Subject, Subscription} from 'rxjs';

@Component({
  selector: 'app-substance-history',
  templateUrl: './substance-history.component.html',
  styleUrls: ['./substance-history.component.scss']
})
export class SubstanceHistoryComponent extends SubstanceCardBase implements OnInit , AfterViewInit {
  versions: Array<SubstanceEdit>;
  displayedColumns: string[] = ['view', 'version', 'versionComments', 'editor', 'changeDate', 'restore'];
  substanceUpdated = new Subject<SubstanceDetail>();
  latest: any;


  constructor(
    private substanceService: SubstanceService,
    private router: Router,
    public loadingService: LoadingService
  ) {
    super();
  }
  ngOnInit() {
   this.substanceService.getEdits(this.substance.uuid).subscribe( response => {
     this.versions = response;
   }, error => {} );
   this.substanceService.checkVersion(this.substance.uuid).subscribe((result: number) => {
    this.latest = result;
  });
  }

  ngAfterViewInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
    });
  }

  switchVersion(version): void {
    this.router.navigate(['/substances/' + this.substance.uuid + '/v/' + version]);
  }

  restoreVersion(version: any) {
    if (confirm('Are you sure you\'d like to restore version ' + this.substance.version + '?')) {
      this.loadingService.setLoading(true);
      this.substanceService.getSubstanceDetails(this.substance.uuid, version).subscribe( sub => {
        this.substance.changeReason = 'reverted to version ' + version;
        this.substance.version = this.latest;
        this.substanceService.saveSubstance(this.substance).subscribe( response => {
          this.substance = response;
          alert('record restored successfully');
          this.router.navigate(['/substances/' + this.substance.uuid + '/']);
        }, error => {
          this.loadingService.setLoading(false);
          alert('There was a problem restoring version');
          const results = {'serverError': null, 'validationMessages': null};
          if (error && error.error && error.error.validationMessages) {
            results.validationMessages = error.error.validationMessages;
          } else {
            results.serverError = error;
          }

        });
      }, error => {
        this.loadingService.setLoading(false);
        alert('There was a problem fetching this substance version');
      });
    }

  }


}
