import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { take } from 'rxjs/operators';
import { Sort } from '@angular/material/sort';
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
import { applicationSearchSortValues } from '../../../application/applications-browse/application-search-sort-values';

@Component({
  selector: 'app-substance-application',
  templateUrl: './substance-application.component.html',
  styleUrls: ['./substance-application.component.scss']
})

export class SubstanceApplicationComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {
  application: any;
  applicationCount = 0;
  totalApplication = 0;
  centerList: Array<String> = [];
  centerListOriginal: Array<String> = [];
  center = '';
  fromTable = '';
  loadingStatus = '';
  showSpinner = false;
  foundCenterList = false;
  loadingComplete = false;
  // result: any;
  public privateSearch?: string;
  private privateFacetParams: FacetParam;
  privateExport = false;
  disableExport = false;
  etag = '';
  etagAllExport = '';
  @Input() bdnum: string;
  @Output() countApplicationOut: EventEmitter<number> = new EventEmitter<number>();
  public sortValues = applicationSearchSortValues;
  order = '$root_appNumber';
  ascDescDir = 'desc';
  displayedColumns: string[] = [
    'appType',
    'appNumber',
    'productName',
    'sponsorName',
    'appStatus',
    'applicationSubType'
  ];

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

    if (this.bdnum) {
      this.getApplicationCenterList();

      this.privateSearch = 'root_applicationProductList_applicationIngredientList_substanceKey:'
        + this.bdnum;
      this.getApplicationBySubstanceKeyCenter(null, 'initial');
    }
  }

  getApplicationCenterList(): void {
    this.applicationService.getApplicationCenterList(this.bdnum).subscribe(results => {
      this.centerListOriginal = results;
      this.centerList = results;
      if (this.centerList && this.centerList.length > 0) {
        this.foundCenterList = true;

        // Replace 'Darrts' to 'Integrity' and 'SRS' to 'GSRS'
        /* this.centerList.forEach((cent, index) => {
          if (cent != null) {
            let centerReplace = '';
            if (cent.indexOf('Darrts') > 0) {
              centerReplace = cent.replace('Darrts', 'Integrity');
            } else if (cent.indexOf('SRS') > 0) {
              centerReplace = cent.replace('SRS', 'GSRS');
            }

            if (centerReplace.length > 0) {
              this.centerList[index] = centerReplace;
            }
          }
        }); */
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

        //let fromReplace = '';
        /*
        if (this.fromTable.indexOf('Integrity') >= 0) {
          fromReplace = this.fromTable.replace('Integrity', 'Darrts');
        } else if (this.fromTable.indexOf('GSRS') >= 0) {
          fromReplace = this.fromTable.replace('GSRS', 'SRS');
        }
        if (fromReplace && fromReplace.length > 0) {
          this.fromTable = fromReplace;
        }
        */
      }

      // set the current result data to empty or null.
      this.paged = [];

      this.privateSearch = 'root_applicationProductList_applicationIngredientList_substanceKey:'
        + this.bdnum + ' AND root_center:' + this.center + ' AND root_fromTable: ' + this.fromTable;

      this.getApplicationBySubstanceKeyCenter();
    }
  }

  // GSRS 3.0
  getApplicationBySubstanceKeyCenter(pageEvent?: PageEvent, searchType?: string) {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    const skip = this.page * this.pageSize;

    // if (searchType && searchType === 'initial') {
    //    this.pageSize = 100;
    //  }
    const subscription = this.applicationService.getApplicationAll(
      this.order,
      skip,
      this.pageSize,
      this.privateSearch,
      this.privateFacetParams
    )
      .subscribe(pagingResponse => {
        if (searchType && searchType === 'initial') {
          this.etagAllExport = pagingResponse.etag;
        } else {
          this.applicationService.totalRecords = pagingResponse.total;
          this.applicationCount = pagingResponse.total;

          this.setResultData(pagingResponse.content);

          this.etag = pagingResponse.etag;
          this.countApplicationOut.emit(this.applicationCount);
        }
      }, error => {
        this.showSpinner = false;  // Stop progress spinner
        console.log('error');
      }, () => {
        this.showSpinner = false;  // Stop progress spinner
        subscription.unsubscribe();
      });
    this.loadingStatus = '';
    // this.showSpinner = false;  // Stop progress spinner
  }

  /*
  getSubstanceApplications(pageEvent ?: PageEvent): void {
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
  */
  /*
      this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.clinicaltrials, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.countUpdate.emit(clinicaltrials.length);
    });

}
*/

  export() {
    if (this.etagAllExport) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etagAllExport, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          // height: '215x',
          width: '700px',
          data: { 'extension': extension, 'type': 'substanceApplication', 'entity': 'applications', 'hideOptionButtons': true }
        });
        // this.overlayContainer.style.zIndex = '1002';
        dialogReference.afterClosed().subscribe(response => {
          // this.overlayContainer.style.zIndex = null;
          const name = response.name;
          const id = response.id;
          if (name && name !== '') {
            this.loadingService.setLoading(true);
            const fullname = name + '.' + extension;
            this.authService.startUserDownload(url, this.privateExport, fullname, id).subscribe(response => {
              // this.authService.startUserDownload(url, this.privateExport, fullname).subscribe(response => {
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
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.applicationService.getAppAllApiExportUrl(etag, extension);
  }

  get updateApplicationUrl(): string {
    return this.applicationService.getUpdateApplicationUrl();
  }

  applicationListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.applicationService.getApplicationListExportUrl(this.bdnum);
    }
  }

  sortData(sort: Sort) {
    if (sort.active) {
      const orderIndex = this.displayedColumns.indexOf(sort.active).toString(); // + 2; // Adding 2, for name and bdnum.
      this.ascDescDir = sort.direction;
      // Get Sort Values from applicationSearchSortValues
      this.sortValues.forEach(sortValue => {
        if (sortValue.displayedColumns && sortValue.direction) {
          if (this.displayedColumns[orderIndex] === sortValue.displayedColumns && this.ascDescDir === sortValue.direction) {
            this.order = sortValue.value;
          }
        }
      });
      this.getApplicationBySubstanceKeyCenter();
    }
    return;
  }
}
