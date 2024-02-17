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
import { InvitroAssayInformation } from '../model/invitro-pharmacology.model';
import { invitroPharmacologySearchSortValues } from './invitro-pharmacology-search-sort-values';

@Component({
  selector: 'app-invitro-pharmacology-browse',
  templateUrl: './invitro-pharmacology-browse.component.html',
  styleUrls: ['./invitro-pharmacology-browse.component.scss']
})
export class InvitroPharmacologyBrowseComponent implements OnInit {

  public assays: Array<InvitroAssayInformation>;

  view = 'cards';
  public privateSearchTerm?: string;

  order: string;
  public sortValues = invitroPharmacologySearchSortValues;
  pageIndex: number;
  pageSize: number;
  jumpToValue: string;

  pageIndexReference = 0;
  pageSizeReference: number;

  totalCountBrowseAllAssay: number;
  totalCountBrowseAssayTarget: number;
  totalCountBrowseTestAgent: number;
  totalCountSearchReference: number;

  totalCountAssayTarget: number;
  totalCountSubstance: number;
  totalCountApplication: number;

  calculateIc50: string;
  tabSelectedIndex = 0;
  viewTabSelectedIndex = 0;
  displayCategory = 'summary';

  targetSummaries: any;
  // assayTargetSummary: Array<any> = [];

  testAgentLists: Array<any> = [];
  applicationTypeNumLists: Array<any> = [];

  // Lists of data for Browse tabs
  testAgentListForBrowse: Array<any> = [];
  browseSubstanceList: Array<any> = [];
  referenceListForBrowse: Array<any> = [];

  downloadJsonHref: any;
  jsonFileName: string;

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

  assaySummaryDisplayedColumns: string[] = [
    'testAgent',
    'screenConcentration',
    'valueType',
    // 'value',
    // 'relationshipType',
    'reference',
    'assayType',
    'studyType'
  ];

  assayTargetSummaryDisplayedColumns: string[] = [
    'viewDetails',
    'testAgent',
    'screenConcentration',
    'valueType',
    'relationshipType',
    'referenceSource'
    //'testAgent'
    //'screenConcentration',
    //'valueType',
    // 'relationshipType',
    // 'relatedSubstance'
    //'source'
  ];

  substanceSummaryColumns: string[] = [
    'viewDetails',
    'screenConcentration',
    'percentInhibition',
    'valueType',
    'assayTarget',
    'assayType',
    'studyType',
    'relationshipType'
  ];

  substanceScreeningColumns: string[] = [
    'viewDetails',
    'screeningConcentration',
    'screeningInhibition',
    'assayTarget',
    'assayType'
  ];

  applicationSummaryColumns: string[] = [
    'viewDetails',
    'screenConcentration',
    'percentInhibition',
    'valueType',
    'assayTarget',
    'assayType',
    'studyType',
    'relationshipType',
    'relatedSubstance'
  ];

  // needed for facets
  private privateFacetParams: FacetParam;
  //rawFacets: Array<Facet>;
  rawFacets: Array<any>;
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

    this.order = this.activatedRoute.snapshot.queryParams['order'] || 'root_studyType';
    this.pageSize = parseInt(this.activatedRoute.snapshot.queryParams['pageSize'], null) || 10;
    this.pageIndex = parseInt(this.activatedRoute.snapshot.queryParams['pageIndex'], null) || 0;

    this.overlayContainer = this.overlayContainerService.getContainerElement();

    const paramsSubscription = this.activatedRoute.queryParamMap.subscribe(params => {
      this.searchValue = params.get('search');
    });
    this.subscriptions.push(paramsSubscription);

  }

  ngAfterViewInit() {
    this.isComponentInit = true;
    this.loadComponent();
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
      this.searchInvitroAssay();
    }
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

  searchInvitroAssay() {
    //Clear the existing lists
    this.testAgentListForBrowse = [];
    this.referenceListForBrowse = [];

    // Set total Counts to 0
    this.totalCountSubstance = 0;
    this.totalCountApplication = 0;

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
        this.totalCountAssayTarget = pagingResponse.total;
        this.etag = pagingResponse.etag;

        if (pagingResponse.total % this.pageSize === 0) {
          this.lastPage = (pagingResponse.total / this.pageSize);
        } else {
          this.lastPage = Math.floor(pagingResponse.total / this.pageSize + 1);
        }

        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacets = pagingResponse.facets;

          // Sideway Facets or selected Facets
          let sideWayfacets = [];
          if (pagingResponse.sideway || pagingResponse.sideway.length > 1) {
            sideWayfacets = pagingResponse.sideway;
          }

          /*
          this.rawFacets.forEach(elementFacet => {
            // Get Facet: Test Agent for Browse by Substance Tab
            if (elementFacet.name === "Test Agent") {
              const values = elementFacet.values;
              values.forEach(elementValue => {
                if (elementValue.label) {
                  this.testAgentLists.push(elementValue.label);
                }
              });
            }


            // Get Facet: Application Type Number for Browse by Application Tab
            if (elementFacet.name === "Application Type Number") {
              const values = elementFacet.values;
              values.forEach(elementValue => {
                if (elementValue.label) {
                  let value = "Application Type Number/" + elementValue.label;
                  if (sideWayfacets.includes(value)) {


                  }
                  this.applicationTypeNumLists.push(elementValue.label);
                }
              });



              const appSelectedLabels = elementFacet.selectedLabels;
              if (appSelectedLabels && appSelectedLabels.length > 0) {
                JSON.stringify(appSelectedLabels);
              }
              const appValues = elementFacet.values;
              appValues.forEach(elementValue => {
                if (elementValue.label) {
                  this.applicationTypeNumLists.push(elementValue.label);
                }
              });

            }

          });  // this.rawFacets.forEach
           */

          //  this.setFacetsforTabs();
          // this.loadBrowseSubstanceTab();

          // CALL Browse By Substance
          //this.browseByAllSubstance();

          // CALL Browse By Reference/Application
          //this.searchReference();
          //}
        } // for each paging facets

        // LOOP Results pagingResponse.content:

        this.assays.forEach(assay => {
          if (assay) {
            assay._assayTargetSummaries = [];

            assay.invitroInformationReferences.forEach(infoRef => {

              assay._assayTargetSummaries.push(infoRef);

              // ******** Get Reference List for 'Browse by Reference' tab.
              if (infoRef.invitroReference) {
                if ((infoRef.invitroReference.referenceApplicationType) || (infoRef.invitroReference.referenceApplicationNumber)) {
                  let appTypeNum = infoRef.invitroReference.referenceApplicationType + infoRef.invitroReference.referenceApplicationNumber;

                  // Check if value exists in the key or not
                  //const checkRoleExistence = this.referenceListForBrowse.some(({ appTypeNumber }) => appTypeNumber == appTypeNum)

                  // Get the index if the value exists in the key 'appTypeNumber'
                  const index = this.referenceListForBrowse.findIndex(record => record.appTypeNumber === appTypeNum);

                  if (index > -1) {
                    let assayReferenceList2 = [];
                    assayReferenceList2 = this.referenceListForBrowse[index].assayReference;
                    assayReferenceList2.push(assay);
                    this.referenceListForBrowse[index].assayReference = assayReferenceList2;
                  } else {
                    // For each assay
                    let assayReferenceList = [];
                    assayReferenceList.push(assay);
                    const appScreening = { 'appTypeNumber': appTypeNum, 'assayReference': assayReferenceList };
                    this.referenceListForBrowse.push(appScreening);
                  }

                  // Get total count for Browse Reference/Application
                  this.totalCountApplication = this.referenceListForBrowse.length;
                }
              } // if invitroReference exists


              // ******* Get Test Agent/Substance List for 'Browse by Test Agent/Substance' tab.
              if (infoRef.invitroAssayResult) {
                infoRef.invitroAssayResult.forEach(result => {
                  if (result) {
                    if (result.invitroTestAgent) {
                      if (result.invitroTestAgent.testAgent) {

                        // Get the index if the value exists in the key 'appTypeNumber'
                        const indexTestAgent = this.testAgentListForBrowse.findIndex(record => record.testAgent === result.invitroTestAgent.testAgent);

                        if (indexTestAgent > -1) {
                          let assayReferenceList2 = [];
                          assayReferenceList2 = this.testAgentListForBrowse[indexTestAgent].testAgentSummaryList;
                          assayReferenceList2.push(assay);
                          this.testAgentListForBrowse[indexTestAgent].testAgentSummaryList = assayReferenceList2;
                        } else {
                          // For each assay
                          let assayList = [];
                          assayList.push(assay);
                          const appScreening = { 'testAgent': result.invitroTestAgent.testAgent, 'testAgentSummaryList': assayList, 'testAgentScreeningList': assayList};
                          this.testAgentListForBrowse.push(appScreening);
                        }
                      } // if result.invitroTestAgent.testAgent exists

                    }

                  }
                });

                // Get total count for Browse Test Agent/Substance
                this.totalCountBrowseTestAgent = this.testAgentListForBrowse.length;

                // Check if value exists in the key or not
                //  const checkRoleExistence = this.referenceListForBrowse.some(({ appTypeNumber }) => appTypeNumber == appTypeNum)

                // Get the index if the value exists in the key 'appTypeNumber'
                //  const index = this.referenceListForBrowse.findIndex(record => record.appTypeNumber === appTypeNum);

              }



              /*
              if (element.assayTarget) {
                //  element._targetSummaries = element.invitroTestCompound.invitroRelationships;

                element._assayTargetSummaries = [];
                element._assayTargetSummaries.push(element);

                element._calculateIC50 = this.calculate1C50(element.valueType, element.percentInhibition, element.screeningConcentration)
                 */

              // Calculate IC50
              /*  if (element.percentInhibitionMean) {
                  if (element.percentInhibition < 30) {
                    element._calculateIc50 = element.controlValueType + ' > ' + element.screeningConcentration;
                  }
                }
              */
              // Get Substance Id for Assay Target
              /*
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
              if (element.testAgentUnii) {
                const testCompoundSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(element.testAgentUnii).subscribe
                  (substance => {
                    if (substance) {
                //      element.invitroTestCompound._testCompoundSubId = substance.uuid;
                    }
                  });
                this.subscriptions.push(testCompoundSubIdSubscription);
              }
              */

              /*
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
              */

              //
              //}

            });  //invitroInformationReferences.forEach
          } // if assay
        }); // this.assays.forEach


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

    //} //

    /*
    loadBrowseSubstanceTab() {
      this.substanceNameLists.forEach(elementSubstance => {
        const subScreening = { 'testCompound': elementSubstance };

        this.browseSubstanceList.push(subScreening);
      });
    }
    */
  }

  browseByAllSubstance() {
    // Get total count for Browse Substance
    this.totalCountSubstance = this.testAgentLists.length;

    this.testAgentLists.forEach(elementSubstance => {
      //  const subScreening = { 'testCompound': elementSubstance };

      let searchterm = "root_testAgent:" + elementSubstance;

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
          this.etag = pagingResponse.etag;


          substanceAssay.forEach(element => {
            if (element) {

              /*
              if (element.assayTarget) {

                element._calculateIC50 = this.calculate1C50(element.valueType, element.percentInhibition, element.screeningConcentration)
              */
              /*
              // Calculate IC50
              if (element.percentInhibitionMean) {
                if (element.percentInhibitionMean < 30) {
                  element._calculateIc50 = element.controlValueType + ' > ' + element.screeningConcentration;
                }
              }
              */
              // }
            }
          });

          const subScreening = { 'testAgent': elementSubstance, 'assay': substanceAssay };
          this.browseSubstanceList.push(subScreening);

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
    //console.log('AAAA: ' + JSON.stringify(this.testCompoundList));
  }


  /*
  searchReference() {
    this.applicationTypeNumLists.forEach(elementApp => {

      let searchterm = "root_Application Number Type:" + elementApp;

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
          let totalCountSearchReference = pagingResponse.total;
          this.isError = false;
          let test = pagingResponse.content;
          // didn't work unless I did it like this instead of
          // below export statement
          let substanceAssay = pagingResponse.content;
          this.etag = pagingResponse.etag;


          substanceAssay.forEach(element => {
            if (element) {

              if (element.assayTarget) {
              }

            }
          });

          if (totalCountSearchReference > 0) {
            const appScreening = { 'appTypeNumber': elementApp, 'assay': substanceAssay };
            this.browseApplicationList.push(appScreening);

            // Get total count for Browse Reference/Application
            this.totalCountApplication = this.browseApplicationList.length;

          }

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

    });
  }
  */

  calculate1C50(valueType, percentInhibition, screeningConcentration): string {
    let calculateIC50 = '';
    // if percentInhibition < 30, then IC50 > Screening Concentration
    // if percentInhibition between 30 and 60, then IC50 approx. = Screening Concentration
    // if percentInhibition above 60, then IC50 < Screening Concentration
    if (percentInhibition) {
      if (percentInhibition < 30) {
        calculateIC50 = valueType + ' > ' + screeningConcentration;
      } else if (percentInhibition >= 30 && percentInhibition <= 60) {
        calculateIC50 = valueType + ' approx. = ' + screeningConcentration;
      } else if (percentInhibition > 60) {
        calculateIC50 = valueType + ' < ' + screeningConcentration;
      }

    }
    return calculateIC50;
  }

  setSearchTermValue() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.searchInvitroAssay();
  }

  clearSearch(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;

    this.privateSearchTerm = '';
    this.pageIndex = 0;
    this.pageSize = 10;

    this.populateUrlQueryParameters();
    this.searchInvitroAssay();
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
    /*
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
      this.searchInvitroAssay();
    }
    return;*/
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
    this.searchInvitroAssay();
  }

  changePageReference(pageEvent: PageEvent) {
    let eventAction;
    let eventValue;

    if (this.pageSizeReference !== pageEvent.pageSize) {
      eventAction = 'select:page-size';
      eventValue = pageEvent.pageSize;
    } else if (this.pageIndexReference !== pageEvent.pageIndex) {
      eventAction = 'icon-button:page-number';
      eventValue = pageEvent.pageIndex + 1;
    }

    this.pageSizeReference = pageEvent.pageSize;
    this.pageIndexReference = pageEvent.pageIndex;
    this.populateUrlQueryParameters();
    //this.searchReference();
  }

  customPage(event: any): void {
    if (this.validatePageInput(event)) {
      this.invalidPage = false;
      const newpage = Number(event.target.value) - 1;
      this.pageIndex = newpage;
      this.populateUrlQueryParameters();
      this.searchInvitroAssay();
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
      this.searchInvitroAssay();
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

  saveJSON(id: number): void {
    let json = this.assays[id];
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'product_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
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
