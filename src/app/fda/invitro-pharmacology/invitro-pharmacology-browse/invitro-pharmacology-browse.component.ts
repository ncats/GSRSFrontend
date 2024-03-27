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
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';

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
  targetSummaries: any;

  // Browse by tabs, data lists
  browseByTargetNameList: Array<any> = [];
  browseByTestAgentList: Array<any> = [];
  browseByReferenceList: Array<any> = [];

  allAssaysList: Array<InvitroAssayInformation> = [];

  totalCountAllAssay: number;
  totalCountBrowseAllAssay: number;
  totalCountBrowseTargetName: number;
  totalCountBrowseTestAgent: number;
  totalCountSearchReference: number;

  totalCountAssayTarget: number;
  totalCountSubstance: number;
  totalCountReference: number;

  // Constants
  view = 'cards';
  displayCategory = 'summary';
  ascDescDir = 'desc';

  public privateSearchTerm?: string;

  order: string;
  public sortValues = invitroPharmacologySearchSortValues;
  pageIndex: number;
  pageSize: number;
  jumpToValue: string;

  pageIndexReference = 0;
  pageSizeReference: number;

  exportOptions: Array<any>;

  calculateIc50: string;
  tabSelectedIndex = 0;
  viewTabSelectedIndex = 0;

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

  assaySummaryDisplayedColumns: string[] = [
    'referenceSource',
    'testAgent',
    'testAgentConcentration',
    'resultValue',
    'calculatedValue',
    'assayType',
    'studyType'
  ];

  assayTargetSummaryDisplayedColumns: string[] = [
    'viewDetails',
    'referenceSource',
    'testAgent',
    'testAgentConcentration',
    'resultValue',
    'calculatedValue',
    'assayType',
    'studyType',
    'relationshipType'
  ];

  testAgentSummaryColumns: string[] = [
    'viewDetails',
    'testAgent',
    'referenceSource',
    'testAgentConcentration',
    'resultValue',
    'calculatedValue',
    'assayTarget',
    'assayType',
    'studyType',
    'relationshipType'
  ];

  testAgentScreeningColumns: string[] = [
    'viewDetails',
    'testAgentConcentration',
    'screeningInhibition',
    'assayTarget',
    'assayType'
  ];

  referenceSummaryColumns: string[] = [
    'viewDetails',
    'testAgent',
    'testAgentConcentration',
    'resultValue',
    'calculatedValue',
    'assayTarget',
    'assayType',
    'studyType',
    'relationshipType'
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

    this.order = this.activatedRoute.snapshot.queryParams['order'] || 'root_lastModifiedDate';
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
    //Clear the existing Browse By lists
    this.browseByTargetNameList = [];
    this.browseByTestAgentList = [];
    this.browseByReferenceList = [];

    // Set total Counts to 0
    this.totalCountBrowseTestAgent = 0;
    this.totalCountReference = 0;

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
        this.totalCountBrowseAllAssay = pagingResponse.count;
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


        this.createAllAssayScreeningList();

        this.createTargetNameList();

        this.createTestAgentList();

        this.createReferenceScreeningList();

        // ****** LOOP Results pagingResponse.content ***********
        this.assays.forEach(assay => {
          if (assay) {

            //assay._assayTargetSummaries = [];

            // ******* Get data list for 'Browse by Target Name' tab.
            if (assay.targetName) {

              /*
              // Get the index if the value exists in the key 'targetName'
              const indexTargetName = this.browseTargetNameList.findIndex(record => record.targetName === assay.targetName);
              if (indexTargetName > -1) { // found in the existing list
                let assayReferenceList2 = [];
                assayReferenceList2 = this.browseTargetNameList[indexTargetName].targetNameSummaryList;
                assayReferenceList2.push(assaySummary);
                this.browseTargetNameList[indexTargetName].targetNameSummaryList = assayReferenceList2;
              } else {
                let assayList = [];
                assayList.push(assaySummary);
                const appScreening = { 'targetName': assay.targetName, 'targetNameSummaryList': assayList };
                this.browseTargetNameList.push(appScreening);
              }

              // Get total count for Browse Test Agent/Substance
              this.totalCountBrowseTargetName = this.browseTargetNameList.length;
             */
            } // if assay.targetName exists



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

        // Get list of Export extension options such as .xlsx, .txt
        this.invitroPharmacologyService.getExportOptions(this.etag).subscribe(response => {
          this.exportOptions = response;
        });

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
  }

  createAllAssayScreeningList() {

    this.assays.forEach(assay => {
      if (assay) {
        assay._assayTargetSummaries = [];

        /* Assay Informtion Reference loop */
        assay.invitroAssayScreenings.forEach(screening => {

          // For each assay
          const assaySummary: any = {};
          assaySummary.id = assay.id;
          assaySummary.targetName = assay.targetName;
          assaySummary.bioassayType = assay.bioassayType;
          assaySummary.studyType = assay.studyType;

          /* Invitro Reference Object exists */
          if (screening.invitroReference) {
            assaySummary.referenceSourceTypeNumber = screening.invitroReference.referenceSourceType + ' ' + screening.invitroReference.referenceSourceNumber;
          }

          /* Invitro Test Agent Object exists */
          if (screening.invitroTestAgent) {
            assaySummary.testAgent = screening.invitroTestAgent.testAgent;
            assaySummary.testAgentSubstanceUuid = screening.invitroTestAgent.testAgentSubstanceUuid;
          }

          /* Invitro Assay Result Object exists */
          if (screening.invitroAssayResult) {
            assaySummary.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
            assaySummary.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

            assaySummary.resultValue = screening.invitroAssayResult.resultValue;
            assaySummary.resultValueUnits = screening.invitroAssayResult.resultValueUnits;
          }

          /* LOOP: Invitro Assay Control exists */
          if (screening.invitroControls.length > 0) {
            screening.invitroControls.forEach(ctr => {
              if (ctr) {
                if (ctr.resultType) {
                  assaySummary.calculateIC50Value = this.calculate1C50(ctr.resultType, screening.invitroAssayResult.resultValue, screening.invitroAssayResult.testAgentConcentration);
                }
              }
            });
          }

          // Add/Push screening data into the summary list
          assay._assayTargetSummaries.push(assaySummary);

        }); // LOOP: AssayScreenings
      } // if assay exists
    }); // LOOOP: assays
  }

  createTargetNameList() {
    // Loop through each assay
    this.assays.forEach(assay => {
      if (assay) {

        // For each assay
        const assaySummary: any = {};
        assaySummary.id = assay.id;
        //assaySummary.targetName = assay.targetName;
        assaySummary.bioassayType = assay.bioassayType;
        assaySummary.studyType = assay.studyType;

        /* Assay Informtion Reference loop */
        assay.invitroAssayScreenings.forEach(screening => {

          /* Invitro Assay Result Object exists */
          if (screening.invitroAssayResult) {
            assaySummary.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
            assaySummary.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

            assaySummary.resultValue = screening.invitroAssayResult.resultValue;
            assaySummary.resultValueUnits = screening.invitroAssayResult.resultValueUnits;
          }

          /* Invitro Assay Summary Object exists */
          /*
          if (screening.invitroSummary) {
            assaySummary.relationshipType = screening.invitroSummary.relationshipType;
          } */

          /* LOOP: Invitro Assay Control exists */
          if (screening.invitroControls.length > 0) {
            screening.invitroControls.forEach(ctr => {
              if (ctr) {
                if (ctr.resultType) {
                  assaySummary.calculateIC50Value = this.calculate1C50(ctr.resultType, screening.invitroAssayResult.resultValue, screening.invitroAssayResult.testAgentConcentration);
                }
              }
            });
          }

          /* Invitro Reference Object exists */
          let referenceSourceTypeNumber = '';
          if (screening.invitroReference) {
            referenceSourceTypeNumber = screening.invitroReference.referenceSourceType + ' ' + screening.invitroReference.referenceSourceNumber;
            assaySummary.referenceSourceTypeNumber = referenceSourceTypeNumber;
          } // if invitroReference exists

          /* Invitro Test Agent Object exists */
          if (screening.invitroTestAgent) {
            assaySummary.testAgent = screening.invitroTestAgent.testAgent;
            assaySummary.testAgentSubstanceUuid = screening.invitroTestAgent.testAgentSubstanceUuid;
          } // if invitroTestAgent exists

        }); // LOOP: AssayScreenings

        if (assay.targetName) {
          let targetName = '';
          targetName = assay.targetName;
          assaySummary.targetName = targetName;

          // Get the index if the value exists in the key 'targetName'
          const indexTargetName = this.browseByTargetNameList.findIndex(record => record.targetName === targetName);

          if (indexTargetName > -1) {
            // Add in the exsting card record
            this.browseByTargetNameList[indexTargetName].targetNameSummaryList.push(assaySummary);
          } else {
            // Create new card record
            let assayList = [];
            if (assay.invitroAssayScreenings.length > 0) {
              assayList.push(assaySummary);
            }
            const appScreening = { 'targetName': targetName, 'targetNameSummaryList': assayList };
            this.browseByTargetNameList.push(appScreening);
          } // else

        } // if targetName exists

      } // if assay exists
    }); // LOOOP: assays
  }

  createTestAgentList() {
    // Loop through each assay
    this.assays.forEach(assay => {
      if (assay) {

        /* Assay Informtion Reference loop */
        assay.invitroAssayScreenings.forEach(screening => {

          // For each assay
          const assaySummary: any = {};
          assaySummary.id = assay.id;
          assaySummary.targetName = assay.targetName;
          assaySummary.bioassayType = assay.bioassayType;
          assaySummary.studyType = assay.studyType;

          /* Invitro Assay Result Object exists */
          if (screening.invitroAssayResult) {
            assaySummary.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
            assaySummary.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

            assaySummary.resultValue = screening.invitroAssayResult.resultValue;
            assaySummary.resultValueUnits = screening.invitroAssayResult.resultValueUnits;
          }

          /* Invitro Assay Summary Object exists */
          /*if (screening.invitroSummary) {
            assaySummary.relationshipType = screening.invitroSummary.relationshipType;
          }*/

          /* LOOP: Invitro Assay Control exists */
          if (screening.invitroControls.length > 0) {
            screening.invitroControls.forEach(ctr => {
              if (ctr) {
                if (ctr.resultType) {
                  assaySummary.calculateIC50Value = this.calculate1C50(ctr.resultType, screening.invitroAssayResult.resultValue, screening.invitroAssayResult.testAgentConcentration);
                }
              }
            });
          }

          /* Invitro Reference Object exists */
          let referenceSourceTypeNumber = '';
          if (screening.invitroReference) {
            referenceSourceTypeNumber = screening.invitroReference.referenceSourceType + ' ' + screening.invitroReference.referenceSourceNumber;
            assaySummary.referenceSourceTypeNumber = referenceSourceTypeNumber;
          } // if invitroReference exists


          /* Invitro Test Agent Object exists */
          if (screening.invitroTestAgent) {
            let testAgent = '';
            let testAgentSubstanceUuid = '';
            testAgent = screening.invitroTestAgent.testAgent;
            assaySummary.testAgent = testAgent;
            testAgentSubstanceUuid = screening.invitroTestAgent.testAgentSubstanceUuid;

            // Get the index if the value exists in the key 'testAgent'
            const indexTestAgent = this.browseByTestAgentList.findIndex(record => record.testAgent === testAgent);

            if (indexTestAgent > -1) {
              // Add in the exsting card record
              this.browseByTestAgentList[indexTestAgent].testAgentSummaryList.push(assaySummary);
            } else {
              // Create new card record
              let assayList = [];
              assayList.push(assaySummary);
              const appScreening = { 'testAgent': testAgent, 'testAgentSubstanceUuid': testAgentSubstanceUuid, 'testAgentSummaryList': assayList, 'testAgentScreeningList': assayList };
              this.browseByTestAgentList.push(appScreening);
            } // else
          } // if invitroTestAgent exists

        }); // LOOP: AssayScreenings
      } // if assay exists
    }); // LOOOP: assays
  }

  createReferenceScreeningList() {
    // Loop through each assay
    this.assays.forEach(assay => {
      if (assay) {

        /* Assay Informtion Reference loop */
        assay.invitroAssayScreenings.forEach(screening => {

          // For each assay
          const assaySummary: any = {};
          assaySummary.id = assay.id;
          assaySummary.targetName = assay.targetName;
          assaySummary.bioassayType = assay.bioassayType;
          assaySummary.studyType = assay.studyType;

          /* Invitro Test Agent Object exists */
          if (screening.invitroTestAgent) {
            assaySummary.testAgent = screening.invitroTestAgent.testAgent;
            assaySummary.testAgentSubstanceUuid = screening.invitroTestAgent.testAgentSubstanceUuid;
          }

          /* Invitro Assay Result Object exists */
          if (screening.invitroAssayResult) {
            assaySummary.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
            assaySummary.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

            assaySummary.resultValue = screening.invitroAssayResult.resultValue;
            assaySummary.resultValueUnits = screening.invitroAssayResult.resultValueUnits;
          }

          /* Invitro Assay Summary Object exists */
          /*if (screening.invitroSummary) {
            assaySummary.relationshipType = screening.invitroSummary.relationshipType;
          }*/

          /* LOOP: Invitro Assay Control exists */
          if (screening.invitroControls.length > 0) {
            screening.invitroControls.forEach(ctr => {
              if (ctr) {
                if (ctr.resultType) {
                  assaySummary.calculateIC50Value = this.calculate1C50(ctr.resultType, screening.invitroAssayResult.resultValue, screening.invitroAssayResult.testAgentConcentration);
                }
              }
            });
          }

          /* Invitro Reference Object exists */
          let referenceSourceTypeNumber = '';
          if (screening.invitroReference) {
            referenceSourceTypeNumber = screening.invitroReference.referenceSourceType + ' ' + screening.invitroReference.referenceSourceNumber;
            assaySummary.referenceSourceTypeNumber = referenceSourceTypeNumber;

            // Get the index if the value exists in the key 'referenceSourceTypeNumber'
            const sourceFoundIndex = this.browseByReferenceList.findIndex(record => record.referenceSourceTypeNumber === referenceSourceTypeNumber);

            // If referenceSourceTypeNumber value found in the existing browser list, add the current assay.
            if (sourceFoundIndex > -1) {
              this.browseByReferenceList[sourceFoundIndex].referenceSummaryList.push(assaySummary);
            } else {
              let referenceSummaryList = [];
              referenceSummaryList.push(assaySummary);

              const appScreening = { 'referenceSourceTypeNumber': referenceSourceTypeNumber, 'referenceSummaryList': referenceSummaryList };
              this.browseByReferenceList.push(appScreening);
            } // else

          } // if invitroReference exists

        }); // LOOP: AssayScreenings
      } // if assay exists
    }); // LOOOP: assays
  }

  createSummaryList(assay: any): any {
    if (assay) {

      /* Assay Informtion Reference loop */
      assay.invitroInformationReferences.forEach(infoRef => {

        // For each assay
        const assaySummary: any = {};
        assaySummary.id = assay.id;
        assaySummary.targetName = assay.targetName;
        assaySummary.bioassayType = assay.bioassayType;
        assaySummary.studyType = assay.studyType;

        if (infoRef.invitroReference) {

          if ((infoRef.invitroReference.referenceApplicationType) || (infoRef.invitroReference.referenceSourceNumber)) {
            let referenceSourceTypeNumber = infoRef.invitroReference.referenceSourceType + ' ' + infoRef.invitroReference.referenceSourceNumber;

            assaySummary.referenceSourceTypeNumber = referenceSourceTypeNumber;
          }
        }

        infoRef.invitroAssayInfoRefTestAgents.forEach(infoRefTestAgent => {

          // LOOP: Invitro Result
          let testAgentConcentration;
          let testAgentConcentrationUnits = '';
          let resultValue;
          let resultValueUnits = '';

          // Invitro Result loop
          infoRefTestAgent.invitroAssayResult.forEach(result => {
            if (result) {

              testAgentConcentration = result.testAgentConcentration;
              testAgentConcentrationUnits = result.testAgentConcentrationUnits;
              resultValue = result.resultValue;
              resultValueUnits = result.resultValueUnits;

              // Invitro Summary
              // if (result.invitroSummary) {
              //    assaySummary.relationshipType = result.invitroSummary.relationshipType;
              //  }
            }
          });

          // if Test Agent exists
          if (infoRefTestAgent.invitroTestAgent) {
            if (infoRefTestAgent.invitroTestAgent.testAgent) {

              let sourceTypeNumber = '';
              if (infoRef.invitroReference) {
                if ((infoRef.invitroReference.referenceApplicationType) || (infoRef.invitroReference.referenceSourceNumber)) {
                  sourceTypeNumber = infoRef.invitroReference.referenceApplicationType + ' ' + infoRef.invitroReference.referenceSourceNumber;
                }
              }

              assaySummary.testAgent = infoRefTestAgent.invitroTestAgent.testAgent;

              // Create row/object for All Assay Summary View
              let assaySum = this.createSummaryObject(assay, sourceTypeNumber, infoRefTestAgent.invitroTestAgent.testAgent, testAgentConcentration, testAgentConcentrationUnits, resultValue, resultValueUnits);

            } // if testAgent exists
          } // if invitroTestAgent exists

        }); // LOOP: invitroAssayInfoRefTestAgents
      }); // LOOP: invitroInformationReferences
    } // if assay exists
  }

  createSummaryObject(assay: any, referenceSource: string, testAgent: string, testAgentConcentration: string,
    testAgentConcentrationUnits: string, resultValue: string, resultValueUnits: string): any {
    const assaySummary: any = {};
    assaySummary.id = assay.id;
    assaySummary.targetName = assay.targetName;
    assaySummary.bioassayType = assay.bioassayType;
    assaySummary.studyType = assay.studyType;
    assaySummary.referenceSource = referenceSource;
    assaySummary.testAgent = testAgent;
    assaySummary.testAgentConcentration = testAgentConcentration;
    assaySummary.testAgentConcentrationUnits = testAgentConcentrationUnits;
    assaySummary.resultValue = resultValue;
    assaySummary.resultValueUnits = resultValueUnits;

    return assaySummary;

    // Add to the All Assay Summary List
    //assay._assayTargetSummaries.push(assaySummary);
  }

  calculate1C50(valueType, percentInhibition, testAgentConcentration): string {
    let calculateIC50 = '';
    // if percentInhibition/resultValue < 30, then IC50 > Test Agent Concentration
    // if percentInhibition/resultValue between 30 and 60, then IC50 approx. = Test Agent Concentration
    // if percentInhibition/resultValue above 60, then IC50 < Test Agent Concentration
    if (percentInhibition) {
      if (percentInhibition < 30) {
        calculateIC50 = valueType + ' > ' + testAgentConcentration;
      } else if (percentInhibition >= 30 && percentInhibition <= 60) {
        calculateIC50 = valueType + ' approx. = ' + testAgentConcentration;
      } else if (percentInhibition > 60) {
        calculateIC50 = valueType + ' < ' + testAgentConcentration;
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

  saveJSON(id: number): void {
    let json = this.assays[id];
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(JSON.stringify(json)));
    this.downloadJsonHref = uri;

    const date = new Date();
    this.jsonFileName = 'Invitro_Pharmacology_Assay_' + id + '_' + moment(date).format('MMM-DD-YYYY_H-mm-ss');
  }

  export(extension: string) {
    if (this.etag) {
      let entity = this.invitroPharmacologyService.invitroPharmEntityEndpoint;
      const url1 = this.getApiExportUrl(this.etag, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
          // height: '215x',
          width: '700px',
          data: { 'extension': extension, 'type': 'BrowseInvitroPharmacology', 'entity': entity, 'hideOptionButtons': true }
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
                  totalSub: this.totalCountAllAssay
                }
              };
              const params = { 'total': this.totalCountAllAssay };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.invitroPharmacologyService.getApiExportUrl(etag, extension);
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
