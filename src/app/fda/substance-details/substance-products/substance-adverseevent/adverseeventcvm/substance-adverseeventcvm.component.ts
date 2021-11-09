import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { MatDialog } from '@angular/material';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AdverseEventService } from '../../../../adverse-event/service/adverseevent.service';
import { SubstanceDetailsBaseTableDisplay } from '../../../substance-products/substance-details-base-table-display';
import { PageEvent } from '@angular/material/paginator';
import { FacetParam } from '@gsrs-core/facets-manager';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading/loading.service';

@Component({
  selector: 'app-substance-adverseeventcvm',
  templateUrl: './substance-adverseeventcvm.component.html',
  styleUrls: ['./substance-adverseeventcvm.component.scss']
})

export class SubstanceAdverseEventCvmComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  // advCvmCount = 0;
  adverseEventCount = 0;

  showSpinner = false;
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  privateExport = false;
  disableExport = false;
  etag = '';
  loadingStatus = '';

  @Output() countAdvCvmOut: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = [
    'adverseEvent', 'species', 'adverseEventCount', 'routeOfAdmin'
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
    if (this.bdnum) {
      this.getAdverseEventCvm();
      // this.getSubstanceAdverseEventCvm();
      this.adverseEventCvmListExportUrl();
    }
  }

  getAdverseEventCvm(pageEvent?: PageEvent) {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    const skip = this.page * this.pageSize;
    const privateSearch = 'root_substanceKey:' + this.bdnum;
    const subscription = this.adverseEventService.getAdverseEventCvm(
      'default',
      skip,
      this.pageSize,
      privateSearch,
      this.privateFacetParams
    )
      .subscribe(pagingResponse => {
        this.adverseEventService.totalRecords = pagingResponse.total;
        this.setResultData(pagingResponse.content);
        this.adverseEventCount = pagingResponse.total;
        this.etag = pagingResponse.etag;
        this.countAdvCvmOut.emit(this.adverseEventCount);
      }, error => {
        console.log('error');
      }, () => {
        subscription.unsubscribe();
      });
    this.loadingStatus = '';
    this.showSpinner = false;  // Stop progress spinner
  }

  /*
  getSubstanceAdverseEventCvm(pageEvent?: PageEvent): void {
    this.setPageEvent(pageEvent);

    this.showSpinner = true;  // Start progress spinner
    this.adverseEventService.getSubstanceAdverseEventCvm(this.bdnum, this.page, this.pageSize).subscribe(results => {
      this.setResultData(results);
      this.advCvmCount = this.totalRecords;
      this.countAdvCvmOut.emit(this.advCvmCount);
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
          data: { 'extension': extension, 'type': 'substanceAdverseEventCvm' }
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

  adverseEventCvmListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.adverseEventService.getAdverseEventCvmListExportUrl(this.bdnum);
    }
  }

}

