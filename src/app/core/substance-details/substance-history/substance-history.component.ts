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
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {SubstanceCardBase} from '@gsrs-core/substance-details/substance-card-base';
import {SubstanceDetail, SubstanceEdit, SubstanceName} from '@gsrs-core/substance/substance.model';
import {SubstanceService} from '@gsrs-core/substance/substance.service';
import {LoadingService} from '@gsrs-core/loading/loading.service';
import {MainNotificationService} from '@gsrs-core/main-notification/main-notification.service';
import {Router} from '@angular/router';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics/google-analytics.service';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-details/substance-card-base-filtered-list';
import {Subject, Subscription} from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceHistoryDialogComponent } from '@gsrs-core/substance-history-dialog/substance-history-dialog.component';

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
  private overlayContainer: HTMLElement;



  constructor(
    private substanceService: SubstanceService,
    private router: Router,
    public loadingService: LoadingService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog

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
  this.overlayContainer = this.overlayContainerService.getContainerElement();
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
      const dialogRef = this.dialog.open(SubstanceHistoryDialogComponent, {
        data: {'substance': this.substance, 'version': version, 'latest': this.latest},
        width: '650px',
        autoFocus: false,
        disableClose: true
      });
       this.overlayContainer.style.zIndex = '1002';
      const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
        this.overlayContainer.style.zIndex = null;

        if (response && response === 'success' ) {
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/substances/' + this.substance.uuid + '/']);
        }
      });

  }


}
