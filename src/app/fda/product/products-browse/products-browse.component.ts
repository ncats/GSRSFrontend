import { Component, OnInit, AfterViewInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Location, LocationStrategy } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Title } from '@angular/platform-browser';
import { take } from 'rxjs/operators';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatTabChangeEvent } from '@angular/material/tabs';

/* GSRS Core Imports */
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ConfigService } from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '../../../../app/core/google-analytics/google-analytics.service';
import { environment } from '../../../../environments/environment';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { NarrowSearchSuggestion } from '@gsrs-core/utils';
import { Facet, FacetParam, FacetsManagerService, FacetUpdateEvent } from '@gsrs-core/facets-manager';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { StructureImageModalComponent, StructureService } from '@gsrs-core/structure';
import { JsonDialogFdaComponent } from '../../json-dialog-fda/json-dialog-fda.component';

/* GSRS Product Imports */
import { GeneralService } from '../../service/general.service';
import { ProductService } from '../service/product.service';
import { Product, ProductIngredient } from '../model/product.model';
import { productSearchSortValues } from './product-search-sort-values';
import jp from 'jsonpath';

@Component({
  selector: 'app-products-browse',
  templateUrl: './products-browse.component.html',
  styleUrls: ['./products-browse.component.scss']
})

export class ProductsBrowseComponent implements OnInit, AfterViewInit, OnDestroy {

  private ACTIVE_INGREDIENT_UPPERCASE = 'ACTIVE INGREDIENT';
  private ACTIVE_INGREDIENT_LOWERCASE = 'Active Ingredient';

  view = 'cards';
  public privateSearchTerm?: string;
  public _searchTerm?: string;
  public products: Array<Product>;
  order: string;
  public sortValues = productSearchSortValues;
  hasBackdrop = false;
  pageIndex: number;
  pageSize: number;
  jumpToValue: string;
  totalProducts: number;
  isLoading = true;
  isError = false;
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
  narrowSearchSuggestions?: { [matchType: string]: Array<NarrowSearchSuggestion> } = {};
  matchTypes?: Array<string> = [];
  narrowSearchSuggestionsCount = 0;
  previousState: Array<string> = [];
  private searchTermHash: number;
  searchValue: string;
  isSearchEditable = false;
  lastPage: number;
  invalidPage = false;
  iconSrcPath = '';
  dailyMedUrlConfig = '';
  downloadJsonHref: any;
  jsonFileName: string;
  tabSelectedIndex = 0;
  fdim = 10;

  activeIngredients: Array<ProductIngredient> = [];
  otherIngredients: Array<ProductIngredient> = [];

  showMoreLessActiveIngredArray: Array<boolean> = [];
  showMoreLessOtherIngredArray: Array<boolean> = [];

  // Cross Entity Search
  thisEntity: string = "products";
  subEntity = null;
  subEntitySearchTerm = null;
  showCrossEntitySearch = false;
  searchOnIdentifiers = false;
  bulkSearchPanelOpen = false;
  isSearchFinished = false;
  iterations = 0;
  bulkSearchStatusKey: string;
  searchStatusUrl: string;
  subEntitySearchHash: string;
  editSubEntitySearchHash: any;
  bulkSearchQueryId?: string;
  searchEntity?: string;
  idLists: Array<string> = [];
  secondIdLists: Array<string> = [];
  subEntityDisplayFacets: Array<DisplayFacet> = [];

  ascDescDir = 'desc';
  public displayedColumns: string[] = [
    'viewDetails',
    'productCode',
    'productName',
    'ingredientName',
    'labelerName',
    'provenance',
    'country',
    'status',
    'productNameType',
    'applicationNumber'
  ];

  // needed for facets
  private privateFacetParams: FacetParam;
  rawFacets: Array<Facet>;
  isFacetsParamsInit = false;
  exportOptions: Array<any>;
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
    private utilsService: UtilsService,
    private generalService: GeneralService,
    private dialog: MatDialog,
    private titleService: Title) { }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    setTimeout(() => {
      if (this.router.url === this.previousState[0]) {
        this.ngOnInit();
      }
    }, 50);
  }

  ngOnInit() {
    this.facetManagerService.registerGetFacetsHandler(this.productService.getProductFacets);

    // Get Daily Med Url from Configuration
    this.dailyMedUrlConfig = this.generalService.getDailyMedUrlConfig();

    // get config value for 'crossEntitySearch'. if it is true show dropdown 'Show Facet For'
    this.showCrossEntitySearch = this.configService.configData.showCrossEntitySearchDropdown || false;

    this.titleService.setTitle(`Product Browser`);

    this.pageSize = 10;
    this.pageIndex = 0;

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    this.privateSearchTerm = this.activatedRoute.snapshot.queryParams['search'] || '';

    if (this.privateSearchTerm) {
      this.searchTermHash = this.utilsService.hashCode(this.privateSearchTerm);
      this.isSearchEditable = localStorage.getItem(this.searchTermHash.toString()) != null;
    }

    this.order = this.activatedRoute.snapshot.queryParams['order'] || '$root_lastModifiedDate';
    this.pageSize = parseInt(this.activatedRoute.snapshot.queryParams['pageSize'], null) || 10;
    this.pageIndex = parseInt(this.activatedRoute.snapshot.queryParams['pageIndex'], null) || 0;
    this.bulkSearchQueryId = this.activatedRoute.snapshot.queryParams['bulkQID'] || '';
    this.searchEntity = this.activatedRoute.snapshot.queryParams['searchEntity'] || '';

    // For Cross Entity/Sub Entity Search
    this.subEntitySearchHash = this.activatedRoute.snapshot.queryParams['subentity-hash'];

    this.overlayContainer = this.overlayContainerService.getContainerElement();

    const authSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
      }
      this.isAdmin = this.authService.hasAnyRoles('Admin', 'Updater', 'SuperUpdater');
    });
    this.subscriptions.push(authSubscription);

    this.iconSrcPath = `${this.configService.environment.baseHref || ''}assets/icons/fda/icon_dailymed.png`;

    // if cross entity search is performed, show the facets selected for Cross Entity/Sub Entity Search
    if (this.subEntitySearchHash) {
      this.subEntityfacetDisplay();
    }

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
      this.searchProducts();
    }
  }

  searchProducts() {
    this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    this.iterations = 0;

    const subscription = this.productService.getProducts(
      this.order,
      skip,
      this.pageSize,
      this.privateSearchTerm,
      this.privateFacetParams,
      this.fdim,
      this.bulkSearchQueryId,
      this.searchOnIdentifiers
    )
      .subscribe(pagingResponse => {
        this.isError = false;
        this.isError = false;
        // Get Bulk Search Status Key and url. The hostname for bulk search result can be different for non-substance entity
        this.bulkSearchStatusKey = pagingResponse.statusKey;
        this.searchStatusUrl = pagingResponse.searchStatusUrl;

        // if Bulk Search is not finished
        if (pagingResponse.finished) {
          this.isSearchFinished = true;
        }

        // if it is Bulk Search
        if (this.bulkSearchQueryId && this.iterations === 0) {
          this.iterations++;

          this.products = pagingResponse.content;
          this.dataSource = this.products;
        } else {
          this.products = pagingResponse.content;
          this.dataSource = this.products;
        }

        this.totalProducts = pagingResponse.total;
        this.etag = pagingResponse.etag;

        if (pagingResponse.total % this.pageSize === 0) {
          this.lastPage = (pagingResponse.total / this.pageSize);
        } else {
          this.lastPage = Math.floor(pagingResponse.total / this.pageSize + 1);
        }
        // Set Facets from paging response
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacets = pagingResponse.facets;
        }

        // Narrow Suggest Search Begin
        this.narrowSearchSuggestions = {};
        this.matchTypes = [];
        this.narrowSearchSuggestionsCount = 0;
        if (pagingResponse.narrowSearchSuggestions && pagingResponse.narrowSearchSuggestions.length) {
          pagingResponse.narrowSearchSuggestions.forEach(suggestion => {
            if (this.narrowSearchSuggestions[suggestion.matchType] == null) {
              this.narrowSearchSuggestions[suggestion.matchType] = [];
              if (suggestion.matchType === 'WORD') {
                this.matchTypes.unshift(suggestion.matchType);
              } else {
                this.matchTypes.push(suggestion.matchType);
              }
            }
            this.narrowSearchSuggestions[suggestion.matchType].push(suggestion);
            this.narrowSearchSuggestionsCount++;
          });
        }
        this.matchTypes.sort();
        // Narrow Suggest Search End

        // Get Substance Name for each substance Key
        this.getSubstanceBySubstanceKey();

        // Get Daily Med Url if Product Code Type is NDC CODE
        this.getDailyMedUrlforProductCode();

        // Get list of Export extension options such as .xlsx, .txt
        this.productService.getExportOptions(this.etag).subscribe(response => {
          this.exportOptions = response;
        });

        // Stop the spinner
        if (this.bulkSearchQueryId && this.iterations === 1) {
          this.isLoading = false;
          this.loadingService.setLoading(this.isLoading);
        }

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

  setSearchTermValue() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.searchProducts();
  }

  resetSearch() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.privateSearchTerm = '';
    this.bulkSearchQueryId = null;
    this.subEntitySearchHash = '';
    this.isSearchFinished = false;

    this.searchProducts();
  }

  customPage(event: any): void {
    if (this.validatePageInput(event)) {
      this.invalidPage = false;
      const newpage = Number(event.target.value) - 1;
      this.pageIndex = newpage;
      this.gaService.sendEvent('productsContent', 'select:page-number', 'pager', newpage);
      this.populateUrlQueryParameters();
      this.searchProducts();
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
      this.searchProducts();
    }
  }

  // for facets
  facetsLoaded(numFacetsLoaded: number) {
  }

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
      // Search Applications
      this.searchProducts();
    }
    return;
  }

  updateView(event): void {
    this.view = event.value;
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

  clearFilters(): void {
    // for facets
    this.displayFacets.forEach(displayFacet => {
      displayFacet.removeFacet(displayFacet.type, displayFacet.bool, displayFacet.val);
    });

    if (this.bulkSearchQueryId) {
      this.clearBulkSearch();
    } else {
      this.clearSearch();
    }

    this.facetManagerService.clearSelections();
  }

  clearSearch(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;
    this.gaService.sendEvent('productFiltering', 'icon-button:clear-search', eventLabel);

    this.pageIndex = 0;
    this.pageSize = 10;
    this.privateSearchTerm = '';
    this.searchValue = '';
    this.isSearchFinished = false;

    this.populateUrlQueryParameters();

    this.searchProducts();
  }

  clearBulkSearch(): void {
    this.order = '$root_lastModifiedDate';
    this.pageSize = 10;
    this.pageIndex = 0;
    this.privateSearchTerm = '';
    this.searchValue = '';

    this.bulkSearchQueryId = null;
    this.bulkSearchStatusKey = '';
    this.searchEntity = '';
    this.subEntitySearchHash = '';
    this.isSearchFinished = false;
    this.subEntityDisplayFacets = [];

    this.populateUrlQueryParameters();

    // Reset bulk search and do regular search
    this.searchProducts();
  }

  refreshBulkSearch() {
    this.searchProducts();

  }

  populateUrlQueryParameters(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };
    //navigationExtras.queryParams['searchTerm'] = this.privateSearchTerm;
    navigationExtras.queryParams['search'] = this.privateSearchTerm;
    navigationExtras.queryParams['pageSize'] = this.pageSize;
    navigationExtras.queryParams['pageIndex'] = this.pageIndex;
    navigationExtras.queryParams['skip'] = this.pageIndex * this.pageSize;

    navigationExtras.queryParams['bulkQID'] = this.bulkSearchQueryId;
    navigationExtras.queryParams['searchEntity'] = this.searchEntity;
    navigationExtras.queryParams['subentity-hash'] = this.subEntitySearchHash;

    this.previousState.push(this.router.url);
    const urlTree = this.router.createUrlTree([], {
      // queryParams: navigationExtras.queryParams,
      queryParams: {},
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

  restricSearh(searchTerm: string): void {
    this.privateSearchTerm = searchTerm;
    this.searchTermHash = this.utilsService.hashCode(this.privateSearchTerm);
    this.isSearchEditable = localStorage.getItem(this.searchTermHash.toString()) != null;
    this.populateUrlQueryParameters();
    this.searchProducts();
    // this.substanceTextSearchService.setSearchValue('main-substance-search', this.privateSearchTerm);
  }

  getDailyMedUrlforProductCode(): void {
    this.products.forEach((product, indexProd) => {
      product.productProvenances.forEach((prov, indexProv) => {
        prov.productCodes.forEach(prodCode => {

          // if Product Code Type is 'NDC CODE', show Daily Med link on the browse Product page.
          if (prodCode) {
            if (prodCode.productCode) {
              if (prodCode.productCodeType && prodCode.productCodeType === 'NDC CODE') {
                prodCode._dailyMedUrl = this.dailyMedUrlConfig + prodCode.productCode;
              }
            }
          }

        });
      });
    });
  }

  getSubstanceBySubstanceKey(): void {

    this.products.forEach((product, indexProd) => {

      // Set to []
      product._activeIngredients = [];
      product._otherIngredients = [];

      // Hide/Show
      this.showMoreLessActiveIngredArray[indexProd] = true;
      this.showMoreLessOtherIngredArray[indexProd] = true;

      product.productManufactureItems.forEach((elementManuItem, indexManuItem) => {

        // Sort Product Name by create date descending
        // elementManuItem.applicationProductNameList.sort((a, b) => {
        //   return <any>new Date(b.creationDate) - <any>new Date(a.creationDate);
        // });

        elementManuItem.productLots.forEach((elementLot, indexLot) => {
          elementLot.productIngredients.forEach((elementIngred, indexIngred) => {

            // if Substance Key exists, get Substance UUID for the substance key
            if (elementIngred.substanceKey != null) {

              const substanceSubscription = this.generalService.getSubstanceByAnyId(elementIngred.substanceKey).subscribe(response => {
                if (response) {
                  elementIngred._substanceUuid = response.uuid;
                  elementIngred._ingredientName = response._name;
                  elementIngred._approvalId = response.approvalID

                  // if Ingredient Type exists
                  if (elementIngred.ingredientType) {

                    // Active Ingredient Count
                    if (elementIngred.ingredientType == this.ACTIVE_INGREDIENT_UPPERCASE
                      || elementIngred.ingredientType == this.ACTIVE_INGREDIENT_LOWERCASE) {

                      // Store Active Ingredient in an Array
                      product._activeIngredients.push(elementIngred);
                    }
                    // Inactive and Other Ingredient Count
                    else if (elementIngred.ingredientType != this.ACTIVE_INGREDIENT_UPPERCASE
                      && elementIngred.ingredientType != this.ACTIVE_INGREDIENT_LOWERCASE) {

                      // Store Active Ingredient in an Array
                      product._otherIngredients.push(elementIngred);
                    }
                  } // if Ingredient Type exists
                  else {
                    // if there is no Ingredient Type
                    product._otherIngredients.push(elementIngred);
                  }

                  /*
                  // Get Substance Details, uuid, approval_id, substance name
                  if (elementIngred.substanceKey) {
                    this.generalService.getSubstanceByAnyId(elementIngred.substanceKey).subscribe(responseInactive => {
                      if (responseInactive) {
                        elementIngred._substanceUuid = responseInactive.uuid;
                        elementIngred._ingredientName = responseInactive._name;
                      }
                    });
                  }
                  */

                  // Get Active Moiety - Relationship
                  /*
                  this.applicationService.getSubstanceRelationship(substanceId).subscribe(responseRel => {
                    relationship = responseRel;
                    relationship.forEach((elementRel, indexRel) => {
                      if (elementRel.relationshipName != null) {
                        elementIngred.activeMoietyName = elementRel.relationshipName;
                        elementIngred.activeMoietyUnii = elementRel.relationshipUnii;
                      }
                    });
                  });
                  */

                } // response
              });
              this.subscriptions.push(substanceSubscription);
            } // substancekey exists
          }); // loop productIngredients
        }); // loop productLots
      }); // loop productManufactureItems
    });  // loop product
  }

  export(extension: string) {
    if (this.etag) {
      // const extension = 'xlsx';
      const url1 = this.getApiExportUrl(this.etag, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          // height: '215x',
          width: '700px',
          data: { 'extension': extension, 'type': 'BrowseProducts', 'entity': 'products', 'hideOptionButtons': true }
        });
        // this.overlayContainer.style.zIndex = '1002';
        dialogReference.afterClosed().subscribe(response => {
          // this.overlayContainer.style.zIndex = null;
          const name = response.name;
          const id = response.id;
          if (name && name !== '') {
            this.loadingService.setLoading(true);
            const fullname = name + '.' + extension;
            this.authService.startUserDownload(url1, this.privateExport, fullname, id).subscribe(response => {
              // this.authService.startUserDownload(url, this.privateExport, fullname).subscribe(response => {
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

  /*
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
  */

  isNumber(str: any): boolean {
    if (str) {
      const num = Number(str);
      const nan = isNaN(num);
      return !nan;
    }
    return false;
  }


  openImageModal(subUuid: string, displayName?: string, approvalID?: string): void {
    let data: any;
    data = {
      structure: subUuid,
      uuid: subUuid,
      approvalID: approvalID,
      displayName: displayName
    };

    const dialogRef = this.dialog.open(StructureImageModalComponent, {
      height: '90%',
      width: '650px',
      panelClass: 'structure-image-panel',
      data: data
    });

    this.overlayContainer.style.zIndex = '1002';

    const subscription = dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    }, () => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    });
  }

  getAppTypeNumberUrl(applicationType: string, applicationNumber: string): string {
    let appUrl = 'browse-applications?search=root_appType:\"^' + applicationType + '$\" AND root_appNumber:\"^' + applicationNumber + '$\"';
    return appUrl;
  }

  processSubstanceSearch(searchValue: string) {
    this.privateSearchTerm = searchValue;
    this.setSearchTermValue();
  }

  getProductNameWithDisplayName(productIndex: number, productProvenanceIndex: number, productProvenanceNameIndex: number) {
    const productNameObj = this.products[productIndex].productProvenances[productProvenanceIndex].productNames[productProvenanceNameIndex];
    this.products.forEach(product => {
      if (product) {

      }
    });
  }

  showJSON(productIndex: number): void {
    const date = new Date();
    let jsonFilename = 'product_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');

    const copyProd = _.cloneDeep(this.products[productIndex]);
    let cleanProduct = this.scrub(copyProd);

    let data = { jsonData: cleanProduct, jsonFilename: jsonFilename };

    const dialogRef = this.dialog.open(JsonDialogFdaComponent, {
      width: '90%',
      height: '90%',
      data: data
    });

    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
    });
    this.subscriptions.push(dialogSubscription);
  }

  saveJSON(productIndex: number): void {
    const copyProd = _.cloneDeep(this.products[productIndex]);
    let cleanProduct = this.scrub(copyProd);

    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(cleanProduct)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'product_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
  }

  increaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = '1002';
  }

  decreaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = null;
  }

  tabSelectedUpdated(event: MatTabChangeEvent) {
    if (event) {
      //this.tabSelectedIndex = event.index;
    }
  }

  toggleShowMoreLessActiveIngredArray(indexProd) {
    this.showMoreLessActiveIngredArray[indexProd] = !this.showMoreLessActiveIngredArray[indexProd];
  }

  toggleShowMoreLessOtherIngredArray(indexProd) {
    this.showMoreLessOtherIngredArray[indexProd] = !this.showMoreLessOtherIngredArray[indexProd];
  }

  scrub(oldraw: any): any {
    const old = oldraw;

    const activeMoietyHolders = jp.query(old, '$..[?(@._ingredientNameActiveMoieties)]');
    for (let i = 0; i < activeMoietyHolders.length; i++) {
      if (activeMoietyHolders[i]._ingredientNameActiveMoieties) {
        delete activeMoietyHolders[i]._ingredientNameActiveMoieties;
      }
    }

    const basisOfStrenghActiveMoietyHolders = jp.query(old, '$..[?(@._basisOfStrengthActiveMoieties)]');
    for (let i = 0; i < basisOfStrenghActiveMoietyHolders.length; i++) {
      if (basisOfStrenghActiveMoietyHolders[i]._basisOfStrengthActiveMoieties) {
        delete basisOfStrenghActiveMoietyHolders[i]._basisOfStrengthActiveMoieties;
      }
    }

    const basisOfStrengthSubUuidHolders = jp.query(old, '$..[?(@._basisOfStrengthSubstanceUuid)]');
    for (let i = 0; i < basisOfStrengthSubUuidHolders.length; i++) {
      if (basisOfStrengthSubUuidHolders[i]._basisOfStrengthSubstanceUuid) {
        delete basisOfStrengthSubUuidHolders[i]._basisOfStrengthSubstanceUuid;
      }
    }

    const basisOfStrengthIngNameHolders = jp.query(old, '$..[?(@._basisOfStrengthIngredientName)]');
    for (let i = 0; i < basisOfStrengthIngNameHolders.length; i++) {
      if (basisOfStrengthIngNameHolders[i]._basisOfStrengthIngredientName) {
        delete basisOfStrengthIngNameHolders[i]._basisOfStrengthIngredientName;
      }
    }

    const substanceUuidHolders = jp.query(old, '$..[?(@._substanceUuid)]');
    for (let i = 0; i < substanceUuidHolders.length; i++) {
      if (substanceUuidHolders[i]._substanceUuid) {
        delete substanceUuidHolders[i]._substanceUuid;
      }
    }

    const ingredientNameHolders = jp.query(old, '$..[?(@._ingredientName)]');
    for (let i = 0; i < ingredientNameHolders.length; i++) {
      if (ingredientNameHolders[i]._ingredientName) {
        delete ingredientNameHolders[i]._ingredientName;
      }
    }

    const approvalIdHolders = jp.query(old, '$..[?(@._approvalId)]');
    for (let i = 0; i < approvalIdHolders.length; i++) {
      if (approvalIdHolders[i]._approvalId) {
        delete approvalIdHolders[i]._approvalId;
      }
    }

    delete old['_activeIngredients'];
    delete old['_otherIngredients'];

    return old;
  }

  // Need this for Cross Entity Search. Return all the IDs only for the current search
  getSearchIdsOnly(doPerformSearch: boolean) {
    if (doPerformSearch) {
      let idListsTemp: Array<string> = [];

      let order = null;
      let top = 10;
      let skip = 0;
      let fdim = 1000000;
      let bulkQID = null;
      let searchOnIdentifiers = false;
      let view = 'key';
      // let viewfield = 'facet';
      let facetlabel = 'Substance UUID';
      let viewfield = null;

      const subscription = this.productService.getProductFacetWithSearchCriteria(
        facetlabel,
        this.privateFacetParams,
        this.privateSearchTerm,
        fdim
      ).subscribe(response => {
        if (response) {
          if (response.content && response.content.length > 0) {
            // *** For Cross Entity Search get lists of Substance UUID ***
            response.content.forEach((facet, index) => {
              if (facet) {
                if (facet.label) {
                  idListsTemp.push(facet.label);
                }
              }
              // Copy after the last record
              if (response.content.length == index + 1) {

                // Get Search Product Ids
                this.getSearchProductIds(idListsTemp);

                // For Cross Entity Search, copy idListTemp to idList after the loop so that change detection happens only once
                // this.idLists = idListsTemp;
              }
            }); // forEach    

          } // if content 
          else {
            this.idLists = [];
          }
        } // response
        else {
          this.idLists = [];
        }

      }, error => {
        console.log('Error during search product');
      }, () => {
        this.subscriptions.push(subscription);
      }
      ); // response

    } // if doPerformSearch == true
  }

  getSearchProductIds(substanceUuids?: any) {
    let idListsTemp: Array<string> = [];

    let order = null;
    let top = 1000000;
    let skip = 0;
    let fdim = 10;
    let bulkQID = null;
    let searchOnIdentifiers = false;
    let view = 'key';
    // let viewfield = 'facet';
    //let facetlabel = 'Substance UUID';
    let facetlabel = null;
    let viewfield = 'id';
    let simpleSearchOnly: boolean = true;

    // Get Product records that have Ingredients
    this.privateFacetParams['Has Ingredients'] = { 'params': { 'Has Ingredients': true }, 'isAllMatch': false };

    const prodSubscription = this.productService.getProducts(
      order,
      skip,
      top,
      this.privateSearchTerm,
      this.privateFacetParams,
      fdim,
      bulkQID,
      searchOnIdentifiers,
      view,
      viewfield,
      facetlabel,
      simpleSearchOnly
    ).subscribe(pagingResponse => {
      if (pagingResponse.content) {
        let results: any = pagingResponse.content;

        // Loop through each product record and get product id
        if (results.length > 0) {
          results.forEach((productId, index) => {
            // for Cross Entity Search, add Product Ids in the temporary list
            idListsTemp.push(productId);

            // Copy after the last record
            if (results.length == index + 1) {

              this.idLists = substanceUuids;
              this.secondIdLists = idListsTemp;
              // For Cross Entity Search, copy idListTemp to idList after the loop so that change detection happens only once
              //  this.idLists = idListsTemp;
            }
          }); // forEach
        } else {
          //this.idLists = [];
        }
      }  // pagingResponse   
    }, error => {
      console.log('Error during search substance');
    }, () => {
      this.subscriptions.push(prodSubscription);
    }

    ); // pagingResponse
  }

  subEntityfacetDisplay() {
    // if (hashcode is found on the url)
    if (this.subEntitySearchHash) {
      // Get Sub-entity facet values from local Storage to display on Browse Substance page
      const searchParams = localStorage.getItem(this.subEntitySearchHash);

      if (searchParams) {
        const searchParamItems = JSON.parse(searchParams);
        if (searchParamItems) {
          this.subEntity = searchParamItems['subEntityDisplay'];
          this.subEntityDisplayFacets = searchParamItems['subEntityDisplayFacets'];
        }
      }
    }
  }

  editSubEntitySearch(): void {
    if (this.subEntitySearchHash) {
      let randomInteger = Math.floor(Math.random() * 100000000);

      // Using random number to create different value, so it will trigger change Detection for Input
      this.editSubEntitySearchHash = this.subEntitySearchHash + '_' + randomInteger;
    }
  }

}