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
  displayedColumns: string[] = ['view', 'version', 'versionComments', 'editor', 'changeDate'];
  substanceUpdated = new Subject<SubstanceDetail>();


  constructor(
    private substanceService: SubstanceService,
    private router: Router
  ) {
    super();
  }
  ngOnInit() {
   this.substanceService.getEdits(this.substance.uuid).subscribe( response => {
     console.log(response);
     this.versions = response;
     console.log(this.versions);
   } );

  }

  ngAfterViewInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      console.log('resub after history');
    });
  }
  switchVersion(version) {
    this.router.navigate(['/substances/' + this.substance.uuid + '/v/' + version]);
  }


}
