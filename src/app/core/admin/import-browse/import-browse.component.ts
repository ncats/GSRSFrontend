import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  HostListener,
  OnDestroy,
  TemplateRef,
  Inject,
  ComponentFactoryResolver,
  ViewChildren,
  QueryList
} from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSidenav } from '@angular/material/sidenav';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { StructureService, StructureImageModalComponent } from '@gsrs-core/structure';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NarrowSearchSuggestion, PagingResponse, searchSortValues, UtilsService } from '@gsrs-core/utils';
import { FacetParam, Facet, FacetUpdateEvent } from '@gsrs-core/facets-manager';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';
import { SubstanceTextSearchService } from '@gsrs-core/substance-text-search/substance-text-search.service';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
// eslint-disable-next-line max-len
import { BrowseHeaderDynamicSectionDirective } from '@gsrs-core/substances-browse/browse-header-dynamic-section/browse-header-dynamic-section.directive';
import { DYNAMIC_COMPONENT_MANIFESTS, DynamicComponentManifest } from '@gsrs-core/dynamic-component-loader';
import { SubstanceBrowseHeaderDynamicContent } from '@gsrs-core/substances-browse/substance-browse-header-dynamic-content.component';
import { Title } from '@angular/platform-browser';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { FormControl } from '@angular/forms';
import { WildcardService } from '@gsrs-core/utils/wildcard.service';
import { I } from '@angular/cdk/keycodes';
import { SubstanceDetail, SubstanceName, SubstanceCode, SubstanceService } from '@gsrs-core/substance';
import { ConfigService } from '@gsrs-core/config';
import { SubBrowseEmitterService } from '@gsrs-core/substances-browse/sub-browse-emitter.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService, AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';
import { environment } from '@environment/environment.cbg.prod';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { BulkActionDialogComponent } from '@gsrs-core/admin/import-browse/bulk-action-dialog/bulk-action-dialog.component';
import { ImportScrubberComponent } from '@gsrs-core/admin/import-management/import-scrubber/import-scrubber.component';

@Component({
  selector: 'app-import-browse',
  templateUrl: './import-browse.component.html',
  styleUrls: ['./import-browse.component.scss']
})
export class ImportBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  private privateSearchTerm?: string;
  private privateStructureSearchTerm?: string;
  private privateSequenceSearchTerm?: string;
  private privateBulkSearchQueryId?: number;
  private privateBulkSearchStatusKey?: string;
  private privateBulkSearchSummary?: any;
  private privateSearchType?: string;
  private privateSearchStrategy?: string;
  private privateSearchCutoff?: number;
  private privateSearchSeqType?: string;
  private privateSequenceSearchKey?: string;

  public substances: Array<any> = [];
 records: Array<any> = [];

  public exactMatchSubstances: Array<SubstanceDetail>;

  searchOnIdentifiers: boolean;
  searchEntity: string;
  pageIndex: number;
  pageSize: number;
  test: any;
  pageCount: number;
  invalidPage = false;
  totalSubstances: number;
  isLoading = true;
  lastPage: number;
  etag: string;
  privateExport = false;
  message: string;
  disableExport = false;
  isError = false;
  isRefresher = false;
  @ViewChildren(BrowseHeaderDynamicSectionDirective) dynamicContentContainer: QueryList<BrowseHeaderDynamicSectionDirective>;
  @ViewChild('matSideNavInstance', { static: true }) matSideNav: MatSidenav;
  hasBackdrop = false;
  view = 'cards';
  displayedColumns: string[] = ['name', 'approvalID', 'names', 'codes', 'actions'];
  public smiles: string;
  private argsHash?: number;
  public order: string;
  public sortValues = searchSortValues;
  showAudit: boolean;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];
  isAdmin = false;
  isLoggedIn = false;
  showExactMatches = false;
  names: { [substanceId: string]: Array<SubstanceName> } = {};
  codes: {
    [substanceId: string]: {
      codeSystemNames?: Array<string>
      codeSystems?: { [codeSystem: string]: Array<SubstanceCode> }
    }
  } = {};
  narrowSearchSuggestions?: { [matchType: string]: Array<NarrowSearchSuggestion> } = {};
  matchTypes?: Array<string> = [];
  narrowSearchSuggestionsCount = 0;
  private isComponentInit = false;
  sequenceID?: string;
  searchHashFromAdvanced: string;

  // needed for facets
  private privateFacetParams: FacetParam;
  rawFacets: Array<Facet>;
  public displayFacets: Array<DisplayFacet> = [];
  private isFacetsParamsInit = false;
  isCollapsed = true;
  exportOptions: Array<any>;
  private searchTermHash: number;
  isSearchEditable = false;
  showDeprecated = true;
  codeSystem: any;
  previousState: Array<string> = [];
  facetViewCategorySelected = 'Default';
  facetDisplayType = 'facetView';
  facetViewCategory: Array<String> = [];
  facetViewControl = new FormControl();
  private wildCardText: string;
  bulkSearchPanelOpen = false;
  substanceList: any;
  idMapping: Array< any > = [];
  demoResp: any;
  matches: Array<any>;
  bulkList: any = {};

  scrubberSchema: any;
  scrubberModel: any;


  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    public configService: ConfigService,
    public emitService: SubBrowseEmitterService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    public utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    public gaService: GoogleAnalyticsService,
    public authService: AuthService,
    private structureService: StructureService,
    private overlayContainerService: OverlayContainer,
    private location: Location,
    private facetManagerService: FacetsManagerService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private substanceTextSearchService: SubstanceTextSearchService,
    private title: Title,
    private cvService: ControlledVocabularyService,
    private wildCardService: WildcardService,
    private adminService: AdminService,
    @Inject(DYNAMIC_COMPONENT_MANIFESTS) private dynamicContentItems: DynamicComponentManifest<any>[],

  ) {
  }

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    setTimeout(() => {
      if (this.router.url === this.previousState[0]) {
        this.ngOnInit();
      }

    }, 50);
  }

  saveWildCardText() {
    this.wildCardService.getWildCardText(this.wildCardText);
  }

  wildCardSearch() {
    this.wildCardService.getWildCardText(this.wildCardText);
    this.setUpPrivateSearchTerm();
    this.searchSubstances();
  }

  updateBulkList(event: any) {
    let checked = event.checked;
    let recordId = event.substance._metadata.recordId;
    if (this.bulkList[recordId]) {
      this.bulkList[recordId].checked = checked;
    } else {
      this.bulkList[recordId] = {"checked": checked, "substance": event.substance};
    }
    
  }

  bulkActionDialog() {
      const dialogReference = this.dialog.open(BulkActionDialogComponent, {
        maxHeight: '85%',

        width: '60%',
        data: { 'records': this.bulkList, 'scrubberModel': this.scrubberModel }
      });

      this.overlayContainer.style.zIndex = '1002';

      const exportSub = dialogReference.afterClosed().subscribe(response => {
        if(response) {
          this.bulkList = response;
        }
        this.overlayContainer.style.zIndex = null;
       
      });
  }

  selectBulk(type?: string) {
    if(type && type === 'all') {
      this.isLoading = true;
      this.loadingService.setLoading(true);
      const skip = this.pageIndex * this.pageSize;
      const subscription = this.adminService.SearchStagedData(skip, this.privateFacetParams, this.privateSearchTerm, this.totalSubstances, 'selectable')
        .subscribe(pagingResponse => {
          let start = 0;
          let skipped = 0;
          let added = 0;
      pagingResponse.content.forEach(record => {
        if ( !record._metadata.importStatus || record._metadata.importStatus !== 'imported') {
          if (this.bulkList[record._metadata.recordId]) {
            if (! this.bulkList[record._metadata.recordId].checked) {
              added++;
            }
            this.bulkList[record._metadata.recordId].checked = true;
          } else {
            this.bulkList[record._metadata.recordId] = {"checked": true, "substance": record};
            added++;
          }
        } else {
          skipped++;
        }
      });
      this.isLoading = false;
      this.loadingService.setLoading(false);
        }, error => {
          console.log(error);
          this.loadingService.setLoading(false);
          this.isLoading = false;
          alert('Error: unable to retrieve all staged results. See console for error details');
        });
    } else {
      this.substances.forEach(record => {
          if (this.bulkList[record._metadata.recordId]) {
            this.bulkList[record._metadata.recordId].checked = true;
          } else {
            this.bulkList[record._metadata.recordId] = {"checked": true, "substance": record};
          }
        
      });
    }
    
    
  }

  deselectAll() {
    Object.keys(this.bulkList).forEach(item => {
      this.bulkList[item].checked = false;
    });
  }

  openScrubber(templateRef:any, index: number): void  {
      const dialogref = this.dialog.open(ImportScrubberComponent, {
        minHeight: '500px',
        width: '800px',
        data: {
          scrubberSchema: this.scrubberSchema,
          scrubberModel: this.scrubberModel
        }
      });
      this.overlayContainer.style.zIndex = '1002';
  
      dialogref.afterClosed().subscribe(result => {
        this.overlayContainer.style.zIndex = null;
  
        if(result) {
          this.scrubberModel = result;
        }
        
      });
  }

  ngOnInit() {
    this.substances = [];
    this.records = [];

    this.adminService.getImportScrubberSchema().subscribe(response => {
      this.scrubberSchema = response;
    });
     
    this.gaService.sendPageView('Staging Area');
    this.cvService.getDomainVocabulary('CODE_SYSTEM').pipe(take(1)).subscribe(response => {
      this.codeSystem = response['CODE_SYSTEM'].dictionary;

    });
    this.title.setTitle('Staging Area');

    this.pageSize = 10;
    this.pageIndex = 0;

    this.setUpPrivateSearchTerm();

    this.privateStructureSearchTerm = this.activatedRoute.snapshot.queryParams['structure_search'] || '';
    this.privateSequenceSearchTerm = this.activatedRoute.snapshot.queryParams['sequence_search'] || '';
    this.privateSequenceSearchKey = this.activatedRoute.snapshot.queryParams['sequence_key'] || '';
    this.privateBulkSearchQueryId = this.activatedRoute.snapshot.queryParams['bulkQID'] || '';
    this.searchOnIdentifiers = (this.activatedRoute.snapshot.queryParams['searchOnIdentifiers']==="true") || false;
    this.searchEntity = this.activatedRoute.snapshot.queryParams['searchEntity'] || '';

    this.privateSearchType = this.activatedRoute.snapshot.queryParams['type'] || '';

    this.setUpPrivateSearchStrategy();


    if (this.activatedRoute.snapshot.queryParams['sequence_key'] && this.activatedRoute.snapshot.queryParams['sequence_key'].length > 9) {
      this.sequenceID = this.activatedRoute.snapshot.queryParams['source_id'];
      this.privateSequenceSearchTerm = JSON.parse(sessionStorage.getItem('gsrs_search_sequence_' + this.sequenceID));
    }
    this.privateSearchCutoff = Number(this.activatedRoute.snapshot.queryParams['cutoff']) || 0;
    this.privateSearchSeqType = this.activatedRoute.snapshot.queryParams['seq_type'] || '';
    this.smiles = this.activatedRoute.snapshot.queryParams['smiles'] || '';
    this.order = this.activatedRoute.snapshot.queryParams['order'] || '$root_lastEdited';
    this.view = this.activatedRoute.snapshot.queryParams['view'] || 'cards';
    this.pageSize = parseInt(this.activatedRoute.snapshot.queryParams['pageSize'], null) || 10;
    this.searchHashFromAdvanced = this.activatedRoute.snapshot.queryParams['g-search-hash'];
    if (this.pageSize > 500) {
      this.pageSize = 500;
    }
    this.pageIndex = parseInt(this.activatedRoute.snapshot.queryParams['pageIndex'], null) || 0;
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    const authSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
      } else {
        this.showDeprecated = true;
      }
      this.isAdmin = this.authService.hasAnyRoles('Updater', 'SuperUpdater');
      this.showAudit = this.authService.hasRoles('admin');

    });
    this.facetManagerService.registerGetFacetsHandler(this.substanceService.getStagingFacets );

    this.subscriptions.push(authSubscription);
    this.isComponentInit = true;
    this.loadComponent();

    this.loadFacetViewFromConfig();

  }

  getStagedRecords(skip?: any) {
    this.adminService.GetStagedData(this.pageIndex).subscribe(response => {
      this.substanceList = response.content;
      this.totalSubstances = response.total;
      response.content.forEach(record => {
        this.adminService.GetStagedRecord(record.recordId).subscribe( resp => {
          this.records.push(resp);
          this.idMapping[resp.uuid] = record.recordId;
          
        });
      });
    }); 
  }

  setUpPrivateSearchTerm() {
    this.privateSearchTerm = this.activatedRoute.snapshot.queryParams['search'] || '';
    if(this.wildCardText && this.wildCardText.length > 0) {
      if(this.privateSearchTerm.length > 0) {
        this.privateSearchTerm += ' AND "' + this.wildCardText + '"';
      } else {
        this.privateSearchTerm += '"' + this.wildCardText + '"';
      }
    }
    if (this.privateSearchTerm) {
      this.searchTermHash = this.utilsService.hashCode(this.privateSearchTerm);
      this.isSearchEditable = localStorage.getItem(this.searchTermHash.toString()) != null;
    }
  }

  setUpPrivateSearchStrategy() {
    // Setting privateSearchStrategy so we know what
    // search strategy is used, for example so we can
    // pass a value for use in cards.
    // I think privateSearchType is used differently.
    // I see searchType being used for 'similarity'
    this.privateSearchStrategy = null;
    if(this.privateStructureSearchTerm) {
      this.privateSearchStrategy = 'structure';
    } else if(this.privateSequenceSearchTerm) {
      this.privateSearchStrategy = 'sequence';
    } else if(this.privateBulkSearchQueryId) {
      this.privateSearchStrategy = 'bulk';
    }
  }

  ngAfterViewInit() {
    const openSubscription = this.matSideNav.openedStart.subscribe(() => {
      this.utilsService.handleMatSidenavOpen(1100);
    });
    this.subscriptions.push(openSubscription);
    const closeSubscription = this.matSideNav.closedStart.subscribe(() => {
      this.utilsService.handleMatSidenavClose();
    });
    this.subscriptions.push(closeSubscription);
    const dynamicSubscription = this.dynamicContentContainer.changes.subscribe((comps: QueryList<any>) => {
      const container = this.dynamicContentContainer.toArray();
      const dynamicContentItemsFlat = this.dynamicContentItems.reduce((acc, val) => acc.concat(val), [])
        .filter(item => item.componentType === 'browseHeader');
      if (container[0] != null) {
        const viewContainerRef = container[0].viewContainerRef;
        viewContainerRef.clear();

        dynamicContentItemsFlat.forEach(dynamicContentItem => {
          const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dynamicContentItem.component);
          const componentRef = viewContainerRef.createComponent(componentFactory);
          (<SubstanceBrowseHeaderDynamicContent>componentRef.instance).test = 'testing';
        });
      }
    });
    this.subscriptions.push(dynamicSubscription);

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.facetManagerService.unregisterFacetSearchHandler();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.processResponsiveness();
  }

  private loadComponent(): void {

    if (this.isFacetsParamsInit && this.isComponentInit || this.isRefresher) {

      this.searchSubstances();

    } else {

      // There should be a better way to do this.
      this.bulkSearchPanelOpen =
      (this.privateSearchTerm ===undefined || this.privateSearchTerm ==='')
      && (this.displayFacets && this.displayFacets.length===0);
    }
  }

  clipboard(value: string) {
    document.addEventListener('copy', (e: ClipboardEvent) => {
      e.clipboardData.setData('text/plain', (value));
      e.preventDefault();
      document.removeEventListener('copy', null);
    });
    document.execCommand('copy');
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

    this.gaService.sendEvent('substancesContent', eventAction, 'pager', eventValue);

    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.populateUrlQueryParameters();

    this.searchSubstances();
  }

  customPage(event: any): void {
    if (this.validatePageInput(event)) {
      this.invalidPage = false;
      const newpage = Number(event.target.value) - 1;
      this.pageIndex = newpage;
      this.gaService.sendEvent('substancesContent', 'select:page-number', 'pager', newpage);
      this.populateUrlQueryParameters();
      this.searchSubstances();
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
    if (facetsUpdateEvent.deprecated && facetsUpdateEvent.deprecated === true) {
      this.showDeprecated = true;
    } else {
      this.showDeprecated = false;
    }
    this.privateFacetParams = facetsUpdateEvent.facetParam;
    this.displayFacets = facetsUpdateEvent.displayFacets.filter(facet => !(facet.type === 'Deprecated' && facet.bool === false));
    if (!this.isFacetsParamsInit) {
      this.isFacetsParamsInit = true;
      this.loadComponent();
    } else {

      this.searchSubstances();
    }
  }

  facetViewChange(event): void {
    this.facetViewCategorySelected = event.value;
  }

  openedSortSubstances(event: any) {
    if (event) {
      this.overlayContainer.style.zIndex = '1002';
    } else {
      this.overlayContainer.style.zIndex = '1000';
    }
  }

  openedFacetViewChange(event: any) {
    if (event) {
      this.overlayContainer.style.zIndex = '1002';
    } else {
      this.overlayContainer.style.zIndex = '1000';
    }
  }

  loadFacetViewFromConfig() {
    this.facetViewControl.setValue(this.facetViewCategorySelected);
    const facetConf = this.configService.configData.facets && this.configService.configData.facets['substances'] || {};
    facetConf['facetView'].forEach(categoryRow => {
      const category = categoryRow['category'];
      this.facetViewCategory.push(category);
    });
    this.facetViewCategory.push('All');
  }

  // for facets
  facetsLoaded(numFacetsLoaded: number) {
    if (numFacetsLoaded > 0) {
      this.processResponsiveness();
    } else {
      this.matSideNav.close();
    }
  }

  getRecord(id: string): Observable<any> { 
    let subject = new Subject<string>();
    let ids = [];
    let sources = [];
    this.adminService.GetStagedRecord(id).subscribe(response => {
      this.idMapping[response.uuid] = id;
      response._matches.matches.forEach(match => {
        match.matchingRecords.forEach(matchRec => {
          if (matchRec.sourceName == 'GSRS' || matchRec.sourceName == 'Staging Area') {
            if (!ids[matchRec.recordId.idString]) {
              ids[matchRec.recordId.idString] = [matchRec.matchedKey];
              sources[matchRec.recordId.idString] = matchRec.sourceName;
            } else {
              ids[matchRec.recordId.idString].push(matchRec.matchedKey);
              sources[matchRec.recordId.idString] = matchRec.sourceName;

            }
          }
          
        });
      });
      let items = [];
      Object.keys(ids).forEach(key => {
        let temp = {'ID':key,
                    'records':ids[key],
                     'source':sources[key]
                  };
                    items.push(temp);
      });
      response.matchedRecords = items;
      subject.next(response);

    }, error => {
      this.idMapping[this.demoResp.uuid] = id;
      let response = JSON.parse(JSON.stringify(this.demoResp));
      response._matches.matches.forEach(match => {
        match.matchingRecords.forEach(matchRec => {
          if (!ids[matchRec.recordId.idString]) {
            ids[matchRec.recordId.idString] = [matchRec.matchedKey];
          } else {
            ids[matchRec.recordId.idString].push(matchRec.matchedKey);

          }
        });
      });
      let items = [];
      Object.keys(ids).forEach(key => {
        let temp = {'ID':key,
                    'records':ids[key]};
                    items.push(temp);
      });

      response.matchedRecords = items;
      subject.next(response);

    });
    return subject.asObservable();
  }

  organizeMatches() {
    this.matches = [];
    this.records.forEach(record => {
      let ids = [];
      record._matches.matches.forEach(match => {
        match.matchingRecords.forEach(matchRec => {
          if (!ids[matchRec]) {
            ids[matchRec] = [matchRec.matchedKey];
          } else {
            ids[matchRec].push(matchRec.matchedKey);
          }
        });
      });
      record.matchedRecords = ids;
    });
  }

  searchforIDs() {
     // if (this.argsHash == null || this.argsHash !== newArgsHash) {
        this.isLoading = true;
        this.loadingService.setLoading(true);
        const skip = this.pageIndex * this.pageSize;
        const subscription = this.adminService.SearchStagedData(skip, this.privateFacetParams, this.privateSearchTerm, this.totalSubstances)
          .subscribe(pagingResponse => { console.log(pagingResponse)});
  }

  searchSubstances() {
    this.disableExport = false;
    const newArgsHash = this.utilsService.hashCode(
      this.privateSearchTerm,
      this.privateStructureSearchTerm,
      this.privateSequenceSearchTerm,
      this.privateBulkSearchQueryId,
      this.privateSearchCutoff,
      this.privateSearchType,
      this.privateSearchSeqType,
      this.pageSize,
      this.order,
      this.privateFacetParams,
      (this.pageIndex * this.pageSize),
      this.showDeprecated
    );
   // if (this.argsHash == null || this.argsHash !== newArgsHash) {
      this.isLoading = true;
      this.loadingService.setLoading(true);
      this.argsHash = newArgsHash;
      const skip = this.pageIndex * this.pageSize;
      const subscription = this.adminService.SearchStagedData(skip, this.privateFacetParams, this.privateSearchTerm, this.pageSize)
        .subscribe(pagingResponse => {
          this.substances = [];
          this.records = [];
          if (pagingResponse.total == 0 && pagingResponse.count == 0) {
          //  alert('Error: response had a count and total of 0, using demonstration data');
          //  pagingResponse = this.setDemo2();
          }
          this.isError = false;
          this.totalSubstances = pagingResponse.total;
       //   this.pageSize = 10;
          if (this.totalSubstances % this.pageSize === 0) {
            this.lastPage = (this.totalSubstances / this.pageSize);
          } else {
            this.lastPage = Math.floor(this.totalSubstances / this.pageSize + 1);
          }

          
          pagingResponse.content.forEach(entry => {
            this.getRecord(entry._metadata.recordId).subscribe(response => {
              this.substances.push(response);
              this.records.push(response);
            });
          });
          this.organizeMatches();
          if (pagingResponse.facets && pagingResponse.facets.length > 0) {
            this.rawFacets = pagingResponse.facets;
          }
          this.narrowSearchSuggestions = {};
          this.matchTypes = [];
          this.narrowSearchSuggestionsCount = 0;
          this.loadingService.setLoading(false);
         
        //  this.substanceService.setResult(pagingResponse.etag, pagingResponse.content, pagingResponse.total);
        }, error => {
          this.gaService.sendException('getSubstancesDetails: error from API call');
          const notification: AppNotification = {
            message: 'There was an error trying to retrieve substances. Please refresh and try again.',
            type: NotificationType.error,
            milisecondsToShow: 6000
          };
          this.isError = true;
          this.isLoading = false;
          this.loadingService.setLoading(false);
      /*  const pagingResponse = this.setDemo2();

        this.totalSubstances = pagingResponse.total;
          this.pageSize = 10;
          if (this.totalSubstances % this.pageSize === 0) {
            this.lastPage = (this.totalSubstances / this.pageSize);
          } else {
            this.lastPage = Math.floor(this.totalSubstances / this.pageSize + 1);
          }
          this.substances = [];
          this.records = [];
          pagingResponse.content.forEach(entry => {
            this.getRecord(entry.recordId).subscribe(response => {
              this.substances.push(response);
              this.records.push(response);
              console.log(response);

            });
          });
          this.organizeMatches();
         // this.substances = pagingResponse.content;
          this.totalSubstances = this.substances.length;
          if (pagingResponse.facets && pagingResponse.facets.length > 0) {
            this.rawFacets = pagingResponse.facets;
          }
          this.narrowSearchSuggestions = {};
          this.matchTypes = [];
          this.narrowSearchSuggestionsCount = 0;*/

        }, () => {
          subscription.unsubscribe();
       /*  
          this.substances.forEach(substance => {
            this.setSubstanceNames(substance.uuid);
            this.setSubstanceCodes(substance.uuid);
          });*/
          this.isLoading = false;
          this.loadingService.setLoading(this.isLoading);
        });
   // }

  }

sortMatchTypes(a:Array<string>) {
    return _.sortBy(a);
}

searchTermOkforBeginsWithSearch(): boolean {
  return (this.privateSearchTerm && !this.utilsService.looksLikeComplexSearchTerm(this.privateSearchTerm));
}



  restricSearh(searchTerm: string): void {
    this.privateSearchTerm = searchTerm;
    this.searchTermHash = this.utilsService.hashCode(this.privateSearchTerm);
    this.isSearchEditable = localStorage.getItem(this.searchTermHash.toString()) != null;
    this.populateUrlQueryParameters();
 //   this.searchSubstances();
    this.substanceTextSearchService.setSearchValue('main-substance-search', this.privateSearchTerm);
  }

  export(url: string, extension: string) {
    if (this.authService.getUser() !== '') {
      const dialogReference = this.dialog.open(ExportDialogComponent, {
        maxHeight: '85%',

        width: '60%',
        data: { 'extension': extension }
      });

      this.overlayContainer.style.zIndex = '1002';

      const exportSub = dialogReference.afterClosed().subscribe(response => {
        const name = response.name;
        const id = response.id;
        this.overlayContainer.style.zIndex = null;
        if (name && name !== '') {
        //  this.loadingService.setLoading(true);
          const fullname = name + '.' + extension;
          this.authService.startUserDownload(url, this.privateExport, fullname, id).subscribe(response => {
           // this.substanceService.getConfigByID(id).subscribe(resp =>{
          //  });
            this.loadingService.setLoading(false);
            this.loadingService.setLoading(false);
            const navigationExtras: NavigationExtras = {
              queryParams: {
                totalSub: this.totalSubstances
              }
            };
            const params = { 'total': this.totalSubstances };
            this.router.navigate(['/user-downloads/', response.id]);
          }, error => this.loadingService.setLoading(false));
        }
      });
    } else {
      this.disableExport = true;
    }

  }

  setSubstanceNames(substanceId: string): void {
    this.substanceService.getSubstanceNames(substanceId).pipe(take(1)).subscribe(names => {
      this.names[substanceId] = names;
    }, error => {
      this.names[substanceId] = [];
    });
  }

  setSubstanceCodes(substanceId: string): void {
   // this.loadingService.setLoading(true);
    this.substanceService.getSubstanceCodes(substanceId).pipe(take(1)).subscribe(codes => {
      if (codes && codes.length > 0) {
        this.codes[substanceId] = {
          codeSystemNames: [],
          codeSystems: {}
        };
        codes.forEach(code => {
          if (this.codes[substanceId].codeSystems[code.codeSystem]) {
            this.codes[substanceId].codeSystems[code.codeSystem].push(code);
          } else {
            this.codes[substanceId].codeSystems[code.codeSystem] = [code];
            this.codes[substanceId].codeSystemNames.push(code.codeSystem);
          }
        });
        this.codes[substanceId].codeSystemNames = this.sortCodeSystems(this.codes[substanceId].codeSystemNames);
        this.codes[substanceId].codeSystemNames.forEach(sysName => {
          this.codes[substanceId].codeSystems[sysName] = this.codes[substanceId].codeSystems[sysName].sort((a, b) => {
            let test = 0;
            if (a.type === 'PRIMARY' && b.type !== 'PRIMARY') {
              test = 1;
            } else if (a.type !== 'PRIMARY' && b.type === 'PRIMARY') {
              test = -1;
            } else {
              test = 0;
            }
            return test;
          });
        });

      }
      this.loadingService.setLoading(false);
    }, error => {
      this.loadingService.setLoading(false);
    });
  }


  populateUrlQueryParameters(): void {
    
  }

  editAdvancedSearch(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'advanced search term' :
      `${this.privateSearchTerm}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-advanced-search', eventLabel);
    // ** BEGIN: Store in Local Storage for Advanced Search
    // storage searchterm in local storage when going from Browse Substance to Advanced Search (NOT COMING FROM ADVANCED SEARCH)
    if (!this.searchHashFromAdvanced) {
      const advSearchTerm: Array<String> = [];
      advSearchTerm[0] = this.privateSearchTerm;
      const queryStatementHashes = [];
      const queryStatement = {
        condition: '',
        queryableProperty: 'Manual Query Entry',
        command: 'Manual Query Entry',
        commandInputValues: advSearchTerm,
        query: this.privateSearchTerm
      };

      // Store in cookies, Category tab (Substance, Application, etc)
      const categoryHash = this.utilsService.hashCode('Substance');
      localStorage.setItem(categoryHash.toString(), 'Substance');
      queryStatementHashes.push(categoryHash);

      const queryStatementString = JSON.stringify(queryStatement);
      const hash = this.utilsService.hashCode(queryStatementString);

      // Store in cookies, Each Query Statement is stored in separate hash
      localStorage.setItem(hash.toString(), queryStatementString);

      // Push Query Statements Hashes in Array
      queryStatementHashes.push(hash);

      // Store in cookies,  store in Query Hash - Query Statement Hashes Array
      const queryStatementHashesString = JSON.stringify(queryStatementHashes);

      localStorage.setItem(this.searchTermHash.toString(), queryStatementHashesString);
     }
    // ** END: Store in Local Storage for Advanced Search

    const navigationExtras: NavigationExtras = {
      queryParams: {
        'g-search-hash': this.searchTermHash
      }
    };

    navigationExtras.queryParams['structure'] = this.privateStructureSearchTerm || null;
    navigationExtras.queryParams['type'] = this.privateSearchType || null;

    if(this.privateSearchType === 'similarity') {
      navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff || 0;
    }
    this.router.navigate(['/advanced-search'], navigationExtras);
  }

  editStructureSearch(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'structure search term' :
      `${this.privateStructureSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-structure-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['structure'] = this.privateStructureSearchTerm || null;
    navigationExtras.queryParams['type'] = this.privateSearchType || null;

    if (this.privateSearchType === 'similarity') {
      navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff || 0;
    }

    this.router.navigate(['/structure-search'], navigationExtras);
  }

  clearStructureSearch(): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'structure search term' :
      `${this.privateStructureSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-structure-search', eventLabel);

    this.privateStructureSearchTerm = '';
    this.privateSearchType = '';
    this.privateSearchCutoff = 0;
    this.smiles = '';
    this.pageIndex = 0;

    this.populateUrlQueryParameters();
  //  this.searchSubstances();
  }

  editSequenceSearh(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'sequence search term' :
      `${this.privateSequenceSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}-${this.privateSearchSeqType}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-sequence-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['type'] = this.privateSearchType || null;
    navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff || 0;
    navigationExtras.queryParams['seq_type'] = this.privateSearchSeqType || null;
    sessionStorage.setItem('gsrs_edit_sequence_' + this.sequenceID, JSON.stringify(this.privateSequenceSearchTerm));
    navigationExtras.queryParams['source'] = 'edit';
    navigationExtras.queryParams['source_id'] = this.sequenceID;

    this.router.navigate(['/sequence-search'], navigationExtras);
  }

  clearSequenceSearch(): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'sequence search term' :
      `${this.privateSequenceSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}-${this.privateSearchSeqType}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-sequence-search', eventLabel);

    this.privateSequenceSearchTerm = '';
    this.privateSequenceSearchKey = '';
    this.privateSearchType = '';
    this.privateSearchCutoff = 0;
    this.privateSearchSeqType = '';
    this.pageIndex = 0;

    this.populateUrlQueryParameters();
  //  this.searchSubstances();
  }

  editBulkSearch(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'bulk search term' :
      `${this.searchEntity}-bulk-search-${this.privateBulkSearchQueryId}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-bulk-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {
        bulkQID: this.privateBulkSearchQueryId,
        searchOnIdentifiers: this.searchOnIdentifiers,
        searchEntity: this.searchEntity
      }
    };
    this.router.navigate(['/bulk-search'], navigationExtras);
  }

  clearBulkSearch(): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'bulk search term' :
    `${this.searchEntity}-bulk-search-${this.privateBulkSearchQueryId}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-bulk-search', eventLabel);

    this.privateBulkSearchQueryId = null;
    this.privateBulkSearchSummary = null;
    this.searchEntity = '';
    this.searchOnIdentifiers = null;
    this.privateSearchType = '';
    this.privateSearchCutoff = 0;
    this.smiles = '';
    this.pageIndex = 0;

    this.populateUrlQueryParameters();
   // this.searchSubstances();
  }

  clearSearch(): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-search', eventLabel);

    this.privateSearchTerm = '';
    this.wildCardText = '';
    this.searchTermHash = null;
    this.pageIndex = 0;

    this.populateUrlQueryParameters();
    this.substanceTextSearchService.setSearchValue('main-substance-search');
    this.searchSubstances();
  }

  clearFilters(): void {
    // for facets
    // Does this facet remove work completely?  When I (aw) click RESET button the facet
    // is cleared but this.displayFacets still has the value.
    this.displayFacets.forEach(displayFacet => {
      displayFacet.removeFacet(displayFacet.type, displayFacet.bool, displayFacet.val);
    });
    if (this.privateStructureSearchTerm != null && this.privateStructureSearchTerm !== '') {
      this.clearStructureSearch();
    } else if ((this.privateSequenceSearchTerm != null && this.privateSequenceSearchTerm !== '') ||
      (this.privateSequenceSearchKey != null && this.privateSequenceSearchKey !== '')) {
      this.clearSequenceSearch();
    } else if (this.privateBulkSearchQueryId != null && this.privateBulkSearchQueryId !== undefined) {
        this.clearBulkSearch();
    } else {
      this.clearSearch();
    }
    this.facetManagerService.clearSelections();
  }

  clickToRefreshPreview() {
    this.emitService.setRefresh(true);
    this.isRefresher = true;
    this.loadComponent();
  }

  clickToCancel() {
    this.emitService.setCancel(true);
  }

  get searchTerm(): string {
    return this.privateSearchTerm;
  }

  get structureSearchTerm(): string {
    return this.privateStructureSearchTerm;
  }

  get sequenceSearchTerm(): string {
    return this.privateSequenceSearchTerm;
  }

  get bulkSearchSummary(): string {
    return this.privateBulkSearchSummary;
  }
  get bulkSearchQueryId(): number {
    return this.privateBulkSearchQueryId;
  }
  get bulkSearchStatusKey(): string {
    return this.privateBulkSearchStatusKey;
  }

  get searchType(): string {
    return this.privateSearchType;
  }

  get searchStrategy(): string {
    return this.privateSearchStrategy;
  }


  get searchCutoff(): number {
    return this.privateSearchCutoff;
  }

  get searchSeqType(): string {
    return this.privateSearchSeqType;
  }

  private processResponsiveness = () => {
    setTimeout(() => {
      if (window) {
        if (window.innerWidth < 1100) {
          this.matSideNav.close();
          this.isCollapsed = true;
          this.hasBackdrop = true;
        } else {
          this.matSideNav.open();
          this.hasBackdrop = false;
        }
      }
    });
  }

  openSideNav() {
    this.gaService.sendEvent('substancesFiltering', 'button:sidenav', 'open');
    this.matSideNav.open();
  }

  updateView(event): void {
    this.gaService.sendEvent('substancesContent', 'button:view-update', event.value);
    this.view = event.value;
  }


  getSequenceDisplay(sequence?: string): string {
    if (sequence != null) {
      if (sequence.length < 16) {
        return sequence;
      } else {
        return `${sequence.substr(0, 15)}...`;
      }
    } else {
      return '';
    }
  }

  openImageModal(substance: any): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'substance' : substance._name;
        this.gaService.sendEvent('substancesContent', 'link:structure-zoom', eventLabel);

    let data: any;

    if (substance.substanceClass === 'chemical') {
      data = {
        structure: substance._metadata.recordId,
        smiles: substance.structure.smiles,
        uuid: substance.uuid,
        names: this.names[substance.uuid]
      };
    } else {
      data = {
        structure: substance._metadata.recordId,
        names: this.names[substance.uuid]
      };
    }

    const dialogRef = this.dialog.open(StructureImageModalComponent, {
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

  getMol(id: string, filename: string): void {
    const subscription = this.structureService.downloadMolfile(id).subscribe(response => {
      this.downloadFile(response, filename);
      subscription.unsubscribe();
    }, error => {
      subscription.unsubscribe();
    });
  }

  getFasta(id: string, filename: string): void {
    const subscription = this.substanceService.getFasta(id).subscribe(response => {
      this.downloadFile(response, filename);
      subscription.unsubscribe();
    }, error => {
      subscription.unsubscribe();
    });
  }

  downloadFile(response: any, filename: string): void {
    const dataType = response.type;
    const binaryData = [];
    binaryData.push(response);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  sortCodeSystems(codes: Array<string>): Array<string> {
    if (this.configService.configData && this.configService.configData.codeSystemOrder &&
      this.configService.configData.codeSystemOrder.length > 0) {
      const order = this.configService.configData.codeSystemOrder;
      for (let i = order.length - 1; i >= 0; i--) {
        for (let j = 0; j <= codes.length; j++) {
          if (order[i] === codes[j]) {
            const a = codes.splice(j, 1);   // removes the item
            codes.unshift(a[0]);         // adds it back to the beginning
            break;
          }
        }
      }
    }
    return codes;
  }

  showAllRecords(): void {
    this.showExactMatches = false;
    this.processResponsiveness();
  }

  increaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = '1002';
  }

  decreaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = null;
  }


  downloadJson(id: string) {
    this.substanceService.getSubstanceDetails(id).pipe(take(1)).subscribe(response => {
      this.downloadFile(JSON.stringify(response), id + '.json');
    });

  }

  copySmiles(val: string) {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }


}
