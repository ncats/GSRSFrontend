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
import { UtilsService } from '../../../../core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { ConfigService } from '@gsrs-core/config';
import { Facet, FacetsManagerService, FacetUpdateEvent } from '@gsrs-core/facets-manager';
import { GeneralService } from '../../../service/general.service';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { FacetParam } from '@gsrs-core/facets-manager';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';
import { NarrowSearchSuggestion } from '@gsrs-core/utils';
import { environment } from '../../../../../environments/environment';
import { StructureImageModalComponent } from '@gsrs-core/structure';

/* Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../../service/invitro-pharmacology.service'
import { InvitroAssayInformation, InvitroAssayScreening } from '../../model/invitro-pharmacology.model';
import { invitroPharmacologySearchSortValues } from '../../invitro-pharmacology-browse/invitro-pharmacology-search-sort-values';

@Component({
  selector: 'app-invitro-pharmacology-details-testagent',
  templateUrl: './invitro-pharmacology-details-testagent.component.html',
  styleUrls: ['./invitro-pharmacology-details-testagent.component.scss']
})

export class InvitroPharmacologyDetailsTestagentComponent implements OnInit {

  allAssaysList: Array<InvitroAssayInformation> = [];
  allScreeningTestAgents: Array<any> = [];

  showSpinner = false;
  //view = 'cards';
  public privateSearchTerm?: string;

  view = 'all-assays';
  ascDescDir = 'desc';

  order: string;
  public sortValues = invitroPharmacologySearchSortValues;

  pageIndex: number;
  pageSize: number;
  jumpToValue: string;

  pageIndexReference = 0;
  pageSizeReference: number;

  totalCountAllAssay: number;
  totalCountBrowseAllAssay: number;
  totalCountBrowseTargetName: number;
  totalCountBrowseTestAgent: number;
  totalCountSearchReference: number;

  totalCountAssayTarget: number;
  totalCountSubstance: number;
  totalCountReference: number;

  calculateIc50: string;
  tabSelectedIndex = 0;
  viewTabSelectedIndex = 0;
  displayCategory = 'summary';

  targetSummaries: any;
  // assayTargetSummary: Array<any> = [];

  testAgentLists: Array<any> = [];
  applicationTypeNumLists: Array<any> = [];

  // Lists of data for Browse tabs
  testAgentList: Array<any> = [];
  browseTargetNameList: Array<any> = [];
  browseSubstanceList: Array<any> = [];
  browseByReferenceList: Array<any> = [];

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

  allAssayColumns: string[] = [
    'number',
    'viewDetails',
    'totalScreening',
    'testAgent',
    'assayId',
    'externalAssayId',
    'externalAssaySource',
    'targetTitle',
    'targetName',
    'humanHomologTargetName',
    'studyType',
    'bioassayType',
    'modifyDate'
  ];

  testAgentSummaryColumns: string[] = [
    'viewDetails',
    'referenceSource',
    'testAgent',
    'targetName',
    'testAgentConcentration',
    'resultValue',
    /*'calculatedValue',
    'assayTarget',*/
    //'assayType',
    'studyType',
    // 'relationshipType'
  ];

  assaySummaryDisplayedColumns: string[] = [
    /*  'referenceSource', */
    'targetName',
    /* 'testAgentConcentration',
     'resultValue',
     'calculatedValue',
     'assayType',*/
    'studyType'
  ];

  assayTargetSummaryDisplayedColumns: string[] = [
    'viewDetails',
    'targetName',
    'testAgentConcentration',
    'calculatedValue',
    'relationshipType',
    'referenceSource'
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
    private configService: ConfigService,
    private authService: AuthService,
    private utilsService: UtilsService,
    private loadingService: LoadingService,
    private facetManagerService: FacetsManagerService,
    private mainNotificationService: MainNotificationService,
    private generalService: GeneralService,
    private invitroPharmacologyService: InvitroPharmacologyService,
    private titleService: Title,
    private overlayContainerService: OverlayContainer,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) { }

  public assays: Array<InvitroAssayInformation>;

  ngOnInit(): void {
    // Check Login
    const authSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
      }
      this.isAdmin = this.authService.hasAnyRoles('Admin', 'Updater', 'SuperUpdater');
    });
    this.subscriptions.push(authSubscription);

    this.view = this.activatedRoute.snapshot.queryParams['view'];

    if (this.view && this.view === 'all-assays') {
      this.getAllAssays();
    } else if (this.view && this.view === 'all-testagents') {
      this.getAssayByTestAgent();
    } else {
      this.getAllAssays();
    }
  }

  getAllAssays(): void {
    this.showSpinner = true;  // Start progress spinner
    this.loadingService.setLoading(true);
    this.titleService.setTitle(`View All Assays`);

    const invitroSubscribe = this.invitroPharmacologyService.getAllAssays().subscribe(response => {
      this.assays = response;
      this.allAssaysList = response;
    }, error => {
      this.loadingService.setLoading(false);
      this.showSpinner = false;  // Stop progress spinner
    }, () => {
      this.subscriptions.push(invitroSubscribe);
      this.loadingService.setLoading(false);
      this.showSpinner = false;  // Stop progress spinner
    });
  }

  getAssayByTestAgent() {
    this.showSpinner = true;  // Start progress spinner
    this.loadingService.setLoading(true);
    this.titleService.setTitle(`View All Test Agents`);

    const invitroSubscribe = this.invitroPharmacologyService.getAllAssays().subscribe(response => {
      this.assays = response;
      this.allAssaysList = response;

      //this.privateSearchTerm = "root_invitroInformationReferences_invitroAssayInfoRefTestAgents_invitroTestAgent_testAgent:" + 'BAF312';

      // ****** LOOP Results pagingResponse.content ***********
      this.assays.forEach(assay => {
        if (assay) {

          const assaySummary: any = {};
          assaySummary.id = assay.id;
          assaySummary.targetName = assay.targetName;
          assaySummary.bioassayType = assay.bioassayType;
          assaySummary.studyType = assay.studyType;

          assay.invitroAssayScreenings.forEach(screening => {
            if (screening.invitroTestAgent) {

              if (screening.invitroTestAgent.testAgent) {

                if (screening.invitroAssayResult) {
                  assaySummary.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
                  assaySummary.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

                  assaySummary.resultValue = screening.invitroAssayResult.resultValue;
                  assaySummary.resultValueUnits = screening.invitroAssayResult.resultValueUnits;
                }

                if (screening.invitroReference) {
                  let referenceSourceTypeNumber = screening.invitroReference.referenceSourceType + ' ' + screening.invitroReference.referenceSourceNumber;
                  assaySummary.referenceSourceTypeNumber = referenceSourceTypeNumber;
                } // if invitroReference exists

                /* Invitro Test Agent Object exists */
                let testAgent = '';
                let testAgentSubstanceUuid = '';
                testAgent = screening.invitroTestAgent.testAgent;
                assaySummary.testAgent = testAgent;
                testAgentSubstanceUuid = screening.invitroTestAgent.testAgentSubstanceUuid;

                // Get the index if the value exists in the key 'testAgent'
                const indexTestAgent = this.allScreeningTestAgents.findIndex(record => record.testAgent === testAgent);

                if (indexTestAgent > -1) {
                  // Add in the exsting card record
                  this.allScreeningTestAgents[indexTestAgent].testAgentSummaryList.push(assaySummary);
                } else {

                  // Create new card record
                  let assayList = [];
                  assayList.push(assaySummary);
                  const appScreening = { 'testAgent': testAgent, 'testAgentSubstanceUuid': testAgentSubstanceUuid, 'testAgentSummaryList': assayList };
                  this.allScreeningTestAgents.push(appScreening);
                } // else

              } // testAgent exists

            } // if invitroTestAgent exists

          }); // LOOP: invitroAssayScreenings

          // ******* Get data list for 'Browse by Target Name' tab.
          if (assay.targetName) {
          }

          //his.testAgentList.push(assaySummary);
        }  // if assay exists
      });  // LOOP: assays

    }, error => {
      this.loadingService.setLoading(false);
      this.showSpinner = false;  // Stop progress spinner
    }, () => {
      this.subscriptions.push(invitroSubscribe);
      this.loadingService.setLoading(false);
      this.showSpinner = false;  // Stop progress spinner
    });
  }

  createTestAgentLists() {
    // ****** LOOP Results pagingResponse.content ***********
    this.allScreeningTestAgents.forEach(assay => {
      if (assay) {
        const assaySummary: any = {};
        assaySummary.id = assay.id;
        assaySummary.targetName = assay.targetName;
        assaySummary.bioassayType = assay.bioassayType;
        assaySummary.studyType = assay.studyType;

        assay.invitroAssayScreenings.forEach(screening => {
          if (screening.invitroTestAgent) {
            if (screening.invitroTestAgent.testAgent && screening.invitroTestAgent.testAgent === 'BAF312') {
              assaySummary.testAgent = screening.invitroTestAgent.testAgent;

              if (screening.invitroAssayResult) {
                assaySummary.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
                assaySummary.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

                assaySummary.resultValue = screening.invitroAssayResult.resultValue;
                assaySummary.resultValueUnits = screening.invitroAssayResult.resultValueUnits;
              }

              if (screening.invitroReference) {
                let referenceSourceTypeNumber = screening.invitroReference.referenceSourceType + ' ' + screening.invitroReference.referenceSourceNumber;
                assaySummary.referenceSourceTypeNumber = referenceSourceTypeNumber;
              } // if invitroReference exists
            }
          }
        });

        // ******* Get data list for 'Browse by Target Name' tab.
        if (assay.targetName) {
        }

        this.testAgentList.push(assaySummary);
      } // if assay
    });

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

}
