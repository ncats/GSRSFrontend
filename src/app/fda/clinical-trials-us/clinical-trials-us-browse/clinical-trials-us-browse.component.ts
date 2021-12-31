import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PageEvent } from '@angular/material';
import { MatDialog } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { Location, LocationStrategy } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { FacetParam } from '@gsrs-core/facets-manager';
import { Facet, FacetsManagerService, FacetUpdateEvent } from '@gsrs-core/facets-manager';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { ClinicalTrialUS } from '../model/clinical-trial-us.model';
import { clinicalTrialUSSearchSortValues } from './clinical-trial-us-search-sort-values';
import { environment } from '../../../../environments/environment';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ConfigService } from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '../../../../app/core/google-analytics/google-analytics.service';
import { ClinicalTrialUSService } from '../service/clinical-trial-us.service';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { GeneralService } from '../../service/general.service';
import { Title} from '@angular/platform-browser';

@Component({
  selector: 'app-clinical-trials-us-browse',
  templateUrl: './clinical-trials-us-browse.component.html',
  styleUrls: ['./clinical-trials-us-browse.component.scss']
})

export class ClinicalTrialsUSBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  loadash = _;
  public privateSearchTerm?: string;
  public _searchTerm?: string;
  // was All __check_here__
  public clinicalTrialsUS: Array<ClinicalTrialUS>;
  order: string;
  public sortValues = clinicalTrialUSSearchSortValues;
  hasBackdrop = false;
  pageIndex: number;
  pageSize: number;
  jumpToValue: string;
  totalClinicalTrialsUS: number;
  isLoading = true;
  isError = false;
  displayedColumns: string[];
  dataSource = [];
  appType: string;
  appNumber: string;
  clinicalTrialApplication: Array<any>;
  exportUrl: string;
  private isComponentInit = false;
  privateExport = false;
  disableExport = false;
  private overlayContainer: HTMLElement;
  isLoggedIn = false;
  isAdmin = false;
  etag = '';
  environment: any;
  previousState: Array<string> = [];
  private searchTermHash: number;
  isSearchEditable = false;
  lastPage: number;
  invalidPage = false;
  substanceDetails = {};

  // needed for facets
  private privateFacetParams: FacetParam;
  rawFacets: Array<Facet>;
  private isFacetsParamsInit = false;
  public displayFacets: Array<DisplayFacet> = [];
  private subscriptions: Array<Subscription> = [];

  constructor(
    public clinicalTrialUSService: ClinicalTrialUSService,
    public generalService: GeneralService,
    private authService: AuthService,
    private facetManagerService: FacetsManagerService,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
    private dialog: MatDialog,
    private titleService: Title
    ) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    setTimeout(() => {
      if (this.router.url === this.previousState[0]) {
        this.ngOnInit();
      }

    }, 50);
  }

  ngOnInit() {
    this.titleService.setTitle(`Browse US Clinical Trials / GSRS`);
    this.facetManagerService.registerGetFacetsHandler(this.clinicalTrialUSService.getClinicalTrialUSFacets);
    this.gaService.sendPageView('Browse US Clinical Trials');

    this.pageSize = 10;
    this.pageIndex = 0;

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    /*
    navigationExtras.queryParams['searchTerm'] = this.activatedRoute.snapshot.queryParams['searchTerm'] || '';
    navigationExtras.queryParams['order'] = this.activatedRoute.snapshot.queryParams['order'] || '';
    navigationExtras.queryParams['pageSize'] = this.activatedRoute.snapshot.queryParams['pageSize'] || '10';
    navigationExtras.queryParams['pageIndex'] = this.activatedRoute.snapshot.queryParams['pageIndex'] || '0';
    navigationExtras.queryParams['skip'] = this.activatedRoute.snapshot.queryParams['skip'] || '10';
    */

    this.privateSearchTerm = this.activatedRoute.snapshot.queryParams['search'] || '';

    if (this.privateSearchTerm) {
      this.searchTermHash = this.utilsService.hashCode(this.privateSearchTerm);
      this.isSearchEditable = localStorage.getItem(this.searchTermHash.toString()) != null;
    }

    this.order = this.activatedRoute.snapshot.queryParams['order'] || '';
    this.pageSize = parseInt(this.activatedRoute.snapshot.queryParams['pageSize'], null) || 10;
    this.pageIndex = parseInt(this.activatedRoute.snapshot.queryParams['pageIndex'], null) || 0;

    const authSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
      }
      this.isAdmin = this.authService.hasAnyRoles('Admin', 'Updater', 'SuperUpdater');
    });
    this.subscriptions.push(authSubscription);

    this.isComponentInit = true;
    this.loadComponent();

  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this.facetManagerService.unregisterFacetSearchHandler();
  }

  private loadComponent(): void {
    if (this.isFacetsParamsInit && this.isComponentInit) {
      this.searchClinicalTrialsUS();
    }
  }

  searchClinicalTrialsUS() {
    this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    const subscription = this.clinicalTrialUSService.getClinicalTrialsUS(
      this.order,
      skip,
      this.pageSize,
      this.privateSearchTerm,
      this.privateFacetParams
    )
      .subscribe(pagingResponse => {
        this.isError = false;
        this.clinicalTrialsUS = pagingResponse.content;
        this.dataSource = this.clinicalTrialsUS;
        this.totalClinicalTrialsUS = pagingResponse.total;
        this.etag = pagingResponse.etag;

        if (pagingResponse.total % this.pageSize === 0) {
          this.lastPage = (pagingResponse.total / this.pageSize);
        } else {
          this.lastPage = Math.floor(pagingResponse.total / this.pageSize + 1);
        }
        console.log('this.order');
        console.log(this.order);
        /*
        __alex__ Not sure why I did this
        this.clinicalTrialsUS.forEach(trial => {
          trial.clinicalTrialUSDrug.forEach(substance => {
            const sd = {};
            const o = this.generalService.getSubstanceByAnyId(substance.substanceKey);
            o.subscribe(s => {
                if (s != null) {
                  sd['substanceKey'] = s.uuid;
                  sd['substanceKeyType'] = 'UUID';
                  sd['substanceName'] = s._name;
                  this.substanceDetails[substance.substanceKey] = sd;
                }
            });
          });
        });
        */
        // Set Facets from paging response
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacets = pagingResponse.facets;
        }
      }, error => {
        const notification: AppNotification = {
          message: 'There was an error trying to retrieve US Clinical Trials. Please refresh and try again.',
          type: NotificationType.error,
          milisecondsToShow: 6000
        };
        this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
      }, () => {
        subscription.unsubscribe();
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      });
  }

  setSearchTermValue() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.searchClinicalTrialsUS();
  }

  resetSearch() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.privateSearchTerm = '';
    this.searchClinicalTrialsUS();
  }

  customPage(event: any): void {
    if (this.validatePageInput(event)) {
      this.invalidPage = false;
      const newpage = Number(event.target.value) - 1;
      this.pageIndex = newpage;
      this.gaService.sendEvent('clinicalTrialsUSContent', 'select:page-number', 'pager', newpage);
      this.populateUrlQueryParameters();
      this.searchClinicalTrialsUS();
    }
  }

  validatePageInput(event: any): boolean {
    if (event && event.target) {
      const newpage = Number(event.target.value);
      if (!isNaN(Number(newpage))) {
        if ((Number.isInteger(newpage)) && (newpage <= this.lastPage) && (newpage > 0)) {
          return true;
        }
      }
    }
    return false;
  }

  editAdvancedSearch(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'Browse Product search term' :
      `${this.privateSearchTerm}`;
    this.gaService.sendEvent('Application Filtering', 'icon-button:edit-advanced-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {
        'g-search-hash': this.searchTermHash
      }
    };

    this.router.navigate(['/advanced-search'], navigationExtras);
  }

  // for facets
  facetsParamsUpdated(facetsUpdateEvent: FacetUpdateEvent): void {
    this.pageIndex = 0;
    this.privateFacetParams = facetsUpdateEvent.facetParam;
    this.displayFacets = facetsUpdateEvent.displayFacets;
    if (!this.isFacetsParamsInit) {
      this.isFacetsParamsInit = true;
      this.loadComponent();
    } else {
      this.searchClinicalTrialsUS();
    }
  }

  // for facets
  facetsLoaded(numFacetsLoaded: number) {
  }

  changePage(pageEvent: PageEvent) {
    let eventAction;
    let eventValue;

    if (this.pageSize !== pageEvent.pageSize) {
      eventAction = 'select:page-size';
      eventValue = pageEvent.pageSize;
    } else if (this.pageIndex !== pageEvent.pageIndex) {
      eventAction = 'icon-button:page-number';
      eventValue = pageEvent.pageIndex + 1;
    }

    this.gaService.sendEvent('clinicalTrialsUSContent', eventAction, 'pager', eventValue);

    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.populateUrlQueryParameters();
    this.searchClinicalTrialsUS();
  }

  clearSearch(): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;
    this.gaService.sendEvent('clinicalTrialUSFiltering', 'icon-button:clear-search', eventLabel);

    this.privateSearchTerm = '';
    this.pageIndex = 0;
    this.pageSize = 10;

    this.populateUrlQueryParameters();
    this.searchClinicalTrialsUS();
  }

  clearFilters(): void {
    // for facets
    this.displayFacets.forEach(displayFacet => {
      displayFacet.removeFacet(displayFacet.type, displayFacet.bool, displayFacet.val);
    });
    this.clearSearch();

    this.facetManagerService.clearSelections();
  }

  populateUrlQueryParameters(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };
    navigationExtras.queryParams['searchTerm'] = this.privateSearchTerm;
    navigationExtras.queryParams['pageSize'] = this.pageSize;
    navigationExtras.queryParams['pageIndex'] = this.pageIndex;
    navigationExtras.queryParams['skip'] = this.pageIndex * this.pageSize;

    this.previousState.push(this.router.url);
    const urlTree = this.router.createUrlTree([], {
      queryParams: navigationExtras.queryParams,
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.location.go(urlTree.toString());
  }

  get searchTerm(): string {
    return this.privateSearchTerm;
  }

  get facetParams(): FacetParam | { showAllMatchOption?: boolean } {
    return this.privateFacetParams;
  }

  export() {
    if (this.etag) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etag, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          height: '215x',
          width: '550px',
          data: { 'extension': extension, 'type': 'BrowseClinicalTrialsUS' }
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
                  totalSub: this.totalClinicalTrialsUS
                }
              };
              const params = { 'total': this.totalClinicalTrialsUS };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.clinicalTrialUSService.getApiExportUrl(etag, extension);
  }

  isNumber(str: any): boolean {
    if (str) {
      const num = Number(str);
      const nan = isNaN(num);
      return !nan;
    }
    return false;
  }

  getSubstanceKeysFromClinicalTrialUSTrial(clinicalTrialUS: ClinicalTrialUS) {
    if (clinicalTrialUS == null) { return null; }
    return _.map(clinicalTrialUS.clinicalTrialUSDrug, 'substanceKey');
  }

}
