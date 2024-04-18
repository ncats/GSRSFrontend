import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Location, LocationStrategy } from '@angular/common';
import { Title, DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { OverlayContainer } from '@angular/cdk/overlay';
import { PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import * as moment from 'moment';

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

  public sortValues = invitroPharmacologySearchSortValues;
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
  totalCountReference: number;

  calculateIC50Value: string;
  tabSelectedIndex = 0;
  viewTabSelectedIndex = 0;

  downloadJsonHref: any;
  jsonFileName: string;

  // Constants
  view = 'cards';
  displayCategory = 'summary';
  ascDescDir = 'desc';
  exportOptions: Array<any>;
  public privateSearchTerm?: string;
  order: string;
  pageIndex: number;
  pageSize: number;
  skip: number;
  isLoading = true;
  isError = false;
  isAdmin: boolean;
  isLoggedIn = false;
  dataSource = [];
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

  assayAllScreeningDisplayedColumns: string[] = [
    'viewDetails',
    'referenceSource',
    'testAgent',
    'testAgentConcentration',
    'resultValue',
    'calculatedValue',
    'controls'
  ];

  assayTargetScreeningDisplayedColumns: string[] = [
    'viewDetails',
    'referenceSource',
    'testAgent',
    'externalAssaySource',
    'externalAssayId',
    'bioassayType',
    'studyType',
    'testAgentConcentration',
    'resultValue',
    'calculatedValue',
    'controls'
  ];

  testAgentScreeningColumns: string[] = [
    'viewDetails',
    'referenceSource',
    'assayTargetName',
    'bioassayType',
    'studyType',
    'testAgentConcentration',
    'resultValue',
    'calculatedValue',
    'controls'
  ];

  testAgentSummaryColumns: string[] = [
    'viewDetails',
    'isFromResult',
    'referenceSource',
    'testAgent',
    'assayTarget',
    'bioassayType',
    'studyType',
    'resultValue',
    'resultType',
    'relationshipType',
    'interactionType'
  ];

  referenceScreeningColumns: string[] = [
    'viewDetails',
    'testAgent',
    'assayTargetName',
    'bioassayType',
    'studyType',
    'testAgentConcentration',
    'resultValue',
    'calculatedValue',
    'controls'
  ];

  controlColumns: string[] = [
    'control',
    'controlType',
    'controlReferenceValue',
    'resultType'
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

    this.order = this.activatedRoute.snapshot.queryParams['order'] || 'root_modifiedDate';
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
    this.skip = this.pageIndex * this.pageSize;
    const subscription = this.invitroPharmacologyService.getInvitroPharmacology(
      this.order,
      this.skip,
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

        } // for each paging facets

        this.createAllAssayScreeningList();

        this.createTargetNameList();

        this.createTestAgentList();

        this.createReferenceScreeningList();

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
  }

  createAllAssayScreeningList() {

    this.assays.forEach(assay => {
      if (assay) {
        assay._assayTargetSummaries = [];

        /* Assay Informtion Reference loop */
        assay.invitroAssayScreenings.forEach(screening => {

          // For each assay
          const assayObj: any = {};
          assayObj.id = assay.id;
          assayObj.targetName = assay.targetName;
          assayObj.targetNameSubstanceUuid = assay.targetNameSubstanceUuid;
          assayObj.bioassayType = assay.bioassayType;
          assayObj.studyType = assay.studyType;

          if (screening.invitroAssayResultInformation) {

            /* Invitro Reference Object exists */
            let referenceSourceTypeNumber = '';
            let referenceSourceType = '';
            let referenceSource = '';

            if (screening.invitroAssayResultInformation.invitroReference) {
              if (screening.invitroAssayResultInformation.invitroReference.referenceSourceType) {
                referenceSourceType = screening.invitroAssayResultInformation.invitroReference.referenceSourceType;
              }
              if (screening.invitroAssayResultInformation.invitroReference.referenceSource) {
                referenceSource = screening.invitroAssayResultInformation.invitroReference.referenceSource;
              }

              referenceSourceTypeNumber = referenceSourceType + ' ' + referenceSource;
              assayObj.referenceSourceTypeNumber = referenceSourceTypeNumber;
            }

            /* Invitro Test Agent Object exists */
            if (screening.invitroAssayResultInformation.invitroTestAgent) {
              assayObj.testAgent = screening.invitroAssayResultInformation.invitroTestAgent.testAgent;
              assayObj.testAgentSubstanceUuid = screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid;
            }

          } // invitroAssayResultInformation exists

          /* Invitro Assay Result Object exists */
          if (screening.invitroAssayResult) {
            assayObj.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
            assayObj.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

            assayObj.resultValue = screening.invitroAssayResult.resultValue;
            assayObj.resultValueUnits = screening.invitroAssayResult.resultValueUnits;

            assayObj.calculateIC50Value = this.calculate1C50Value(screening.invitroAssayResult.testAgentConcentration, screening.invitroAssayResult.resultValue);
          }

          /* Invitro Assay Control exists */
          if (screening.invitroControls.length > 0) {
            assayObj.controls = screening.invitroControls;
          }

          // Add/Push screening data into the summary list
          assay._assayTargetSummaries.push(assayObj);

        }); // LOOP: AssayScreenings
      } // if assay exists
    }); // LOOOP: assays
  }

  createTargetNameList() {
    // Loop through each assay
    this.assays.forEach(assay => {
      if (assay) {

        /* Assay Informtion Reference loop */
        assay.invitroAssayScreenings.forEach(screening => {

          // For each assay
          const assayObj: any = {};
          assayObj.id = assay.id;
          assayObj.externalAssaySource = assay.externalAssaySource;
          assayObj.externalAssayId = assay.externalAssayId;
          assayObj.bioassayType = assay.bioassayType;
          assayObj.studyType = assay.studyType;

          /* Invitro Assay Result Object exists */
          if (screening.invitroAssayResult) {
            assayObj.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
            assayObj.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

            assayObj.resultValue = screening.invitroAssayResult.resultValue;
            assayObj.resultValueUnits = screening.invitroAssayResult.resultValueUnits;

            /* Calculate IC50 Value */
            assayObj.calculateIC50Value = this.calculate1C50Value(screening.invitroAssayResult.testAgentConcentration, screening.invitroAssayResult.resultValue);

          }

          /* Invitro Assay Control exists */
          if (screening.invitroControls.length > 0) {
            assayObj.controls = screening.invitroControls;
          }

          if (screening.invitroAssayResultInformation) {
            /* Invitro Reference Object exists */
            let referenceSourceTypeNumber = '';
            let referenceSourceType = '';
            let referenceSource = '';

            if (screening.invitroAssayResultInformation.invitroReference) {
              if (screening.invitroAssayResultInformation.invitroReference.referenceSourceType) {
                referenceSourceType = screening.invitroAssayResultInformation.invitroReference.referenceSourceType;
              }
              if (screening.invitroAssayResultInformation.invitroReference.referenceSource) {
                referenceSource = screening.invitroAssayResultInformation.invitroReference.referenceSource;
              }

              referenceSourceTypeNumber = referenceSourceType + ' ' + referenceSource;
              assayObj.referenceSourceTypeNumber = referenceSourceTypeNumber;
            } // if invitroReference exists


            /* Invitro Test Agent Object exists */
            if (screening.invitroAssayResultInformation.invitroTestAgent) {
              assayObj.testAgent = screening.invitroAssayResultInformation.invitroTestAgent.testAgent;
              assayObj.testAgentSubstanceUuid = screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid;
            } // if invitroTestAgent exists

          } //  if invitroAssayResultInformation exists

          if (assay.targetName) {
            let targetName = '';
            targetName = assay.targetName;
            assayObj.targetName = targetName;
            assayObj.targetNameSubstanceUuid = assay.targetNameSubstanceUuid;

            // Get the index if the value exists in the key 'targetName'
            const indexTargetName = this.browseByTargetNameList.findIndex(record => record.targetName === targetName);

            if (indexTargetName > -1) {
              // Add in the exsting card record
              this.browseByTargetNameList[indexTargetName].targetNameSummaryList.push(assayObj);
            } else {
              // Create new card record
              let assayList = [];
              if (assay.invitroAssayScreenings.length > 0) {
                assayList.push(assayObj);
              }
              const appScreening = { 'targetName': targetName, 'targetNameSummaryList': assayList };
              this.browseByTargetNameList.push(appScreening);
            } // else

          } // if targetName exists

        }); // LOOP: AssayScreenings


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
          const assayObj: any = {};
          assayObj.id = assay.id;
          assayObj.targetName = assay.targetName;
          assayObj.targetNameSubstanceUuid = assay.targetNameSubstanceUuid
          assayObj.bioassayType = assay.bioassayType;
          assayObj.studyType = assay.studyType;

          if (screening.invitroAssayResultInformation) {

            /* Invitro Reference Object exists */
            if (screening.invitroAssayResultInformation.invitroReference) {
              let referenceSourceTypeNumber = '';
              let referenceSourceType = '';
              let referenceSource = '';
              if (screening.invitroAssayResultInformation.invitroReference.referenceSourceType) {
                referenceSourceType = screening.invitroAssayResultInformation.invitroReference.referenceSourceType;
              }
              if (screening.invitroAssayResultInformation.invitroReference.referenceSource) {
                referenceSource = screening.invitroAssayResultInformation.invitroReference.referenceSource;
              }

              referenceSourceTypeNumber = referenceSourceType + ' ' + referenceSource;
              assayObj.referenceSourceTypeNumber = referenceSourceTypeNumber;
            } // if invitroReference exists

          } //  if invitroAssayResultInformation exists


          /* Invitro Assay Result Object exists */
          if (screening.invitroAssayResult) {
            assayObj.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
            assayObj.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

            assayObj.resultValue = screening.invitroAssayResult.resultValue;
            assayObj.resultValueUnits = screening.invitroAssayResult.resultValueUnits;

            // Calculate IC50 Value
            assayObj.calculateIC50Value = this.calculate1C50Value(screening.invitroAssayResult.testAgentConcentration, screening.invitroAssayResult.resultValue);
          } // Result exists

          /* Invitro Assay Control exists */
          if (screening.invitroControls.length > 0) {
            assayObj.controls = screening.invitroControls;
          }

          /* Invitro Assay Summary exists */
          let summaryList: Array<any> = [];
          let summaryObj: any = null;;

          if (screening.invitroSummary) {

            summaryObj = {};

            // summaryObj = assayObj;
            // summaryObj.summary = screening.invitroSummary;

            if (screening.invitroAssayResultInformation) {
              if (screening.invitroAssayResultInformation.invitroTestAgent) {
                summaryObj.testAgent = screening.invitroAssayResultInformation.invitroTestAgent.testAgent;
                summaryObj.testAgentSubstanceUuid = screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid;
              }
            }

            summaryObj.id = assayObj.id;
            summaryObj.referenceSourceTypeNumber = assayObj.referenceSourceTypeNumber;
            summaryObj.targetName = assayObj.targetName;
            summaryObj.bioassayType = assayObj.bioassayType;
            summaryObj.studyType = assayObj.studyType;

            summaryObj.summaryResultValueAvg = screening.invitroSummary.resultValueAverage;
            summaryObj.summaryResultValueLow = screening.invitroSummary.resultValueLow;
            summaryObj.summaryResultValueHigh = screening.invitroSummary.resultValueHigh;
            summaryObj.summaryResultValueUnits = screening.invitroSummary.resultValueUnits;

            summaryObj.resultType = screening.invitroSummary.resultType;
            summaryObj.relationshipType = screening.invitroSummary.relationshipType;
            summaryObj.interactionType = screening.invitroSummary.interactionType;

            summaryObj.isFromResult = screening.invitroSummary.isFromResult;

            assayObj.summary = summaryObj;

            assayObj.summaries = [];
            assayObj.summaries.push(summaryObj);

            summaryList.push(summaryObj);
          }

          /* Invitro Test Agent Object exists */
          if (screening.invitroAssayResultInformation) {
            if (screening.invitroAssayResultInformation.invitroTestAgent) {
              let testAgent = '';
              let testAgentSubstanceUuid = '';

              testAgent = screening.invitroAssayResultInformation.invitroTestAgent.testAgent;
              assayObj.testAgent = testAgent;
              testAgentSubstanceUuid = screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid;
              let testAgentId = screening.invitroAssayResultInformation.invitroTestAgent.id;

              // Get the index if the value exists in the key 'testAgent'
              const indexTestAgent = this.browseByTestAgentList.findIndex(record => record.testAgent === testAgent);

              if (indexTestAgent > -1) {
                // Add in the exsting card record
                this.browseByTestAgentList[indexTestAgent].testAgentScreeningList.push(assayObj);
                if (summaryObj == null) {
                }
                if (summaryObj != null) {
                  this.browseByTestAgentList[indexTestAgent].testAgentSummaryList.push(summaryObj);
                }
              } else {
                // Create new card record
                let assayList = [];
                assayList.push(assayObj);
                const appScreening = { 'testAgent': testAgent, 'testAgentSubstanceUuid': testAgentSubstanceUuid, 'testAgentId': testAgentId,
                'testAgentScreeningList': assayList, 'testAgentSummaryList': summaryList };
                this.browseByTestAgentList.push(appScreening);
              } // else
            } // if invitroTestAgent exists
          } // if invitroAssayResultInformation exits

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

          /* Invitro Assay Result Object exists */
          if (screening.invitroAssayResult) {
            assaySummary.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
            assaySummary.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

            assaySummary.resultValue = screening.invitroAssayResult.resultValue;
            assaySummary.resultValueUnits = screening.invitroAssayResult.resultValueUnits;

            /* Calculate IC50 Value */
            assaySummary.calculateIC50Value = this.calculate1C50Value(screening.invitroAssayResult.testAgentConcentration, screening.invitroAssayResult.resultValue);
          }

          /* Invitro Assay Control exists */
          if (screening.invitroControls.length > 0) {
            assaySummary.controls = screening.invitroControls;
          }

          if (screening.invitroAssayResultInformation) {

            /* Invitro Test Agent Object exists */
            if (screening.invitroAssayResultInformation.invitroTestAgent) {
              assaySummary.testAgent = screening.invitroAssayResultInformation.invitroTestAgent.testAgent;
              assaySummary.testAgentSubstanceUuid = screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid;
            }

            /* Invitro Reference Object exists */
            let referenceSourceTypeNumber = '';
            let referenceSourceType = '';
            let referenceSource = '';
            if (screening.invitroAssayResultInformation.invitroReference) {
              if (screening.invitroAssayResultInformation.invitroReference.referenceSourceType) {
                referenceSourceType = screening.invitroAssayResultInformation.invitroReference.referenceSourceType;
              }
              if (screening.invitroAssayResultInformation.invitroReference.referenceSource) {
                referenceSource = screening.invitroAssayResultInformation.invitroReference.referenceSource;
              }

              referenceSourceTypeNumber = referenceSourceType + ' ' + referenceSource;
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

          } // invitroAssayResultInformation

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

  calculate1C50Value(testAgentConcentration: number, resultValue: number): string {
    let resultType = 'IC50';
    let calculateIC50Value = '';
    // resultType = IC50
    // if percentInhibition/resultValue < 30, then IC50 > Test Agent Concentration
    // if percentInhibition/resultValue between 30 and 60, then IC50 approx. = Test Agent Concentration
    // if percentInhibition/resultValue above 60, then IC50 < Test Agent Concentration
    if (resultValue) {
      if (resultValue < 30) {
        calculateIC50Value = resultType + ' > ' + testAgentConcentration;
      } else if (resultValue >= 30 && resultValue <= 60) {
        calculateIC50Value = resultType + ' approx. = ' + testAgentConcentration;
      } else if (resultValue > 60) {
        calculateIC50Value = resultType + ' < ' + testAgentConcentration;
      }
    }

    return calculateIC50Value;
  }

  setSearchTermValue() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.searchInvitroAssay();
  }

  get searchTerm(): string {
    return this.privateSearchTerm;
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

  processSubstanceSearch(searchValue: string) {
    this.privateSearchTerm = searchValue;
    this.setSearchTermValue();
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

  increaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = '1002';
  }

  decreaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = null;
  }

  editAdvancedSearch(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'Browse In-vitro Pharmacology search term' :
      `${this.privateSearchTerm}`;

    const navigationExtras: NavigationExtras = {
      queryParams: {
        'g-search-hash': this.searchTermHash.toString()
      }
    };

    this.router.navigate(['/advanced-search'], navigationExtras);
  }

  updateView(event): void {
    // this.gaService.sendEvent('adverseeventptsContent', 'button:view-update', event.value);
    this.view = event.value;
  }

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

  openModalControls(controlTemplate) {

    const dialogRef = this.dialog.open(controlTemplate, {
      minWidth: '70%',
      maxWidth: '90%'
    });

    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  openModalSummary(summaryTemplate) {

    const dialogRef = this.dialog.open(summaryTemplate, {
      minWidth: '80%',
      maxWidth: '90%'
    });

    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  openImageModal($event, subUuid: string): void {
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

  close() {
    this.dialog.closeAll();
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
