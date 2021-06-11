import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material';
import { PageEvent } from '@angular/material/paginator';
import { take } from 'rxjs/operators';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { FacetParam } from '@gsrs-core/facets-manager';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { ApplicationService } from '../../../application/service/application.service';
import { GeneralService } from '../../../service/general.service';
import { Application } from '../../../application/model/application.model';
import { SubstanceDetailsBaseTableDisplay } from '../../substance-products/substance-details-base-table-display';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';

@Component({
  selector: 'app-substance-application',
  templateUrl: './substance-application.component.html',
  styleUrls: ['./substance-application.component.scss']
})

export class SubstanceApplicationComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  applicationCount = 0;
  centerList = '';
  center = '';
  fromTable = '';
  loadingStatus = '';
  showSpinner = false;
  foundCenterList = false;
  loadingComplete = false;
  // result: any;
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  privateExport = false;
  disableExport = false;
  etag = '';

  @Output() countApplicationOut: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = [
    'appType', 'appNumber', 'productName', 'sponsorName', 'applicationStatus', 'applicationSubType'];

  constructor(
    private router: Router,
    public authService: AuthService,
    private loadingService: LoadingService,
    public gaService: GoogleAnalyticsService,
    private applicationService: ApplicationService,
    private generalService: GeneralService,
    private dialog: MatDialog
  ) {
    super(gaService, applicationService);
  }

  ngOnInit() {

    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').pipe(take(1)).subscribe(response => {
      this.isAdmin = response;
    });

    if (this.substance && this.substance.uuid) {
      this.generalService.getSubstanceCodesBySubstanceUuid(this.substance.uuid).subscribe(results => {
        if (results) {
          const substanceCodes = results;
          for (let index = 0; index < substanceCodes.length; index++) {
            if (substanceCodes[index].codeSystem) {
                this.bdnum = substanceCodes[index].code;
                break;
            }
          }
        }
      });
    }

    if (this.bdnum) {
      this.getApplicationCenterList();
     // this.getApplicationCenterByBdnum();
      // this.getSubstanceApplications();
      this.applicationListExportUrl();
    }
  }

  searchApplicationBySubstanceKey(): string {
    this.applicationService.searchApplicationBySubstanceKey(this.bdnum).subscribe(results => {
      this.results = results;
      if (results) {
    //    const content = results.content;
        if (this.centerList && this.centerList.length > 0) {
          this.foundCenterList = true;
        }
        this.loadingComplete = true;
      }
    });
    return this.centerList;
  }

  /* PLAY FRAMEWORK */
  /*
  getApplicationCenterByBdnum(): string {
    this.applicationService.getApplicationCenterByBdnum(this.bdnum).subscribe(results => {
      this.centerList = results.centerList;
      if (this.centerList && this.centerList.length > 0) {
        this.foundCenterList = true;
      }
      this.loadingComplete = true;
    });
    return this.centerList;
  }
  */

 getApplicationCenterList(): void {
    this.applicationService.getApplicationCenterList(this.bdnum).subscribe(results => {
      this.centerList = results;
      if (this.centerList && this.centerList.length > 0) {
        this.foundCenterList = true;
      }
      this.loadingComplete = true;
    });
  }

  applicationTabSelected($event) {
    if ($event) {
      const evt: any = $event.tab;
      const textLabel: string = evt.textLabel;
      // Get Center and fromTable/Source from Tab Label
      if (textLabel != null) {
        this.loadingStatus = 'Loading data...';
        const index = textLabel.indexOf(' ');
        this.center = textLabel.slice(0, index);
        this.fromTable = textLabel.slice(index + 1, textLabel.length);

        // set the current result data to empty or null.
        this.paged = [];

        this.getSubstanceApplications();
      }
    }
  }

  getSubstanceApplications(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.showSpinner = true;  // Start progress spinner
    this.applicationService.getSubstanceApplications(this.bdnum, this.center, this.fromTable, this.page, this.pageSize)
      .subscribe(results => {
        this.setResultData(results);
        this.applicationCount = this.totalRecords;
        this.countApplicationOut.emit(this.applicationCount);
        this.loadingStatus = '';
        this.showSpinner = false;  // Stop progress spinner
      });

    /*
        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.clinicaltrials, this.analyticsEventCategory);
        }, error => {
          console.log(error);
        });
        this.countUpdate.emit(clinicaltrials.length);
      });
      */
  }

  export() {
    if (this.etag) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etag, extension);
   //   if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          height: '215x',
          width: '550px',
          data: { 'extension': extension, 'type': 'substanceApplicationImpurties' }
        });
        // this.overlayContainer.style.zIndex = '1002';
        dialogReference.afterClosed().subscribe(name => {
          // this.overlayContainer.style.zIndex = null;
          if (name && name !== '') {
            this.loadingService.setLoading(true);
            const fullname = name + '.' + extension;
            this.authService.startUserDownload(url, this.privateExport, fullname).subscribe(response => {
              this.loadingService.setLoading(false);
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  totalSub: this.applicationCount
                }
              };
              const params = { 'total': this.applicationCount };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
     // }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.applicationService.getApiExportUrl(etag, extension);
  }

  get updateApplicationUrl(): string {
    return this.applicationService.getUpdateApplicationUrl();
  }

  applicationListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.applicationService.getApplicationListExportUrl(this.bdnum);
    }
  }

}
