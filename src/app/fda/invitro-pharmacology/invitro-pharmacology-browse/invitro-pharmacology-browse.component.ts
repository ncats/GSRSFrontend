import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import * as moment from 'moment';
import { Location, LocationStrategy } from '@angular/common';

/* GSRS Core Imports */
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ConfigService } from '@gsrs-core/config';
import { Facet, FacetsManagerService, FacetUpdateEvent } from '@gsrs-core/facets-manager';
import { GeneralService } from '../../service/general.service';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { FacetParam } from '@gsrs-core/facets-manager';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';
import { NarrowSearchSuggestion } from '@gsrs-core/utils';
import { environment } from '../../../../environments/environment';
import { StructureImageModalComponent } from '@gsrs-core/structure';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service'
import { example, InvitroAssayScreening } from '../model/invitro-pharmacology.model';
import { invitroPharmacologySearchSortValues } from './invitro-pharmacology-search-sort-values';

@Component({
  selector: 'app-invitro-pharmacology-browse',
  templateUrl: './invitro-pharmacology-browse.component.html',
  styleUrls: ['./invitro-pharmacology-browse.component.scss']
})
export class InvitroPharmacologyBrowseComponent implements OnInit {

  view = 'cards';
  public privateSearchTerm?: string;
  public assays: Array<InvitroAssayScreening>;
  order: string;
  public sortValues = invitroPharmacologySearchSortValues;
  pageIndex: number;
  pageSize: number;
  jumpToValue: string;

  totalInvitroPharm: number;
  calculateIc50: string;
  tabSelectedIndex = 0;
  viewTabSelectedIndex = 0;
  assayTargetSummary: string;
  displayCategory = 'summary';

  targetSummaries: any;
  substanceNameLists: Array<any> = [];
  testCompoundList: Array<any> = [];
  browseSubstanceScreening: Array<any> = [];

  isLoading = true;
  isError = false;
  isAdmin: boolean;
  isLoggedIn = false;
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
  narrowSearchSuggestions?: { [matchType: string]: Array<NarrowSearchSuggestion> } = {};
  matchTypes?: Array<string> = [];
  narrowSearchSuggestionsCount = 0;
  previousState: Array<string> = [];
  private searchTermHash: number;
  isSearchEditable = false;
  searchValue: string;
  lastPage: number;
  invalidPage = false;
  ascDescDir = 'desc';
  substanceScreeningColumns: string[] = [
    'viewDetails',
    'batchId',
    'screeningConcentration',
    'screeningInhibition',
    'assayTarget',
    'assayType'
  ];

  substanceSummaryColumns: string[] = [
    'amountValue',
    'relationshipType',
    'relatedSubstance',
    'studyType',
    'assayType'
  ];

  displayedColumns: string[] = [
    'viewDetails',
    'testCompound',
    'batchId',
    'screeningConcentration',
    'screeningInhibition',
    'assayTarget',
    'assayType'
  ];

  summaryDisplayedColumns: string[] = [
    'testCompound',
    'amountValue',
    'relationshipType',
    'relatedSubstance',
    'studyType',
    'assayType'
    // 'applicationType'
  ];

  // needed for facets
  private privateFacetParams: FacetParam;
  rawFacets: Array<Facet>;
  private isFacetsParamsInit = false;
  public displayFacets: Array<DisplayFacet> = [];
  private subscriptions: Array<Subscription> = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private overlayContainerService: OverlayContainer,
    private sanitizer: DomSanitizer,
    private authService: AuthService,
    private utilsService: UtilsService,
    private loadingService: LoadingService,
    private mainNotificationService: MainNotificationService,
    private configService: ConfigService,
    private facetManagerService: FacetsManagerService,
    private generalService: GeneralService,
    private invitroPharmacologyService: InvitroPharmacologyService,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.facetManagerService.registerGetFacetsHandler(this.invitroPharmacologyService.getInvitroPharmacologyFacets);

    this.titleService.setTitle(`IP:Browse In-vitro Pharmacology`);

    this.pageSize = 10;
    this.pageIndex = 0;

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    const authSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
      }
      this.isAdmin = this.authService.hasAnyRoles('Admin', 'Updater', 'SuperUpdater');
    });
    this.subscriptions.push(authSubscription);

    this.privateSearchTerm = this.activatedRoute.snapshot.queryParams['search'] || '';

    if (this.privateSearchTerm) {
      this.searchTermHash = this.utilsService.hashCode(this.privateSearchTerm);
      this.isSearchEditable = localStorage.getItem(this.searchTermHash.toString()) != null;
    }

    this.order = this.activatedRoute.snapshot.queryParams['order'] || 'root_assayStudyType';
    this.pageSize = parseInt(this.activatedRoute.snapshot.queryParams['pageSize'], null) || 10;
    this.pageIndex = parseInt(this.activatedRoute.snapshot.queryParams['pageIndex'], null) || 0;

    this.overlayContainer = this.overlayContainerService.getContainerElement();

    const paramsSubscription = this.activatedRoute.queryParamMap.subscribe(params => {
      this.searchValue = params.get('search');
    });
    this.subscriptions.push(paramsSubscription);

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
      this.searchInvitroPharmacology();
    }

    // Load Browse Substance Tab

  }

  tabSelectedUpdated(event: MatTabChangeEvent) {
    if (event) {
      //  this.category = event.tab.textLabel;

    }
  }

  viewTabSelectedUpdated(event: MatTabChangeEvent) {
    if (event) {
      //  this.category = event.tab.textLabel;
      //  this.setFacetsforTabs();
    }
  }

  searchInvitroPharmacology() {
    //this.privateSearchTerm = 'root_invitroTestCompound_testCompound:BAF312';
    this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    const subscription = this.invitroPharmacologyService.getInvitroPharmacology(
      this.order,
      skip,
      this.pageSize,
      this.privateSearchTerm,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.isError = false;
        this.assays = pagingResponse.content;
        // didn't work unless I did it like this instead of
        // below export statement
        this.dataSource = pagingResponse.content;
        this.totalInvitroPharm = pagingResponse.total;
        this.etag = pagingResponse.etag;

        // alert('This etag' + this.etag);
        if (pagingResponse.total % this.pageSize === 0) {
          this.lastPage = (pagingResponse.total / this.pageSize);
        } else {
          this.lastPage = Math.floor(pagingResponse.total / this.pageSize + 1);
        }
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {

          // Get the List of Substance Names/Test Compounds from Facet from Browse Assay Target
          this.rawFacets = pagingResponse.facets;
          this.rawFacets.forEach(elementFacet => {
            if (elementFacet.name === "Test Compound") {
              const values = elementFacet.values;
              //  alert("LENGTH VALUES: " + values.length);
              values.forEach(elementValue => {
                //   alert("LABEL LABEL LABEL: " + elementValue.label);
                if (elementValue.label) {
                  //   alert("LABEL: " + elementValue.label);
                  this.substanceNameLists.push(elementValue.label);
                }
              });
            }
          });


          //  this.setFacetsforTabs();
         // this.loadBrowseSubstanceTab();

          // CALL Browse By ALL Substance
          this.browseByAllSubstance();

        }

        // LOOP Results:
        this.assays.forEach(element => {
          if (element) {

            if (element.assayTarget) {
              element._targetSummaries = element.invitroTestCompound.invitroRelationships;

              // Calculate IC50
              if (element.percentInhibitionMean) {
                if (element.percentInhibitionMean < 30) {
                  element._calculateIc50 = element.controlValueType + ' > ' + element.screeningConcentration;
                }
              }

              // Get Substance Id for Assay Target
              if (element.assayTargetUnii) {
                const assayTargetSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(element.assayTargetUnii).subscribe
                  (substance => {
                    if (substance) {
                      element._assayTargetSubId = substance.uuid;
                    }
                  });
                this.subscriptions.push(assayTargetSubIdSubscription);
              }

              // Get Substance Id for Test Compound
              if (element.invitroTestCompound.testCompoundUnii) {
                const testCompoundSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(element.invitroTestCompound.testCompoundUnii).subscribe
                  (substance => {
                    if (substance) {
                      element.invitroTestCompound._testCompoundSubId = substance.uuid;
                    }
                  });
                this.subscriptions.push(testCompoundSubIdSubscription);
              }

              // Get Substance Id for Ligand/Substrate
              if (element.ligandSubstrateUnii) {
                const ligandSubstrateSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(element.ligandSubstrateUnii).subscribe
                  (substance => {
                    if (substance) {
                      element._ligandSubstrateSubId = substance.uuid;
                    }
                  });
                this.subscriptions.push(ligandSubstrateSubIdSubscription);
              }

              // Get Substance Id for Control
              if (element.controlUnii) {
                const controlSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(element.controlUnii).subscribe
                  (substance => {
                    if (substance) {
                      element._controlSubId = substance.uuid;
                    }
                  });
                this.subscriptions.push(controlSubIdSubscription);
              }

              //
            }
          }
        });

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

      }, error => {
        console.log('error');
        const notification: AppNotification = {
          message: 'There was an error trying to retrieve in-vitro pharmacology data. Please refresh and try again.',
          type: NotificationType.error,
          milisecondsToShow: 6000
        };
        this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.mainNotificationService.setNotification(notification);
      }, () => {
        subscription.unsubscribe();
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      });
  }

  loadBrowseSubstanceTab() {
    this.substanceNameLists.forEach(elementSubstance => {
      const subScreening = { 'testCompound': elementSubstance };

      this.browseSubstanceScreening.push(subScreening);
      console.log("SUBSTANCE NAME" + elementSubstance);
    });
  }

  browseByAllSubstance() {
    this.substanceNameLists.forEach(elementSubstance => {
      //  const subScreening = { 'testCompound': elementSubstance };

      let searchterm = "root_invitroTestCompound_testCompound:" + elementSubstance;

      this.loadingService.setLoading(true);
      const skip = this.pageIndex * this.pageSize;
      const subscription = this.invitroPharmacologyService.getAssayByTestCompound(
        this.order,
        skip,
        this.pageSize,
        searchterm,
        this.privateFacetParams,
      )
        .subscribe(pagingResponse => {
          this.isError = false;
          let test = pagingResponse.content;
          // didn't work unless I did it like this instead of
          // below export statement
          let substanceAssay = pagingResponse.content;
          this.totalInvitroPharm = pagingResponse.total;
          this.etag = pagingResponse.etag;


          substanceAssay.forEach(element => {
            if (element) {

              if (element.assayTarget) {

                // Calculate IC50
                if (element.percentInhibitionMean) {
                  if (element.percentInhibitionMean < 30) {
                    element._calculateIc50 = element.controlValueType + ' > ' + element.screeningConcentration;
                  }
                }
              }
            }
          });

          const subScreening = { 'testCompound': elementSubstance, 'assay': substanceAssay };
          this.browseSubstanceScreening.push(subScreening);

      }, error => {
        console.log('error');
        const notification: AppNotification = {
          message: 'There was an error trying to retrieve in-vitro pharmacology data. Please refresh and try again.',
          type: NotificationType.error,
          milisecondsToShow: 6000
        };
        this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.mainNotificationService.setNotification(notification);
      }, () => {
        subscription.unsubscribe();
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      });
          /*

         //  this.browseSubstanceScreening.push(subScreening);
           console.log("SUBSTANCE NAME" + elementSubstance);


           const assayList = [];
           this.assays.forEach(elementAssay => {
             if (elementAssay.invitroTestCompound) {
               if (elementAssay.invitroTestCompound.testCompound) {
                 if (elementAssay.invitroTestCompound.testCompound === elementSubstance) {
                   const assay = { 'testCompound': elementSubstance, 'assay': elementAssay };
                   assayList.push(assay);
                 }
               }
             }
           });
           // alert("LENGTH: " + this.testCompoundList.length);
           this.testCompoundList.push(assayList);  */
        });

      //alert(this.testCompoundList[0].testCompound);
      console.log('AAAA: ' + JSON.stringify(this.testCompoundList));
    }

  setSearchTermValue() {
      this.pageSize = 10;
      this.pageIndex = 0;
      this.searchInvitroPharmacology();
    }

  clearSearch(): void {
      const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;

      this.privateSearchTerm = '';
      this.pageIndex = 0;
      this.pageSize = 10;

      this.populateUrlQueryParameters();
      this.searchInvitroPharmacology();
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

  sortData(sort: Sort) {
      if(sort.active) {
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
      this.searchInvitroPharmacology();
    }
    return;
  }

  openSideNav() {
    // this.matSideNav.open();
  }

  updateView(event): void {
    // this.gaService.sendEvent('adverseeventptsContent', 'button:view-update', event.value);
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

    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.populateUrlQueryParameters();
    this.searchInvitroPharmacology();
  }

  customPage(event: any): void {
    if (this.validatePageInput(event)) {
      this.invalidPage = false;
      const newpage = Number(event.target.value) - 1;
      this.pageIndex = newpage;
      this.populateUrlQueryParameters();
      this.searchInvitroPharmacology();
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
      this.searchInvitroPharmacology();
    }
  }

  // for facets
  facetsLoaded(numFacetsLoaded: number) {
  }

  editAdvancedSearch(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'Browse Application search term' :
      `${this.privateSearchTerm}`;

    const navigationExtras: NavigationExtras = {
      queryParams: {
        'g-search-hash': this.searchTermHash.toString()
      }
    };

    this.router.navigate(['/advanced-search'], navigationExtras);
  }

  openImageModal($event, subUuid: string): void {
    // const eventLabel = environment.isAnalyticsPrivate ? 'substance' : substance._name;

    //  this.gaService.sendEvent('substancesContent', 'link:structure-zoom', eventLabel);

    let data: any;

    // if (substance.substanceClass === 'chemical') {
    data = {
      structure: subUuid,
      //   smiles: substance.structure.smiles,
      uuid: subUuid,
      //    names: substance.names
    };
    // }

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

  processSubstanceSearch(searchValue: string) {
    this.privateSearchTerm = searchValue;
    this.setSearchTermValue();
  }

  increaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = '1002';
  }

  decreaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = null;
  }

  formatValue(v) {
    if (v) {
      if (typeof v === 'object') {
        if (v.display) {
          return v.display;
        } else if (v.value) {
          return v.value;
        } else {
          return null;
        }
      } else {
        return v;
      }
    }
    return null;
  }

  displayAmount(amt: any): string {
    let ret = '';
    if (amt) {
      //if (typeof assay === 'object') {
      //  if (amt) {

      let addedunits = false;
      let unittext = this.formatValue(amt.amountUnits);
      if (!unittext) {
        unittext = '';
      }
      const atype = this.formatValue(amt.amountType);
      if (atype) {
        ret += atype + '\n';
      }
      if (amt.amountAverage || amt.amountHigh || amt.amountLow) {
        if (amt.amountAverage) {
          ret += amt.amountAverage;
          if (amt.amountUnits) {
            ret += ' ' + unittext;
            addedunits = true;
          }
        }
        if (amt.amountHigh || amt.amountLow) {
          ret += ' [';
          if (amt.amountHigh && !amt.amountLow) {
            ret += '<' + amt.amountHigh;
          } else if (!amt.amountHigh && amt.amountLow) {
            ret += '>' + amt.amountLow;
          } else if (amt.amountHigh && amt.amountLow) {
            ret += amt.amountLow + ' to ' + amt.amountHigh;
          }
          ret += '] ';
          if (!addedunits) {
            if (amt.amountUnits) {
              ret += ' ' + unittext;
              addedunits = true;
            }
          }
        }
        ret += ' (average) ';
      }

      /*
      if (amt.highLimit || amt.lowLimit) {
        ret += '\n[';
      }
      if (amt.highLimit && !amt.lowLimit) {
        ret += '<' + amt.highLimit;
      } else if (!amt.highLimit && amt.lowLimit) {
        ret += '>' + amt.lowLimit;
      } else if (amt.highLimit && amt.lowLimit) {
        ret += amt.lowLimit + ' to ' + amt.highLimit;
      }
      if (amt.highLimit || amt.lowLimit) {
        ret += '] ';
        if (!addedunits) {
          if (amt.units) {
            ret += ' ' + unittext;
            addedunits = true;
          }
        }
        ret += ' (limits)';
      }
      */
      //     }
      //      }
    }
    return ret;
  }

}
