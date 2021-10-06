import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { AuthService } from '@gsrs-core/auth';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ImpuritiesService } from '../../../impurities/service/impurities.service';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { SubstanceDetailsBaseTableDisplay } from '../substance-details-base-table-display';
import { Impurities, ImpuritiesTesting, ImpuritiesDetails, IdentityCriteria } from '../../../impurities/model/impurities.model';
import { Facet } from '@gsrs-core/facets-manager';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';

@Component({
  selector: 'app-substance-impurities',
  templateUrl: './substance-impurities.component.html',
  styleUrls: ['./substance-impurities.component.scss']
})
export class SubstanceImpuritiesComponent extends SubstanceDetailsBaseTableDisplay implements OnInit, OnDestroy {

  @Input() substanceUuid: string;
  @Output() countImpuritiesOut: EventEmitter<number> = new EventEmitter<number>();
  private subscriptions: Array<Subscription> = [];
  showSpinner = false;
  impurities: any;
  totalImpurities = 0;
  impuritiesCount = 0;
  impuritiesTestTotal = 0;
  pageIndex = 0;
  pageSize = 5;
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  privateExport = false;
  disableExport = false;
  etag = '';
  displayedColumns: string[] = [
    'details',
    'sourceType',
    'source',
    'sourceid',
    'type',
    'specType'
  ];

  constructor(
    private router: Router,
    public gaService: GoogleAnalyticsService,
    private impuritiesService: ImpuritiesService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private dialog: MatDialog
  ) {
    super(gaService, impuritiesService);
  }

  ngOnInit() {
    const rolesSubscription = this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
      this.isAdmin = response;
    });
    this.subscriptions.push(rolesSubscription);

    if (this.substanceUuid) {
      this.getImpuritiesBySubstanceUuid();
      this.impuritiesListExportUrl();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  /*
  getSubstanceImpuritiesNEW(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.showSpinner = true;  // Start progress spinner
    this.impuritiesService.searchImpurities(this.substanceUuid, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.impurities = results;
      this.getImpuritiesTestTotal();
      this.impuritiesCount = this.totalRecords;
      this.countImpuritiesOut.emit(this.impuritiesCount);
      this.showSpinner = false;  // Stop progress spinner
    });
  }
  */

  searchImpurities() {
    this.privateSearchTerm = this.substanceUuid;
  //  this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    const subscription = this.impuritiesService.searchImpurities(
      skip,
      this.pageSize,
      this.privateSearchTerm,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
       // this.isError = false;

        this.setResultData(pagingResponse.content);
        this.impurities = pagingResponse.content;
        this.impuritiesCount =  pagingResponse.total;
        this.countImpuritiesOut.emit(this.impuritiesCount);
        this.etag = pagingResponse.etag;

        /*
        if (pagingResponse.total % this.pageSize === 0) {
          this.lastPage = (pagingResponse.total / this.pageSize);
        } else {
          this.lastPage = Math.floor(pagingResponse.total / this.pageSize + 1);
        }
        */
        // Set Facets from paging response
      /*  if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacets = pagingResponse.facets;
        }
        */
      }, error => {
       /*
        console.log('error');
        const notification: AppNotification = {
          message: 'There was an error trying to retrieve Products. Please refresh and try again.',
          type: NotificationType.error,
          milisecondsToShow: 6000
        };
        this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
        */
      }, () => {
        subscription.unsubscribe();
     //   this.isLoading = false;
     //   this.loadingService.setLoading(this.isLoading);
      });
  }

  getImpuritiesBySubstanceUuid(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.showSpinner = true;  // Start progress spinner
    // , this.page, this.pageSize
    this.impuritiesService.getImpuritiesBySubstanceUuid(this.substanceUuid).subscribe(results => {
      this.setResultData(results.content);
      this.impurities = results.content;
      this.totalImpurities = results.total;
      this.etag = results.etag;
      this.countImpuritiesOut.emit(this.totalImpurities);
    });
    this.showSpinner = false;  // Stop progress spinner
  }

  /*
  getSubstanceImpurities(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.showSpinner = true;  // Start progress spinner
    this.impuritiesService.getSubstanceImpurities(this.substanceUuid, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.impurities = results;
      this.impuritiesCount = this.totalRecords;
      this.impuritiesService.totalRecords = this.totalRecords;
      this.countImpuritiesOut.emit(this.impuritiesCount);
      this.showSpinner = false;  // Stop progress spinner
    });
  }
  */

  export() {
    if (this.etag) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etag, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          height: '215x',
          width: '550px',
          data: { 'extension': extension, 'type': 'substanceImpurities' }
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
                  totalSub: this.totalImpurities
                }
              };
              const params = { 'total': this.totalImpurities };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.impuritiesService.getApiExportUrl(etag, extension);
  }

  impuritiesListExportUrl() {
    if (this.substanceUuid != null) {
      this.exportUrl = this.impuritiesService.getImpuritiesListExportUrl(this.substanceUuid);
    }
  }

}
