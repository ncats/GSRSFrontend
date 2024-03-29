import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { TitleCasePipe } from '@angular/common';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverse-event/service/adverseevent.service';
import { SubstanceDetailsBaseTableDisplay } from '../../../substance-products/substance-details-base-table-display';
import { Sort } from '@angular/material/sort';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { ConfigService } from '@gsrs-core/config';
import { FacetParam } from '@gsrs-core/facets-manager';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { AuthService } from '@gsrs-core/auth';
import { Subscription } from 'rxjs';
import { adverseEventPtSearchSortValues } from '../../../../adverse-event/adverse-events-pt-browse/adverse-events-pt-search-sort-values';

@Component({
  selector: 'app-substance-adverseeventpt',
  templateUrl: './substance-adverseeventpt.component.html',
  styleUrls: ['./substance-adverseeventpt.component.scss']
})

export class SubstanceAdverseEventPtComponent extends SubstanceDetailsBaseTableDisplay implements OnInit, OnDestroy {
  @Input() bdnum: string;
  @Input() substanceName: string;
  @Output() countAdvPtOut: EventEmitter<number> = new EventEmitter<number>();

  adverseEventCount = 0;
  order = '$root_ptCount';
  ascDescDir = 'desc';
  showSpinner = false;
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  public sortValues = adverseEventPtSearchSortValues;
  privateExport = false;
  disableExport = false;
  etag = '';
  loadingStatus = '';
  private subscriptions: Array<Subscription> = [];

  adverseEventShinySubstanceNameDisplay = false;
  adverseEventShinyAdverseEventDisplay = false;
  adverseEventShinySubstanceNameURL: string;
  adverseEventShinyAdverseEventURL: string;
  adverseEventShinySubstanceNameURLWithParam: string;
  adverseEventShinyAdverseEventURLWithParam: string;

  // FAERS DASHBOARD
  FAERSDashboardAdverseEventUrl: string;
  FAERSDashboardSubstanceName: string;
  FAERSDashboardSearchTerm = "/select/Search%20Term/"; // FAERS Adverse Event 'Substance Name'
  FAERSDashboardReactionTerm = "/select/Reaction%20Term/"; // GSRS Adverse Event 'PT Term'
  FAERSDashboardReactionGroup = "/select/Reaction%20Group/"; // GSRS Adverse Event 'Prim SOC'

  filtered: Array<any>;
  displayedColumns: string[] = [
    'ptTerm',
    'primSoc',
    'caseCount',
    'ptCount',
    'prr'
  ];
  constructor(
    private router: Router,
    public gaService: GoogleAnalyticsService,
    private adverseEventService: AdverseEventService,
    private loadingService: LoadingService,
    private configService: ConfigService,
    private authService: AuthService,
    private dialog: MatDialog
  ) {
    super(gaService, adverseEventService);
  }

  ngOnInit() {
    const rolesSubscription = this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
      this.isAdmin = response;
    });
    this.subscriptions.push(rolesSubscription);

    if (this.bdnum) {
      this.getAdverseEventPt();

      // FAERS DASHBOARD
      this.getFaersDashboardUrl();
      this.getFaersDashboardRecordByName();

      this.adverseEventPtListExportUrl();
      this.getAdverseEventShinyConfig();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getAdverseEventPt(pageEvent?: PageEvent) {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    const skip = this.page * this.pageSize;
    const privateSearch = 'root_substanceKey:' + this.bdnum;
    const subscription = this.adverseEventService.getAdverseEventPt(
      this.order,
      skip,
      this.pageSize,
      privateSearch,
      this.privateFacetParams
    )
      .subscribe(pagingResponse => {
        this.adverseEventService.totalRecords = pagingResponse.total;
        this.adverseEventCount = pagingResponse.total;
        this.setResultData(pagingResponse.content);
        this.etag = pagingResponse.etag;
        this.countAdvPtOut.emit(this.adverseEventCount);
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
  getSubstanceAdverseEventPt(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    this.adverseEventService.getSubstanceAdverseEventPtAdv(this.bdnum, this.page, this.pageSize,
      this.orderBy, this.ascDescDir).subscribe(results => {
        this.setResultData(results);
        this.advPtCount = this.totalRecords;
        this.countAdvPtOut.emit(this.advPtCount);
        this.showSpinner = false;  // Stop progress spinner
      });
  }
  */

  adverseEventPtListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.adverseEventService.getAdverseEventPtListExportUrl(this.bdnum);
    }
  }

  sortData(sort: Sort) {
    if (sort.active) {
      const orderIndex = this.displayedColumns.indexOf(sort.active).toString(); // + 2; // Adding 2, for name and bdnum.
      this.ascDescDir = sort.direction;
      this.sortValues.forEach(sortValue => {
        if (sortValue.displayedColumns && sortValue.direction) {
          if (this.displayedColumns[orderIndex] === sortValue.displayedColumns && this.ascDescDir === sortValue.direction) {
            this.order = sortValue.value;
          }
        }
      });
      this.getAdverseEventPt();
    }
    return;
  }

  export() {
    if (this.etag) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etag, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
         // height: '215x',
          width: '700px',
          data: { 'extension': extension, 'type': 'substanceAdverseEventPt', 'entity': 'adverseeventpt', 'hideOptionButtons': true }
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
                  totalSub: this.adverseEventCount
                }
              };
              const params = { 'total': this.adverseEventCount };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.adverseEventService.getApiExportUrlPt(etag, extension);
  }

  getFaersDashboardRecordByName(): void {
    // Get FAERS Name from database table that contains 'P' and 'G' in name.
    // Example: Acetazolamide (G) instead of GSRS name Acetazolamide
    const faersNameSubscription = this.adverseEventService.getFaersDashboardRecordByName(this.substanceName).subscribe(results => {
      if (results) {
        if (results.name) {
          this.FAERSDashboardSubstanceName = results.name;
          this.FAERSDashboardAdverseEventUrl = this.FAERSDashboardAdverseEventUrl + results.name + this.FAERSDashboardReactionTerm;
        }
      }
    });
    this.subscriptions.push(faersNameSubscription);
  }

  getFaersDashboardUrl(): void {
    if (this.configService.configData) {
      if (this.configService.configData.FAERSDashboardAdverseEventUrl
        && this.configService.configData.FAERSDashboardAdverseEventUrl !== null) {
        const faersUrlConfig = this.configService.configData.FAERSDashboardAdverseEventUrl;

        // FULL FAERS DASHBOARD URL
        // faersUrl + /select/Search%20Term/ + FaersName + /select/Reaction%20Term/ + ptTerm + /select/Reaction%20Group/ + primSoc;
        this.FAERSDashboardAdverseEventUrl = faersUrlConfig + this.FAERSDashboardSearchTerm;
      }
    }
  }

  getAdverseEventShinyConfig(): void {
    if (this.configService.configData) {

      // Analysis by Substance in Shiny Config
      if (this.configService.configData.adverseEventShinySubstanceNameDisplay
        && this.configService.configData.adverseEventShinySubstanceNameDisplay !== null) {
        this.adverseEventShinySubstanceNameDisplay = JSON.parse(this.configService.configData.adverseEventShinySubstanceNameDisplay);
      }
      if (this.configService.configData.adverseEventShinySubstanceNameURL
        && this.configService.configData.adverseEventShinySubstanceNameURL !== null) {
        this.adverseEventShinySubstanceNameURL = this.configService.configData.adverseEventShinySubstanceNameURL;
        this.adverseEventShinySubstanceNameURLWithParam = this.adverseEventShinySubstanceNameURL + decodeURIComponent(this.substanceName);
      }

      // Analysis by Adverse Event in Shiny Config
      if (this.configService.configData.adverseEventShinyAdverseEventDisplay
        && this.configService.configData.adverseEventShinyAdverseEventDisplay !== null) {
        this.adverseEventShinyAdverseEventDisplay = JSON.parse(this.configService.configData.adverseEventShinyAdverseEventDisplay);
      }
      if (this.configService.configData.adverseEventShinyAdverseEventURL
        && this.configService.configData.adverseEventShinyAdverseEventURL !== null) {
        this.adverseEventShinyAdverseEventURL = this.configService.configData.adverseEventShinyAdverseEventURL;
        this.adverseEventShinyAdverseEventURLWithParam = this.adverseEventShinyAdverseEventURL;
      }

    }
  }

  getDecodeURL(value: string): string {
    let result = '';
    if (value !== null) {
      result = decodeURIComponent(value);
    }
    return result;
  }

}

