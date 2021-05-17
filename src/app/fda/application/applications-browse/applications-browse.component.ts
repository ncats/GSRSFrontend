import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApplicationService } from '../service/application.service';
import { Application } from '../model/application.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
import { MatDialog } from '@angular/material';
import * as _ from 'lodash';
import { Facet, FacetsManagerService, FacetUpdateEvent } from '@gsrs-core/facets-manager';
import { LoadingService } from '@gsrs-core/loading';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { PageEvent } from '@angular/material';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { Location, LocationStrategy } from '@angular/common';
import { GoogleAnalyticsService } from '../../../../app/core/google-analytics/google-analytics.service';
import { FacetParam } from '@gsrs-core/facets-manager';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';
import { Subscription } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-applications-browse',
  templateUrl: './applications-browse.component.html',
  styleUrls: ['./applications-browse.component.scss']
})
export class ApplicationsBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  public privateSearchTerm?: string;
  public applications: Array<Application>;
  order: string;
  pageIndex: number;
  pageSize: number;
  jumpToValue: string;
  totalApplications: number;
  isLoading = true;
  isError = false;
  isAdmin: boolean;
  isLoggedIn = false;
  displayedColumns: string[];
  dataSource = [];
  hasBackdrop = false;
  appType: string;
  appNumber: string;
  clinicalTrialApplication: Array<any>;
  exportUrl: string;
  private isComponentInit = false;
  privateExport = false;
  disableExport = false;
  private overlayContainer: HTMLElement;
  etag = '';
  environment: any;
  previousState: Array<string> = [];
  private searchTermHash: number;
  lastPage: number;
  invalidPage = false;

  // needed for facets
  private privateFacetParams: FacetParam;
  rawFacets: Array<Facet>;
  private isFacetsParamsInit = false;
  public displayFacets: Array<DisplayFacet> = [];
  private subscriptions: Array<Subscription> = [];

  constructor(
    public applicationService: ApplicationService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private router: Router,
    private sanitizer: DomSanitizer,
    public gaService: GoogleAnalyticsService,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    private authService: AuthService,
    private overlayContainerService: OverlayContainer,
    private facetManagerService: FacetsManagerService,
    private dialog: MatDialog,
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
    this.facetManagerService.registerGetFacetsHandler(this.applicationService.getApplicationFacets);
    this.gaService.sendPageView('Browse Applications');

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

    // TESTING TESTING
    this.isLoggedIn = true;
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
      this.searchApplications();
    }
  }

  searchApplications() {
    this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    const subscription = this.applicationService.getApplications(
      skip,
      this.pageSize,
      this.privateSearchTerm,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.isError = false;

        this.applications = pagingResponse.content;
        // didn't work unless I did it like this instead of
        // below export statement
        this.dataSource = this.applications;
        this.totalApplications = pagingResponse.total;
        this.etag = pagingResponse.etag;

        if (pagingResponse.total % this.pageSize === 0) {
          this.lastPage = (pagingResponse.total / this.pageSize);
        } else {
          this.lastPage = Math.floor(pagingResponse.total / this.pageSize + 1);
        }        
        // Export Application Url
        /*
        this.exportUrl = this.applicationService.exportBrowseApplicationsUrl(
          skip,
          this.pageSize,
          this.privateSearchTerm,
          this.privateFacetParams);
        */
       // this.getSubstanceDetailsByBdnum();
       // this.applicationService.getClinicalTrialApplication(this.applications);
       if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacets = pagingResponse.facets;
        }
      }, error => {
        console.log('error');
        const notification: AppNotification = {
          message: 'There was an error trying to retrieve Applicationss. Please refresh and try again.',
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
    this.searchApplications();
  }

  clearSearch(): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;
    this.gaService.sendEvent('applicationFiltering', 'icon-button:clear-search', eventLabel);

    this.privateSearchTerm = '';
    this.pageIndex = 0;
    this.pageSize = 10;

    this.populateUrlQueryParameters();
    this.searchApplications();
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

  // get facetParams(): FacetParam | { showAllMatchOption?: boolean } {
  //   return this.privateFacetParams;
  // }

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

    this.gaService.sendEvent('applicationsContent', eventAction, 'pager', eventValue);

    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.populateUrlQueryParameters();
    this.searchApplications();
  }

  customPage(event: any): void {
    if (this.validatePageInput(event)) {
      this.invalidPage = false;
      const newpage = Number(event.target.value) - 1;
      this.pageIndex = newpage;
      this.gaService.sendEvent('substancesContent', 'select:page-number', 'pager', newpage);
      this.populateUrlQueryParameters();
      this.searchApplications();
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

  // for facets
  facetsParamsUpdated(facetsUpdateEvent: FacetUpdateEvent): void {
    this.pageIndex = 0;
    this.privateFacetParams = facetsUpdateEvent.facetParam;
    this.displayFacets = facetsUpdateEvent.displayFacets;
    if (!this.isFacetsParamsInit) {
      this.isFacetsParamsInit = true;
      this.loadComponent();
    } else {
      this.searchApplications();
    }
  }

  // for facets
  facetsLoaded(numFacetsLoaded: number) {
  }

  editAdvancedSearch(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'Browse Application search term' :
      `${this.privateSearchTerm}`;
    this.gaService.sendEvent('Application Filtering', 'icon-button:edit-advanced-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {
      //  'g-search-hash': this.searchTermHash
      }
    };

    this.router.navigate(['/advanced-search'], navigationExtras);
  }

  getSubstanceDetailsByBdnum(): void {
    // let bdnumName: any;
    // let relationship: any;
    // let substanceId: string;

    this.applications.forEach((element, index) => {

      element.applicationProductList.forEach((elementProd, indexProd) => {

        // Sort Product Name by create date descending
        elementProd.applicationProductNameList.sort((a, b) => {
          return <any>new Date(b.createDate) - <any>new Date(a.createDate);
        });

        elementProd.applicationIngredientList.forEach((elementIngred, indexIngred) => {

          // Get Substance Details such as Name, Substance Id, unii
          if (elementIngred.bdnum != null) {

            /*
            this.applicationService.getSubstanceDetailsByAnyId(elementIngred.bdnum).subscribe(response => {
              if (response) {

              }
              bdnumName = response;
              if (bdnumName != null) {
                if (bdnumName.name != null) {
                  elementIngred.ingredientName = bdnumName.name;

                  if (bdnumName.substanceId != null) {
                    substanceId = bdnumName.substanceId;
                    elementIngred.substanceId = substanceId;

                    // Get Active Moiety - Relationship
                    this.applicationService.getSubstanceRelationship(substanceId).subscribe(responseRel => {
                      relationship = responseRel;
                      relationship.forEach((elementRel, indexRel) => {
                        if (elementRel.relationshipName != null) {
                          elementIngred.activeMoietyName = elementRel.relationshipName;
                          elementIngred.activeMoietyUnii = elementRel.relationshipUnii;
                        }
                      });

                    });

                  }
                }
              }
            });
            */

          }
        });

      });

    });

  }

  export() {
    if (this.etag) {
      const extension = 'xlsx';
      const url = this.getApiExportUrl(this.etag, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          height: '215x',
          width: '550px',
          data: { 'extension': extension, 'type': 'BrowseApplications' }
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
                  totalSub: this.totalApplications
                }
              };
              const params = { 'total': this.totalApplications };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.applicationService.getApiExportUrl(etag, extension);
  }

  get updateApplicationUrl(): string {
    return this.applicationService.getUpdateApplicationUrl();
  }

  // appType: string, appNumber: string
  /*
  getClinicalTrialApplication() {
    let clinicalTrial: Array<any> = [];
    let app: any;

    console.log('clinical');
    this.applications.forEach((element, index) => {
      //app = element;
      this.applicationService.getClinicalTrialApplication(element.appType, element.appNumber).subscribe(response => {
        clinicalTrial = response;
        //element.clinicalTrialList = response;

        clinicalTrial.forEach(element1 => {
          if (element1.nctn != null) {
            element.clinicalTrialList[0].nctNumber = element1.nctn;
          }
          console.log("NCT length: " + clinicalTrial.length);
        });
        });
      });
    }
*/
}
