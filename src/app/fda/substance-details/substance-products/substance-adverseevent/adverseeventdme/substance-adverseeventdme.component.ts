import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverse-event/service/adverseevent.service';
import { SubstanceDetailsBaseTableDisplay } from '../../../substance-products/substance-details-base-table-display';
import { PageEvent } from '@angular/material/paginator';
import { FacetParam } from '@gsrs-core/facets-manager';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { Subscription } from 'rxjs';
import { adverseEventDmeSearchSortValues } from '../../../../adverse-event/adverse-events-dme-browse/adverse-events-dme-search-sort-values';

@Component({
  selector: 'app-substance-adverseeventdme',
  templateUrl: './substance-adverseeventdme.component.html',
  styleUrls: ['./substance-adverseeventdme.component.scss']
})

export class SubstanceAdverseEventDmeComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  @Input() bdnum: string;
  @Output() countAdvDmeOut: EventEmitter<number> = new EventEmitter<number>();

  adverseEventCount = 0;
  order = '$root_dmeCount';
  ascDescDir = 'desc';
  showSpinner = false;
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  privateExport = false;
  disableExport = false;
  etag = '';
  loadingStatus = '';
  public sortValues = adverseEventDmeSearchSortValues;
  private subscriptions: Array<Subscription> = [];

  displayedColumns: string[] = [
    'dmeReactions', 'ptTermMeddra', 'caseCount', 'dmeCount', 'dmeCountPercent', 'weightedAvgPrr'
  ];

  constructor(
    private router: Router,
    public gaService: GoogleAnalyticsService,
    private adverseEventService: AdverseEventService,
    private authService: AuthService,
    private loadingService: LoadingService,
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
      this.getAdverseEventDme();
      // this.getSubstanceAdverseEventDme();
      this.adverseEventDmeListExportUrl();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getAdverseEventDme(pageEvent?: PageEvent) {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    const skip = this.page * this.pageSize;
    const privateSearch = 'root_substanceKey:' + this.bdnum;
    const subscription = this.adverseEventService.getAdverseEventDme(
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
        this.countAdvDmeOut.emit(this.adverseEventCount);
      }, error => {
        console.log('error');
      }, () => {
        subscription.unsubscribe();
      });
    this.loadingStatus = '';
    this.showSpinner = false;  // Stop progress spinner
  }

  /*
  getSubstanceAdverseEventDme(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.showSpinner = true;  // Start progress spinner
    this.adverseEventService.getSubstanceAdverseEventDme(this.bdnum, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.advDmeCount = this.totalRecords;
      this.countAdvDmeOut.emit(this.advDmeCount);
      this.showSpinner = false;  // Stop progress spinner
    });
  }
  */

  sortData(sort: Sort) {
    if (sort.active) {
      const orderIndex = this.displayedColumns.indexOf(sort.active).toString();
      this.ascDescDir = sort.direction;
      this.sortValues.forEach(sortValue => {
        if (sortValue.displayedColumns && sortValue.direction) {
          if (this.displayedColumns[orderIndex] === sortValue.displayedColumns && this.ascDescDir === sortValue.direction) {
            this.order = sortValue.value;
          }
        }
      });
      this.getAdverseEventDme();
    }
    return;
  }

  export() {
    if (this.etag) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etag, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
        //  height: '215x',
          width: '700px',
          data: { 'extension': extension, 'type': 'substanceAdverseEventDme', 'hideOptionButtons': true }
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
    return this.adverseEventService.getApiExportUrlDme(etag, extension);
  }

  adverseEventDmeListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.adverseEventService.getAdverseEventDmeListExportUrl(this.bdnum);
    }
  }

}
