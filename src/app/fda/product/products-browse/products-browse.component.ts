import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';

import { ProductService } from '../service/product.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { Facet, FacetsManagerService, FacetUpdateEvent } from '@gsrs-core/facets-manager';
import { ConfigService } from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '../../../../app/core/google-analytics/google-analytics.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { DomSanitizer } from '@angular/platform-browser';
import { MatDialog } from '@angular/material';

import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { PageEvent } from '@angular/material';
import { FacetParam } from '@gsrs-core/facets-manager';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';
import { Subscription } from 'rxjs';
import { ProductAll } from '../model/product.model';

@Component({
  selector: 'app-products-browse',
  templateUrl: './products-browse.component.html',
  styleUrls: ['./products-browse.component.scss']
})

export class ProductsBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  private privateSearchTerm?: string;
  public _searchTerm?: string;
  public products: Array<ProductAll>;
  hasBackdrop = false;
  pageIndex: number;
  pageSize: number;
  jumpToValue: string;
  totalProducts: number;
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

  // needed for facets
  private privateFacetParams: FacetParam;
  rawFacets: Array<Facet>;
  private isFacetsParamsInit = false;
  public displayFacets: Array<DisplayFacet> = [];
  private subscriptions: Array<Subscription> = [];

  constructor(
    public productService: ProductService,
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
    private dialog: MatDialog) { }

  ngOnInit() {
    this.facetManagerService.registerGetFacetsHandler(this.productService.getProductFacets);
    this.environment = this.configService.environment;
    this.gaService.sendPageView('Browse Products');
    this.pageSize = 10;
    this.pageIndex = 0;
    this._searchTerm = '';

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['searchTerm'] = this.activatedRoute.snapshot.queryParams['searchTerm'] || '';
    navigationExtras.queryParams['order'] = this.activatedRoute.snapshot.queryParams['order'] || '';
    navigationExtras.queryParams['pageSize'] = this.activatedRoute.snapshot.queryParams['pageSize'] || '10';
    navigationExtras.queryParams['pageIndex'] = this.activatedRoute.snapshot.queryParams['pageIndex'] || '0';
    navigationExtras.queryParams['skip'] = this.activatedRoute.snapshot.queryParams['skip'] || '10';

    const authSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
      }
    });
    this.subscriptions.push(authSubscription);

    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').pipe(take(1)).subscribe(response => {
      this.isAdmin = response;
    });

    this.activatedRoute.queryParamMap.subscribe(params => {

      this.privateSearchTerm = params.get('search') || '';

      if (params.get('pageSize')) {
        this.pageSize = parseInt(params.get('pageSize'), null);
      }
      if (params.get('pageIndex')) {
        this.pageIndex = parseInt(params.get('pageIndex'), null);
      }

      this.isComponentInit = true;
      this.loadComponent();
    });

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
      this.searchProducts();
    }
  }

  searchProducts() {
    this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    const subscription = this.productService.getProducts(
      skip,
      this.pageSize,
      this._searchTerm,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.isError = false;
        this.products = pagingResponse.content;
        this.dataSource = this.products;
        this.totalProducts = pagingResponse.total;
        this.etag = pagingResponse.etag;
        // Set Facets from paging response
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacets = pagingResponse.facets;
        }
        // Separate Application Type and Application Number in Product Result.
        this.separateAppTypeNumber();

      }, error => {
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
      }, () => {
        subscription.unsubscribe();
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      });
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
      this.searchProducts();
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

    this.gaService.sendEvent('productsContent', eventAction, 'pager', eventValue);

    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.populateUrlQueryParameters();
    this.searchProducts();
  }

  setSearchTermValue() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this._searchTerm = this._searchTerm.trim();
    this.searchProducts();
  }

  populateUrlQueryParameters(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };
    navigationExtras.queryParams['searchTerm'] = this.privateSearchTerm;
    navigationExtras.queryParams['pageSize'] = this.pageSize;
    navigationExtras.queryParams['pageIndex'] = this.pageIndex;
    navigationExtras.queryParams['skip'] = this.pageIndex * this.pageSize;

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
          data: { 'extension': extension, 'type': 'BrowseProducts' }
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
                  totalSub: this.totalProducts
                }
              };
              const params = { 'total': this.totalProducts };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.productService.getApiExportUrl(etag, extension);
  }

  separateAppTypeNumber(): void {
    if (this.products) {
      this.products.forEach((element, index) => {
        if (element.appTypeNumber) {
          let apt = '';
          let apn = '';
          let done = false;
          for (const char of element.appTypeNumber) {
            // Application Number
            if (char) {
              if (this.isNumber(char) === true) {
                done = true;
                apn = apn + char;
                element.appNumber = apn;
              } else {
                if (done === false) {
                  // Application Type
                  apt = apt + char;
                  element.appType = apt;
                }
              }
            }
          }
        }
      });
    }
  }

  isNumber(str: any): boolean {
    if (str) {
      const num = Number(str);
      const nan = isNaN(num);
      return !nan;
    }
    return false;
  }

}
