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
import { InvitroAssayInformation } from '../../model/invitro-pharmacology.model';

@Component({
  selector: 'app-invitro-pharmacology-details-testagent',
  templateUrl: './invitro-pharmacology-details-testagent.component.html',
  styleUrls: ['./invitro-pharmacology-details-testagent.component.scss']
})

export class InvitroPharmacologyDetailsTestagentComponent implements OnInit {

  view = 'cards';
  public privateSearchTerm?: string;

  order: string;
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
  testAgentListForBrowse: Array<any> = [];
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
  ascDescDir = 'desc';

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

  testAgentSummaryColumns: string[] = [
    'viewDetails',
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


  public assays: Array<InvitroAssayInformation>;

  ngOnInit(): void {
    this.getAssayByTestAgent();
  }

  getAssayByTestAgent() {

    this.loadingService.setLoading(true);
    ////const skip = this.pageIndex * this.pageSize;

    this.privateSearchTerm = "root_invitroInformationReferences_invitroAssayInfoRefTestAgents_invitroTestAgent_testAgent:" + 'BAF312';

    const subscription = this.invitroPharmacologyService.getAssayByTestAgent('BAF312')
      .subscribe(response => {
        this.assays = response;

        // ****** LOOP Results pagingResponse.content ***********
        this.assays.forEach(assay => {
          if (assay) {

            assay._assayTargetSummaries = [];

            // ******* Get data list for 'Browse by Target Name' tab.
            if (assay.targetName) {
            }
          }
        });
      });
   // } // if assay exists
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
