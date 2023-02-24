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
  showDeprecated = false;
  codeSystem: any;
  previousState: Array<string> = [];
  facetViewCategorySelected = 'Default';
  facetDisplayType = 'facetView';
  facetViewCategory: Array<String> = [];
  facetViewControl = new FormControl();
  private wildCardText: string;
  bulkSearchPanelOpen = false;
  substanceList: any;
  demoResp: any;



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
   // this.searchSubstances();
  }

  ngOnInit() {
    this.demoResp = this.setDemo3();
    this.substances = [];
    this.records = [];
    let temp = this.loadDemo();
    let temp2 = temp["dataPreview"];
    console.log(temp2);
    temp2.forEach(record => {
      if (record.data){
      //  record.data.matches = record.matches;
      //  this.substances.push(record.data);
      //  this.records.push(record.data);
      }
     
    });
    console.log(this.substances);
    console.log(temp2);
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
    const deprecated = this.activatedRoute.snapshot.queryParams['showDeprecated'];
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
        this.showDeprecated = false;
      }
      this.isAdmin = this.authService.hasAnyRoles('Updater', 'SuperUpdater');
      this.showAudit = this.authService.hasRoles('admin');

    });
    if (deprecated && deprecated === 'true' && this.showAudit) {
      this.showDeprecated = true;
    }
    this.facetManagerService.registerGetFacetsHandler(this.substanceService.getSubstanceFacets );

    this.subscriptions.push(authSubscription);
    this.isComponentInit = true;
    this.loadComponent();

    this.loadFacetViewFromConfig();

    this.searchSubstances();
    

  }

  getStagedRecords(skip?: any) {
    this.adminService.GetStagedData(this.pageIndex).subscribe(response => {
      this.substanceList = response.content;
      this.totalSubstances = response.total;
      response.content.forEach(record => {
        this.adminService.GetStagedRecord(record.recordId).subscribe( response => {
          this.records.push(response);
        })
      })

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
    console.log(facetsUpdateEvent);
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
    this.adminService.GetStagedRecord(id).subscribe(response => {
      subject.next(response);
    }, error => {
      subject.next(this.demoResp)
    });
    return subject.asObservable();
  }

  searchSubstances() {
      // There should be a better way to do this.
      this.bulkSearchPanelOpen =
      (this.privateSearchTerm ===undefined || this.privateSearchTerm ==='')
      && (this.displayFacets && this.displayFacets.length===0);

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
     // this.loadingService.setLoading(true);
      this.argsHash = newArgsHash;
      const skip = this.pageIndex * this.pageSize;
      const subscription = this.adminService.SearchStagedData(skip)
        .subscribe(pagingResponse => {
          pagingResponse = this.setDemo2();
          this.isError = false;
          this.totalSubstances = pagingResponse.total;
          this.pageSize = 10;
          if (this.totalSubstances % this.pageSize === 0) {
            this.lastPage = (this.totalSubstances / this.pageSize);
          } else {
            this.lastPage = Math.floor(this.totalSubstances / this.pageSize + 1);
          }

          this.substances = pagingResponse.content;
          this.totalSubstances = this.substances.length;
          this.substances = [];
          this.records = [];
          pagingResponse.content.forEach(entry => {
            this.getRecord(entry.recordId).subscribe(response => {
              this.substances.push(response);
              this.records.push(response);
              console.log(response);
            });
          });
          if (pagingResponse.facets && pagingResponse.facets.length > 0) {
            this.rawFacets = pagingResponse.facets;
          }
          this.narrowSearchSuggestions = {};
          this.matchTypes = [];
          this.narrowSearchSuggestionsCount = 0;

         
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
          this.loadingService.setLoading(this.isLoading);
        //  this.notificationService.setNotification(notification);
        const pagingResponse = this.setDemo2();

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
         // this.substances = pagingResponse.content;
          this.totalSubstances = this.substances.length;
          if (pagingResponse.facets && pagingResponse.facets.length > 0) {
            this.rawFacets = pagingResponse.facets;
          }
          this.narrowSearchSuggestions = {};
          this.matchTypes = [];
          this.narrowSearchSuggestionsCount = 0;

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
    /*
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['search'] = this.privateSearchTerm;
    navigationExtras.queryParams['structure_search'] = this.privateStructureSearchTerm;
    navigationExtras.queryParams['sequence_search'] = this.privateSequenceSearchTerm;
    navigationExtras.queryParams['searchOnIdentifiers'] = this.searchOnIdentifiers;
    navigationExtras.queryParams['bulkQID'] = this.privateBulkSearchQueryId;
    navigationExtras.queryParams['searchEntity'] = this.searchEntity;
    navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff;
    navigationExtras.queryParams['type'] = this.privateSearchType;
    navigationExtras.queryParams['seq_type'] = this.privateSearchSeqType;
    navigationExtras.queryParams['smiles'] = this.smiles;
    navigationExtras.queryParams['order'] = this.order;
    navigationExtras.queryParams['pageSize'] = this.pageSize;
    navigationExtras.queryParams['pageIndex'] = this.pageIndex;
    navigationExtras.queryParams['skip'] = this.pageIndex * this.pageSize;
    navigationExtras.queryParams['view'] = this.view;
    // navigationExtras.queryParams['g-search-hash'] = this.searchTermHash;
    this.previousState.push(this.router.url);
    const urlTree = this.router.createUrlTree([], {
      queryParams: navigationExtras.queryParams,
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.location.go(urlTree.toString());
    */
  }

  editAdvancedSearch(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'advanced search term' :
      `${this.privateSearchTerm}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-advanced-search', eventLabel);
    // Structure Search
   // const eventLabel = environment.isAnalyticsPrivate ? 'structure search term' :
   // `${this.privateStructureSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}`;
   // this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-structure-search', eventLabel);

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
   // this.searchSubstances();
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

  openImageModal(substance: SubstanceDetail): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'substance' : substance._name;
        this.gaService.sendEvent('substancesContent', 'link:structure-zoom', eventLabel);

    let data: any;

    if (substance.substanceClass === 'chemical') {
      data = {
        structure: substance.uuid,
        smiles: substance.structure.smiles,
        uuid: substance.uuid,
        names: this.names[substance.uuid]
      };
    } else {
      data = {
        structure: substance.uuid,
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

  loadDemo(): any {
    let demo = {"complete success":true,"dataPreview":[{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22573-88-2","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4df58848-0d17-4d99-9395-c420ff241b95"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"3-Hydroxy delta 1-pyrroline-5-carboxylic acid","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4df58848-0d17-4d99-9395-c420ff241b95"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"2H-Pyrrole-2-carboxylic acid, 3,4-dihydro-4-hydroxy-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4df58848-0d17-4d99-9395-c420ff241b95"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22573-88-2","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["31324d18-e3d6-4999-afd2-ed898b98b7a7"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"31324d18-e3d6-4999-afd2-ed898b98b7a7","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"4df58848-0d17-4d99-9395-c420ff241b95","citation":"File null imported on Fri Feb 17 09:20:48 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n  9  9  0  0  0  0  0  0  0  0999 V2000\n    6.4676   -2.8129    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    5.8002   -3.2978    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0551   -4.0824    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.8801   -4.0824    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.1351   -3.2978    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.5702   -4.7498    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    7.9197   -3.0429    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.0912   -2.2359    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    8.5328   -3.5949    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  1  5  1  0  0  0  0\n  3  6  1  0  0  0  0\n  5  7  1  0  0  0  0\n  7  8  2  0  0  0  0\n  7  9  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["4df58848-0d17-4d99-9395-c420ff241b95"],"hash":null,"_matchContext":null},"moieties":[],"_name":"3-Hydroxy delta 1-pyrroline-5-carboxylic acid","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22573-88-2","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"3-Hydroxy delta 1-pyrroline-5-carboxylic acid","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"2H-Pyrrole-2-carboxylic acid, 3,4-dihydro-4-hydroxy-","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"48c205541d376fe311758a24d484bd3754eb09e6","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"6e68b05317d2ceadc5d4d6dff131a3d778c9c9c6","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22573-88-2","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"3-Hydroxy delta 1-pyrroline-5-carboxylic acid","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"2H-Pyrrole-2-carboxylic acid, 3,4-dihydro-4-hydroxy-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"48c205541d376fe311758a24d484bd3754eb09e6","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"6e68b05317d2ceadc5d4d6dff131a3d778c9c9c6","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"GVN71CAL3G","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"0022573939","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Alexidine","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Alexidine [USAN:INN]","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"1,1'-Hexamethylenebis-(5-(ethylhexyl)biguanide)","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"2,4,11,13-Tetraazatetradecanediimidamide, N,N''-bis(2-ethylhexyl)-3,12-diimino-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Alexidina [INN-Spanish]","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Alexidinum [INN-Latin]","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"EINECS 245-096-7","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"1,1'-Hexamethylenebis(5-(2-ethylhexyl)biguanide)","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Win 21,904","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Compound 904","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Win 21-904","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"2,4,11,13-Tetraazatetradecanediimidamide, N,N'-bis(2-ethylhexyl)-3,12-diimino-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Alexidina","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Alexidinum","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"UNII-GVN71CAL3G","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22573-93-9","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["36d35f51-1a6c-4c86-b7a1-062856d3129b"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"36d35f51-1a6c-4c86-b7a1-062856d3129b","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"9e91cc2c-84e3-4c01-824b-4ccfd172c394","citation":"File null imported on Fri Feb 17 09:20:48 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n 36 35  0  0  0  0  0  0  0  0999 V2000\n    3.8724    0.2690    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.4724    0.0310    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2793    0.0379    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.8586    0.7310    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.0724    0.2483    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2793   -0.4172    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.4586    0.9483    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.6724    0.0069    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.6931   -0.6414    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.2724    0.2379    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.6793   -0.4517    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    4.6966   -1.1000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8724    0.0000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4724    0.2207    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8793   -0.4621    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.0724   -0.0172    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.6586    0.2069    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.2724   -0.0310    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.1414    0.1862    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.5276   -0.0517    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.9414    0.1690    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.3414   -0.0621    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.7414    0.1586    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.1414   -0.0793    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.7517    0.6207    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.5414    0.1483    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.9414   -0.0931    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n   -2.5517    0.6069    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n   -3.3414    0.1310    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -3.7414   -0.1138    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -4.1414    0.1069    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -3.7276   -0.5690    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -4.5414   -0.1172    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -4.1276   -0.8138    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -4.9517    0.1000    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -5.3414   -0.1414    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  4  1  0  0  0  0\n  2  5  1  0  0  0  0\n  3  6  1  0  0  0  0\n  4  7  1  0  0  0  0\n  5  8  1  0  0  0  0\n  6  9  1  0  0  0  0\n  8 10  1  0  0  0  0\n  8 11  2  0  0  0  0\n  9 12  1  0  0  0  0\n 10 13  1  0  0  0  0\n 13 14  1  0  0  0  0\n 13 15  2  0  0  0  0\n 14 16  1  0  0  0  0\n 16 17  1  0  0  0  0\n 17 18  1  0  0  0  0\n 18 19  1  0  0  0  0\n 19 20  1  0  0  0  0\n 20 21  1  0  0  0  0\n 21 22  1  0  0  0  0\n 22 23  1  0  0  0  0\n 23 24  1  0  0  0  0\n 23 25  2  0  0  0  0\n 24 26  1  0  0  0  0\n 26 27  1  0  0  0  0\n 26 28  2  0  0  0  0\n 27 29  1  0  0  0  0\n 29 30  1  0  0  0  0\n 30 31  1  0  0  0  0\n 30 32  1  0  0  0  0\n 31 33  1  0  0  0  0\n 32 34  1  0  0  0  0\n 33 35  1  0  0  0  0\n 35 36  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["9e91cc2c-84e3-4c01-824b-4ccfd172c394"],"hash":null,"_matchContext":null},"moieties":[],"_name":"Win 21-904","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"GVN71CAL3G","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"0022573939","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Alexidine","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Alexidine [USAN:INN]","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"1,1'-Hexamethylenebis-(5-(ethylhexyl)biguanide)","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"2,4,11,13-Tetraazatetradecanediimidamide, N,N''-bis(2-ethylhexyl)-3,12-diimino-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Alexidina [INN-Spanish]","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Alexidinum [INN-Latin]","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"EINECS 245-096-7","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"1,1'-Hexamethylenebis(5-(2-ethylhexyl)biguanide)","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Win 21,904","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Compound 904","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Win 21-904","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"2,4,11,13-Tetraazatetradecanediimidamide, N,N'-bis(2-ethylhexyl)-3,12-diimino-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Alexidina","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Alexidinum","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"UNII-GVN71CAL3G","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"1c61e9f12aee6750f7ba0cfae6dfbaf3dfd9c3d8","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"f139e8f64a5aed797f1c1b3e2e120760e2dcc75a","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"GVN71CAL3G","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"0022573939","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Alexidine","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Alexidine [USAN:INN]","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"1,1'-Hexamethylenebis-(5-(ethylhexyl)biguanide)","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"2,4,11,13-Tetraazatetradecanediimidamide, N,N''-bis(2-ethylhexyl)-3,12-diimino-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Alexidina [INN-Spanish]","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Alexidinum [INN-Latin]","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"EINECS 245-096-7","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"1,1'-Hexamethylenebis(5-(2-ethylhexyl)biguanide)","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Win 21,904","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Compound 904","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Win 21-904","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"2,4,11,13-Tetraazatetradecanediimidamide, N,N'-bis(2-ethylhexyl)-3,12-diimino-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Alexidina","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Alexidinum","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"UNII-GVN71CAL3G","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"1c61e9f12aee6750f7ba0cfae6dfbaf3dfd9c3d8","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"f139e8f64a5aed797f1c1b3e2e120760e2dcc75a","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22574-01-2","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["2cb54e23-b846-4a71-9981-a968000f5afb"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Hydroxyphenylorciprenaline","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["2cb54e23-b846-4a71-9981-a968000f5afb"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"5-(1-Hydroxy-2-((1-(4-hydroxyphenyl)-1-methylethyl)amino)ethyl)-1,3-benzenediol","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["2cb54e23-b846-4a71-9981-a968000f5afb"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"OH-Phenylorciprenaline","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["2cb54e23-b846-4a71-9981-a968000f5afb"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22574-01-2","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["0a3693c2-f039-4605-992e-4f961a477fac"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"0a3693c2-f039-4605-992e-4f961a477fac","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"2cb54e23-b846-4a71-9981-a968000f5afb","citation":"File null imported on Fri Feb 17 09:20:49 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n 22 23  0  0  0  0  0  0  0  0999 V2000\n    5.1963    0.6009    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.8213    1.6834    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.0713    1.6834    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.6963    0.6009    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.0713   -0.4817    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.8213   -0.4817    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.9463    0.6009    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    7.6963    2.7659    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    7.6963   -1.5642    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.0713   -2.6467    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.8213   -2.6467    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    5.1963   -3.7292    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.5713   -4.8118    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.2788   -4.3542    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.1138   -3.1042    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.0312   -3.7292    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.9487   -3.1042    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.9487   -1.8542    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.0313   -1.2292    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.1138   -1.8542    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.8662   -1.2292    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    8.9463   -1.5642    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  2  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  2  0  0  0  0\n  5  6  1  0  0  0  0\n  1  6  2  0  0  0  0\n  1  7  1  0  0  0  0\n  3  8  1  0  0  0  0\n  9 10  1  0  0  0  0\n 12 13  1  0  0  0  0\n 12 14  1  0  0  0  0\n 15 16  1  0  0  0  0\n 16 17  2  0  0  0  0\n 17 18  1  0  0  0  0\n 18 19  2  0  0  0  0\n 19 20  1  0  0  0  0\n 15 20  2  0  0  0  0\n 18 21  1  0  0  0  0\n 12 15  1  0  0  0  0\n 11 12  1  0  0  0  0\n 10 11  1  0  0  0  0\n  9 22  1  0  0  0  0\n  5  9  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["2cb54e23-b846-4a71-9981-a968000f5afb"],"hash":null,"_matchContext":null},"moieties":[],"_name":"OH-Phenylorciprenaline","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22574-01-2","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Hydroxyphenylorciprenaline","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"5-(1-Hydroxy-2-((1-(4-hydroxyphenyl)-1-methylethyl)amino)ethyl)-1,3-benzenediol","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"OH-Phenylorciprenaline","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"e1c13e095a250c4e62ed04b970e404ab195c58c8","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"ecfa842d717a587ac9542414e75ded8ab41106a8","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22574-01-2","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Hydroxyphenylorciprenaline","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"5-(1-Hydroxy-2-((1-(4-hydroxyphenyl)-1-methylethyl)amino)ethyl)-1,3-benzenediol","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"OH-Phenylorciprenaline","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"e1c13e095a250c4e62ed04b970e404ab195c58c8","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"ecfa842d717a587ac9542414e75ded8ab41106a8","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22574-05-6","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["b1501c45-e167-4c30-aa5e-0a7f35d7f352"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Propanoic acid, 2-hydrazino-2-methyl- (9CI)","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["b1501c45-e167-4c30-aa5e-0a7f35d7f352"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Propionic acid, 2-hydrazino-2-methyl-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["b1501c45-e167-4c30-aa5e-0a7f35d7f352"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"2-04-00-00965 (Beilstein Handbook Reference)","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["b1501c45-e167-4c30-aa5e-0a7f35d7f352"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"BRN 1751765","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["b1501c45-e167-4c30-aa5e-0a7f35d7f352"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"alpha-Hydrazinoisobuttersaeure [German]","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["b1501c45-e167-4c30-aa5e-0a7f35d7f352"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Hydrazinoisobutyric acid","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["b1501c45-e167-4c30-aa5e-0a7f35d7f352"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"2-Hydrazino-2-methylpropionic acid","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["b1501c45-e167-4c30-aa5e-0a7f35d7f352"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"alpha-Hydrazinoisobuttersaeure","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["b1501c45-e167-4c30-aa5e-0a7f35d7f352"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22574-05-6","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["d644a8c5-8566-4593-846f-94628f0f997b"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"d644a8c5-8566-4593-846f-94628f0f997b","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"b1501c45-e167-4c30-aa5e-0a7f35d7f352","citation":"File null imported on Fri Feb 17 09:20:49 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n  8  7  0  0  0  0  0  0  0  0999 V2000\n    2.1730    0.7444    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.1730   -0.5056    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.9230   -0.5056    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.0905    1.3694    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    3.2555    1.3694    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    2.1730   -1.7556    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.0480   -1.5881    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    3.4230   -0.5056    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  1  4  2  0  0  0  0\n  1  5  1  0  0  0  0\n  2  6  1  0  0  0  0\n  7  8  1  0  0  0  0\n  2  8  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["b1501c45-e167-4c30-aa5e-0a7f35d7f352"],"hash":null,"_matchContext":null},"moieties":[],"_name":"alpha-Hydrazinoisobuttersaeure [German]","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22574-05-6","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Propanoic acid, 2-hydrazino-2-methyl- (9CI)","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Propionic acid, 2-hydrazino-2-methyl-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"2-04-00-00965 (Beilstein Handbook Reference)","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"BRN 1751765","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"alpha-Hydrazinoisobuttersaeure [German]","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Hydrazinoisobutyric acid","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"2-Hydrazino-2-methylpropionic acid","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"alpha-Hydrazinoisobuttersaeure","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"86da99c96e8993e75f96f80fb8da33b3c177b364","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"7876252847472a8c72136df6b57d1f2007e8f27f","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22574-05-6","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Propanoic acid, 2-hydrazino-2-methyl- (9CI)","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Propionic acid, 2-hydrazino-2-methyl-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"2-04-00-00965 (Beilstein Handbook Reference)","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"BRN 1751765","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"alpha-Hydrazinoisobuttersaeure [German]","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Hydrazinoisobutyric acid","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"2-Hydrazino-2-methylpropionic acid","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"alpha-Hydrazinoisobuttersaeure","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"86da99c96e8993e75f96f80fb8da33b3c177b364","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"7876252847472a8c72136df6b57d1f2007e8f27f","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22574-45-4","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["36d16945-02e2-4cbd-89f8-512b1f588d78"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"9H-Pyrido(3,4-b)indole, 1,9-dimethyl-6-methoxy-, monohydrochloride","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["36d16945-02e2-4cbd-89f8-512b1f588d78"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"1,9-Dimethyl-6-methoxy-9H-pyrido(3,4-b)indole monohydrochloride","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["36d16945-02e2-4cbd-89f8-512b1f588d78"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22574-45-4","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["995e4e59-5510-4916-8967-62e42cf26f82"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"995e4e59-5510-4916-8967-62e42cf26f82","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"36d16945-02e2-4cbd-89f8-512b1f588d78","citation":"File null imported on Fri Feb 17 09:20:49 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n 19 20  0  0  0  0  0  0  0  0999 V2000\n    5.2251   -3.8967    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    4.7403   -4.5663    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.2251   -5.2317    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0097   -4.9788    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.7256   -5.3913    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.4414   -4.9788    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.4414   -4.1538    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.7256   -3.7413    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0097   -4.1538    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.9222   -4.6511    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.8916   -5.9861    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.0693   -6.0710    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.5846   -5.4055    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    4.9721   -3.1120    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.4374   -3.9815    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.1531   -5.3913    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    8.8690   -4.9788    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.2286   -7.4313    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n    6.9715   -6.6466    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  2  0  0  0  0\n  6  7  1  0  0  0  0\n  7  8  2  0  0  0  0\n  8  9  1  0  0  0  0\n  1  9  1  0  0  0  0\n  4  9  2  0  0  0  0\n 11 12  1  0  0  0  0\n 12 13  2  0  0  0  0\n 10 13  1  0  0  0  0\n  2 10  2  0  0  0  0\n  3 11  2  0  0  0  0\n  1 14  1  0  0  0  0\n 10 15  1  0  0  0  0\n 16 17  1  0  0  0  0\n  6 16  1  0  0  0  0\n 18 19  1  0  0  0  0\nM  STY  1   1 MOD\nM  SAL   1  2  18  19\nM  SCN  1   1 HT\nM  SDI   1  4    6.3800   -7.9000    6.3800   -6.2500\nM  SDI   1  4    7.6000   -6.2500    7.6000   -7.9000\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["36d16945-02e2-4cbd-89f8-512b1f588d78"],"hash":null,"_matchContext":null},"moieties":[],"_name":"9H-Pyrido(3,4-b)indole, 1,9-dimethyl-6-methoxy-, monohydrochloride","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22574-45-4","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"9H-Pyrido(3,4-b)indole, 1,9-dimethyl-6-methoxy-, monohydrochloride","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"1,9-Dimethyl-6-methoxy-9H-pyrido(3,4-b)indole monohydrochloride","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"2cb1b726cad14e60c0682f0e740e798a14d3c86c","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"23ecdf6f6d1309ca9f7f0860a4dc390fac49acb0","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22574-45-4","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"9H-Pyrido(3,4-b)indole, 1,9-dimethyl-6-methoxy-, monohydrochloride","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"1,9-Dimethyl-6-methoxy-9H-pyrido(3,4-b)indole monohydrochloride","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"2cb1b726cad14e60c0682f0e740e798a14d3c86c","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"23ecdf6f6d1309ca9f7f0860a4dc390fac49acb0","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22574-47-6","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["abb8508a-d2c4-42d0-b645-4884abe58870"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"3-(2-Thienyl)alanine","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["abb8508a-d2c4-42d0-b645-4884abe58870"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"3-Thiophenepropanoic acid, alpha-amino-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["abb8508a-d2c4-42d0-b645-4884abe58870"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"AI3-61815","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["abb8508a-d2c4-42d0-b645-4884abe58870"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22574-47-6","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["a9a3db71-da0a-49ef-9870-b7b14b53c33b"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"a9a3db71-da0a-49ef-9870-b7b14b53c33b","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"abb8508a-d2c4-42d0-b645-4884abe58870","citation":"File null imported on Fri Feb 17 09:20:50 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n 11 11  0  0  0  0  0  0  0  0999 V2000\n    7.1125   -4.0891    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0299   -5.9641    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0299   -4.7141    0.0000 C   0  0  1  0  0  0  0  0  0  0  0  0\n    4.9474   -4.0891    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.1125   -2.8391    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    8.1950   -4.7141    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    3.8649   -4.7141    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.7342   -5.9573    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.5115   -6.2171    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8865   -5.1346    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.7229   -4.2057    0.0000 S   0  0  0  0  0  0  0  0  0  0  0  0\n  3  2  1  1  0  0  0\n  1  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  1  5  2  0  0  0  0\n  1  6  1  0  0  0  0\n  7  8  2  0  0  0  0\n  8  9  1  0  0  0  0\n  9 10  2  0  0  0  0\n 10 11  1  0  0  0  0\n  7 11  1  0  0  0  0\n  4  7  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["abb8508a-d2c4-42d0-b645-4884abe58870"],"hash":null,"_matchContext":null},"moieties":[],"_name":"AI3-61815","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22574-47-6","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"3-(2-Thienyl)alanine","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"3-Thiophenepropanoic acid, alpha-amino-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"AI3-61815","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"f3c74cbbb69fdee43297c991dbb713b77e15aa32","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"237567a24bfaf7560fb920bd991812c0aec3f427","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22574-47-6","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"3-(2-Thienyl)alanine","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"3-Thiophenepropanoic acid, alpha-amino-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"AI3-61815","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"f3c74cbbb69fdee43297c991dbb713b77e15aa32","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"237567a24bfaf7560fb920bd991812c0aec3f427","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22575-27-5","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["d5fcd118-0db2-476f-9cb5-f26c93bc3334"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Cholest-5-en-3beta-yl p-chlorobenzoate","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["d5fcd118-0db2-476f-9cb5-f26c93bc3334"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"EINECS 245-097-2","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["d5fcd118-0db2-476f-9cb5-f26c93bc3334"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22575-27-5","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["6e0d01aa-ea9c-48cd-83b7-e04b298aeba8"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"6e0d01aa-ea9c-48cd-83b7-e04b298aeba8","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"d5fcd118-0db2-476f-9cb5-f26c93bc3334","citation":"File null imported on Fri Feb 17 09:20:50 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n 37 41  0  0  0  0  0  0  0  0999 V2000\n    2.4890  -10.7691    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.7745  -11.1752    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.4487   -9.9847    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.0522  -10.7596    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.7824  -11.9970    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.3457  -11.9875    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.3378  -11.1657    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.0680  -12.4031    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.3687  -12.3936    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    7.4989   -8.7403    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.3535   -9.9623    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.3614  -10.7840    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.5067   -9.5620    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0700   -9.5525    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.7923   -9.9681    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.2697   -8.4867    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0837  -11.1996    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.7766   -8.3246    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.7981  -10.7935    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.0622   -8.7308    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.2941   -9.8228    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.6312   -9.5466    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.7716   -9.1601    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.2103  -11.1807    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    4.6470  -11.1902    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.9247  -10.7745    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.8902   -7.7493    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.9168   -9.9528    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.4840   -7.8739    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.3477   -9.1369    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.1049   -7.7147    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.5423   -8.1840    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.8565   -6.9004    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.7612   -8.1244    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.3738   -7.7217    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.0717   -8.1355    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.3748   -6.8915    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  9  6  1  0  0  0  0\n  7  6  1  0  0  0  0\n  2  1  1  0  0  0  0\n  3  1  2  0  0  0  0\n  4  2  1  0  0  0  0\n  5  2  2  0  0  0  0\n  6  8  2  0  0  0  0\n  7  4  2  0  0  0  0\n  8  5  1  0  0  0  0\n 11 14  1  0  0  0  0\n 12 11  1  0  0  0  0\n 13 10  1  0  0  0  0\n 14 20  1  0  0  0  0\n 15 13  1  0  0  0  0\n 16 10  1  0  0  0  0\n 17 19  1  0  0  0  0\n 18 10  1  0  0  0  0\n 19 15  1  0  0  0  0\n 20 18  1  0  0  0  0\n 21 13  1  0  0  0  0\n 22 11  1  0  0  0  0\n 23 16  1  0  0  0  0\n 24 26  1  0  0  0  0\n 25 12  1  0  0  0  0\n 26 25  1  0  0  0  0\n 27 16  1  0  0  0  0\n 28 22  1  0  0  0  0\n 29 10  1  0  0  0  0\n 30 11  1  0  0  0  0\n 31 32  1  0  0  0  0\n 32 27  1  0  0  0  0\n 33 27  1  0  0  0  0\n 34 31  1  0  0  0  0\n 35 34  1  0  0  0  0\n 36 35  1  0  0  0  0\n 37 35  1  0  0  0  0\n 23 21  1  0  0  0  0\n 15 14  1  0  0  0  0\n 17 12  2  0  0  0  0\n 26 28  1  0  0  0  0\n 24  1  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["d5fcd118-0db2-476f-9cb5-f26c93bc3334"],"hash":null,"_matchContext":null},"moieties":[],"_name":"EINECS 245-097-2","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22575-27-5","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Cholest-5-en-3beta-yl p-chlorobenzoate","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"EINECS 245-097-2","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"45494dea3445dd34091e2d5da3e24becaf494439","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"2e52388d39c8ed2a48759092f04e5981c2fb8b89","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22575-27-5","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Cholest-5-en-3beta-yl p-chlorobenzoate","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"EINECS 245-097-2","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"45494dea3445dd34091e2d5da3e24becaf494439","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"2e52388d39c8ed2a48759092f04e5981c2fb8b89","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22576-65-4","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["2c0d604e-8d93-41e1-8a30-99d4875dc2ed"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"2-Propanol, 1-chloro-3-(1,1-dimethylethoxy)-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["2c0d604e-8d93-41e1-8a30-99d4875dc2ed"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22576-65-4","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["80dccc45-a11e-4265-8686-489e7f7b355d"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"80dccc45-a11e-4265-8686-489e7f7b355d","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"2c0d604e-8d93-41e1-8a30-99d4875dc2ed","citation":"File null imported on Fri Feb 17 09:20:50 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n 10  9  0  0  0  0  0  0  0  0999 V2000\n   -0.6403   -2.6029    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0818   -3.0121    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.7919   -2.6029    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0818   -3.8546    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.3778   -3.0604    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    1.5261   -3.0121    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    2.2482   -2.5909    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.1186   -2.1238    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.9703   -3.0121    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.2452   -1.6517    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  1  0  0  0  0\n  5  1  1  0  0  0  0\n  3  2  1  0  0  0  0\n  4  2  1  0  0  0  0\n  6  3  1  0  0  0  0\n  7  6  1  0  0  0  0\n  8  7  1  0  0  0  0\n  9  7  1  0  0  0  0\n 10  7  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["2c0d604e-8d93-41e1-8a30-99d4875dc2ed"],"hash":null,"_matchContext":null},"moieties":[],"_name":"22576-65-4","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22576-65-4","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"2-Propanol, 1-chloro-3-(1,1-dimethylethoxy)-","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"3e27c92dc36d356f1ec95e376ec79cdbb181147d","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"c4b1e45fe54b214e9bf590eca5116ec91ec209eb","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22576-65-4","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"2-Propanol, 1-chloro-3-(1,1-dimethylethoxy)-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"3e27c92dc36d356f1ec95e376ec79cdbb181147d","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"c4b1e45fe54b214e9bf590eca5116ec91ec209eb","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22577-66-8","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4b2bf5da-1b95-43d7-9160-5a2c95e53551"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Mercury, (2-methoxyethyl)(trihydrogen orthosilicato)-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4b2bf5da-1b95-43d7-9160-5a2c95e53551"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Ceresan universal dry seed treatment","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4b2bf5da-1b95-43d7-9160-5a2c95e53551"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Methoxyaethyl-quecksilber silicat [German]","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4b2bf5da-1b95-43d7-9160-5a2c95e53551"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Methoxyethylmercury silicate","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4b2bf5da-1b95-43d7-9160-5a2c95e53551"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Sanigran","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4b2bf5da-1b95-43d7-9160-5a2c95e53551"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Tillantin S","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4b2bf5da-1b95-43d7-9160-5a2c95e53551"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Tillantin-S-torbejdse","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4b2bf5da-1b95-43d7-9160-5a2c95e53551"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Methoxyaethyl-quecksilber silicat","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["4b2bf5da-1b95-43d7-9160-5a2c95e53551"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22577-66-8","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["e3207e5c-3b29-4e87-ac28-e1e67c4043c1"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"e3207e5c-3b29-4e87-ac28-e1e67c4043c1","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"4b2bf5da-1b95-43d7-9160-5a2c95e53551","citation":"File null imported on Fri Feb 17 09:20:50 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n 10  8  0  0  0  0  0  0  0  0999 V2000\n    5.5065   -2.4961    0.0000 Hg  0  3  0  0  0  0  0  0  0  0  0  0\n    4.1892   -3.3030    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.7789   -2.5478    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    1.4272   -3.3754    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.0272   -2.6030    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.7744   -3.3936    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   11.1502   -2.5592    0.0000 Si  0  0  0  0  0  0  0  0  0  0  0  0\n   12.5123   -1.7316    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0\n   10.2950   -1.1971    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   11.9813   -3.8971    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  4  5  1  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  6  7  1  0  0  0  0\n  7  8  1  0  0  0  0\n  7  9  1  0  0  0  0\n  7 10  1  0  0  0  0\nM  CHG  1   1   1\nM  CHG  1   8  -1\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["4b2bf5da-1b95-43d7-9160-5a2c95e53551"],"hash":null,"_matchContext":null},"moieties":[],"_name":"Tillantin-S-torbejdse","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22577-66-8","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Mercury, (2-methoxyethyl)(trihydrogen orthosilicato)-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Ceresan universal dry seed treatment","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Methoxyaethyl-quecksilber silicat [German]","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Methoxyethylmercury silicate","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Sanigran","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Tillantin S","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Tillantin-S-torbejdse","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Methoxyaethyl-quecksilber silicat","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"1e47c7ec716eea9ff3821f5705808034d1455891","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"bcaaf2e7e4e0a702569fc3bed919cb8490b2346c","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22577-66-8","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Mercury, (2-methoxyethyl)(trihydrogen orthosilicato)-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Ceresan universal dry seed treatment","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Methoxyaethyl-quecksilber silicat [German]","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Methoxyethylmercury silicate","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Sanigran","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Tillantin S","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Tillantin-S-torbejdse","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Methoxyaethyl-quecksilber silicat","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"1e47c7ec716eea9ff3821f5705808034d1455891","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"bcaaf2e7e4e0a702569fc3bed919cb8490b2346c","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22578-17-2","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["fbe79359-ad26-4424-adb7-92594c0d6c1e"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Pentafluorostannite sodium","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["fbe79359-ad26-4424-adb7-92594c0d6c1e"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Sodium mu-fluorotetrafluorodistannate(1-)","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["fbe79359-ad26-4424-adb7-92594c0d6c1e"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Sodium pentafluorodistannate(II) (7CI)","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["fbe79359-ad26-4424-adb7-92594c0d6c1e"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Sodium pentafluorostannite","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["fbe79359-ad26-4424-adb7-92594c0d6c1e"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Sodium tin fluoride (NaSn2F5)","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["fbe79359-ad26-4424-adb7-92594c0d6c1e"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Sodium tin fluostannate(II) (6CI)","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["fbe79359-ad26-4424-adb7-92594c0d6c1e"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Stannate(1-), mu-fluorotetrafluorodi-, sodium","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["fbe79359-ad26-4424-adb7-92594c0d6c1e"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22578-17-2","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["c58e7a78-f0e5-4693-858c-74f34647c936"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"c58e7a78-f0e5-4693-858c-74f34647c936","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"fbe79359-ad26-4424-adb7-92594c0d6c1e","citation":"File null imported on Fri Feb 17 09:20:50 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n  7  5  0  0  0  0  0  0  0  0999 V2000\n   -3.5648    0.0026    0.0000 Na  0  0  0  0  0  0  0  0  0  0  0  0\n    1.4662   -0.2622    0.0000 Sn  0  0  0  0  0  0  0  0  0  0  0  0\n    1.8525   -1.4510    0.0000 F   0  0  0  0  0  0  0  0  0  0  0  0\n    0.4549   -0.9970    0.0000 F   0  0  0  0  0  0  0  0  0  0  0  0\n    0.4549    0.4725    0.0000 F   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8525    0.9266    0.0000 F   0  0  0  0  0  0  0  0  0  0  0  0\n    2.7162   -0.2622    0.0000 F   0  0  0  0  0  0  0  0  0  0  0  0\n  2  3  1  0  0  0  0\n  2  4  1  0  0  0  0\n  2  5  1  0  0  0  0\n  2  6  1  0  0  0  0\n  2  7  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["fbe79359-ad26-4424-adb7-92594c0d6c1e"],"hash":null,"_matchContext":null},"moieties":[],"_name":"Stannate(1-), mu-fluorotetrafluorodi-, sodium","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22578-17-2","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Pentafluorostannite sodium","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Sodium mu-fluorotetrafluorodistannate(1-)","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Sodium pentafluorodistannate(II) (7CI)","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Sodium pentafluorostannite","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Sodium tin fluoride (NaSn2F5)","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Sodium tin fluostannate(II) (6CI)","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Stannate(1-), mu-fluorotetrafluorodi-, sodium","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"f492b05a4cb937d7c2549422ced2e21e9edc6df1","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"80ca9595f5f9ec604b8b0727de5f694b4f05c619","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22578-17-2","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Pentafluorostannite sodium","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Sodium mu-fluorotetrafluorodistannate(1-)","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Sodium pentafluorodistannate(II) (7CI)","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Sodium pentafluorostannite","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Sodium tin fluoride (NaSn2F5)","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Sodium tin fluostannate(II) (6CI)","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Stannate(1-), mu-fluorotetrafluorodi-, sodium","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"f492b05a4cb937d7c2549422ced2e21e9edc6df1","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"80ca9595f5f9ec604b8b0727de5f694b4f05c619","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22578-82-1","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["8c925c47-38cd-4e35-9440-2a9aca66cf89"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Neptunium, ion (Np4+)","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["8c925c47-38cd-4e35-9440-2a9aca66cf89"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22578-82-1","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["42f4cc1f-c0f2-41d6-a711-024ab465a544"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"42f4cc1f-c0f2-41d6-a711-024ab465a544","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"8c925c47-38cd-4e35-9440-2a9aca66cf89","citation":"File null imported on Fri Feb 17 09:20:51 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n  1  0  0  0  0  0  0  0  0  0999 V2000\n    3.4292   -6.2417    0.0000 Np  0  0  0  0  0  0  0  0  0  0  0  0\nM  CHG  1   1   4\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["8c925c47-38cd-4e35-9440-2a9aca66cf89"],"hash":null,"_matchContext":null},"moieties":[],"_name":"Neptunium, ion (Np4+)","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22578-82-1","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Neptunium, ion (Np4+)","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"234c9feac078105ef6b8d20ff110efa731d90884","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"6f464f295549ea2e1ad2b4d10623707a687403bc","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22578-82-1","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Neptunium, ion (Np4+)","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"234c9feac078105ef6b8d20ff110efa731d90884","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"6f464f295549ea2e1ad2b4d10623707a687403bc","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22578-86-5","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"N-(2-((2-Bromo-4,6-dinitrophenyl)azo)-5-((2-cyanoethyl)ethylamino)-4-methoxyphenyl)acetamide","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Acetamide, N-(2-(2-(2-bromo-4,6-dinitrophenyl)diazenyl)-5-((2-cyanoethyl)ethylamino)-4-methoxyphenyl)-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Acetamide, N-(2-((2-bromo-4,6-dinitrophenyl)azo)-5-((2-cyanoethyl)ethylamino)-4-methoxyphenyl)-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"p-Acetanisidide, 2'-((2-bromo-4,6-dinitrophenyl)azo)-5'-(N-(2-cyanoethyl)-N-ethylamino)-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"p-Acetanisidide, 2'-((2-bromo-4,6-dinitrophenyl)azo)-5'-((2-cyanoethyl)ethylamino)-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"5-((2-Bromo-4,6-dinitrophenyl)azo)-4-acetamido-2-((2-cyanoethyl)ethylamino)anisole","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"2'-((2-Bromo-4,6-dinitrophenyl)azo)-5'-((2-cyanoethyl)ethylamino)-p-acetanisidide","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"3-(N-Cyanoethyl-N-ethylamino)-4-methoxy-6-((2-bromo-4,6-dinitrophenyl)azo)acetanilide","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"EINECS 245-098-8","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"N-Ethyl-N-(2-cyanoethyl)-5-acetamido-4-((6-bromo-2,4-dinitrophenyl)azo)-2-methoxyaniline","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22578-86-5","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["2b125892-f9b9-4b6e-9fd3-06c04260e1fb"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"2b125892-f9b9-4b6e-9fd3-06c04260e1fb","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"5d26181c-a9d7-4379-a975-3bfbe233490b","citation":"File null imported on Fri Feb 17 09:20:51 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n 34 35  0  0  0  0  0  0  0  0999 V2000\n    3.1168  -11.5168    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    3.1183  -10.5133    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.9811  -10.0182    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    4.8458  -10.5205    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7166  -10.0219    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7208   -9.0219    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    6.5889   -8.5255    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    6.5929   -7.5255    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7266   -7.0193    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7327   -6.0246    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.6002   -5.5272    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.6019   -4.5272    0.0000 N   0  3  0  0  0  0  0  0  0  0  0  0\n    5.7340   -4.0237    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    7.4640   -4.0307    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0\n    7.4617   -6.0247    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.4606   -7.0281    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.3256   -7.5300    0.0000 N   0  3  0  0  0  0  0  0  0  0  0  0\n    9.1959   -7.0306    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0\n    8.3239   -8.5248    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    4.8577   -7.5144    0.0000 Br  0  0  0  0  0  0  0  0  0  0  0  0\n    6.5758  -10.5233    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.5742  -11.5233    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.4401  -12.0234    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    8.3063  -11.5234    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7133  -12.0219    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7143  -13.0219    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    6.5760  -13.5190    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.5752  -14.5224    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7089  -15.0218    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.8425  -15.5212    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    4.8460  -13.5248    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.9843  -13.0277    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.8442  -11.5205    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.2533  -10.0115    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  1  0  0  0  0\n  6  7  2  0  0  0  0\n  7  8  1  0  0  0  0\n  8  9  1  0  0  0  0\n  9 10  2  0  0  0  0\n 10 11  1  0  0  0  0\n 11 12  1  0  0  0  0\n 12 13  2  0  0  0  0\n 12 14  1  0  0  0  0\n 11 15  2  0  0  0  0\n 15 16  1  0  0  0  0\n 16  8  2  0  0  0  0\n 16 17  1  0  0  0  0\n 17 18  1  0  0  0  0\n 17 19  2  0  0  0  0\n  9 20  1  0  0  0  0\n  5 21  2  0  0  0  0\n 21 22  1  0  0  0  0\n 22 23  1  0  0  0  0\n 23 24  1  0  0  0  0\n 22 25  2  0  0  0  0\n 25 26  1  0  0  0  0\n 26 27  1  0  0  0  0\n 27 28  1  0  0  0  0\n 28 29  1  0  0  0  0\n 29 30  3  0  0  0  0\n 26 31  1  0  0  0  0\n 31 32  1  0  0  0  0\n 25 33  1  0  0  0  0\n 33  4  2  0  0  0  0\n  2 34  1  0  0  0  0\nM  CHG  1  12   1\nM  CHG  1  14  -1\nM  CHG  1  17   1\nM  CHG  1  18  -1\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["5d26181c-a9d7-4379-a975-3bfbe233490b"],"hash":null,"_matchContext":null},"moieties":[],"_name":"p-Acetanisidide, 2'-((2-bromo-4,6-dinitrophenyl)azo)-5'-(N-(2-cyanoethyl)-N-ethylamino)-","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22578-86-5","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"N-(2-((2-Bromo-4,6-dinitrophenyl)azo)-5-((2-cyanoethyl)ethylamino)-4-methoxyphenyl)acetamide","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Acetamide, N-(2-(2-(2-bromo-4,6-dinitrophenyl)diazenyl)-5-((2-cyanoethyl)ethylamino)-4-methoxyphenyl)-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Acetamide, N-(2-((2-bromo-4,6-dinitrophenyl)azo)-5-((2-cyanoethyl)ethylamino)-4-methoxyphenyl)-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"p-Acetanisidide, 2'-((2-bromo-4,6-dinitrophenyl)azo)-5'-(N-(2-cyanoethyl)-N-ethylamino)-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"p-Acetanisidide, 2'-((2-bromo-4,6-dinitrophenyl)azo)-5'-((2-cyanoethyl)ethylamino)-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"5-((2-Bromo-4,6-dinitrophenyl)azo)-4-acetamido-2-((2-cyanoethyl)ethylamino)anisole","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"2'-((2-Bromo-4,6-dinitrophenyl)azo)-5'-((2-cyanoethyl)ethylamino)-p-acetanisidide","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"3-(N-Cyanoethyl-N-ethylamino)-4-methoxy-6-((2-bromo-4,6-dinitrophenyl)azo)acetanilide","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"EINECS 245-098-8","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"N-Ethyl-N-(2-cyanoethyl)-5-acetamido-4-((6-bromo-2,4-dinitrophenyl)azo)-2-methoxyaniline","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"7c301d4d6dfc2f0b3fe7431654115b60eb811824","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"a7c105fcaf08c71451b8e9a510d6d038f4ecbd3b","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22578-86-5","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"N-(2-((2-Bromo-4,6-dinitrophenyl)azo)-5-((2-cyanoethyl)ethylamino)-4-methoxyphenyl)acetamide","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Acetamide, N-(2-(2-(2-bromo-4,6-dinitrophenyl)diazenyl)-5-((2-cyanoethyl)ethylamino)-4-methoxyphenyl)-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Acetamide, N-(2-((2-bromo-4,6-dinitrophenyl)azo)-5-((2-cyanoethyl)ethylamino)-4-methoxyphenyl)-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"p-Acetanisidide, 2'-((2-bromo-4,6-dinitrophenyl)azo)-5'-(N-(2-cyanoethyl)-N-ethylamino)-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"p-Acetanisidide, 2'-((2-bromo-4,6-dinitrophenyl)azo)-5'-((2-cyanoethyl)ethylamino)-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"5-((2-Bromo-4,6-dinitrophenyl)azo)-4-acetamido-2-((2-cyanoethyl)ethylamino)anisole","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"2'-((2-Bromo-4,6-dinitrophenyl)azo)-5'-((2-cyanoethyl)ethylamino)-p-acetanisidide","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"3-(N-Cyanoethyl-N-ethylamino)-4-methoxy-6-((2-bromo-4,6-dinitrophenyl)azo)acetanilide","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"EINECS 245-098-8","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"N-Ethyl-N-(2-cyanoethyl)-5-acetamido-4-((6-bromo-2,4-dinitrophenyl)azo)-2-methoxyaniline","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"7c301d4d6dfc2f0b3fe7431654115b60eb811824","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"a7c105fcaf08c71451b8e9a510d6d038f4ecbd3b","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22578-94-5","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["26e35045-47b0-472c-89d8-1bcb1d36650a"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"N,N'-(1,4-Phenylenedicarbonyl)diglycine","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["26e35045-47b0-472c-89d8-1bcb1d36650a"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"EINECS 245-099-3","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["26e35045-47b0-472c-89d8-1bcb1d36650a"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22578-94-5","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["8d1d53a5-820c-44f3-825c-bd8fdb15ee25"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"8d1d53a5-820c-44f3-825c-bd8fdb15ee25","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"26e35045-47b0-472c-89d8-1bcb1d36650a","citation":"File null imported on Fri Feb 17 09:20:51 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n 20 20  0  0  0  0  0  0  0  0999 V2000\n    8.3625  -10.3625    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    9.7875  -10.4055    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.7560  -11.2231    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    9.0839   -9.9807    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.5204  -10.0090    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    7.6515   -9.9511    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.7390  -11.4752    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.0316  -11.0347    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    6.9234  -10.3322    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.4672  -11.0942    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.5961  -10.9752    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.6381   -9.1875    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    4.7183  -12.2968    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8715  -11.3585    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    6.9027  -11.1537    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.1745  -11.5347    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.4879  -10.2727    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.2160   -9.8917    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.3035  -11.4158    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.6204  -10.1559    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n  2  4  1  0  0  0  0\n  3  2  2  0  0  0  0\n  4  1  1  0  0  0  0\n  5  2  1  0  0  0  0\n  7 10  1  0  0  0  0\n  8  7  1  0  0  0  0\n  9  6  1  0  0  0  0\n 10 17  1  0  0  0  0\n 11 19  1  0  0  0  0\n 12  6  2  0  0  0  0\n 13  7  2  0  0  0  0\n 14 11  1  0  0  0  0\n 15  9  2  0  0  0  0\n 16 15  1  0  0  0  0\n 17 18  2  0  0  0  0\n 18  9  1  0  0  0  0\n 19  8  1  0  0  0  0\n 20 11  2  0  0  0  0\n 16 10  2  0  0  0  0\n  6  1  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["26e35045-47b0-472c-89d8-1bcb1d36650a"],"hash":null,"_matchContext":null},"moieties":[],"_name":"N,N'-(1,4-Phenylenedicarbonyl)diglycine","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22578-94-5","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"N,N'-(1,4-Phenylenedicarbonyl)diglycine","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"EINECS 245-099-3","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"e19d31e373f0f37db7fb0c4b65c9d2ffc1a10a56","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"01229a6be58ee5407c951914c502e8f644f26a66","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22578-94-5","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"N,N'-(1,4-Phenylenedicarbonyl)diglycine","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"EINECS 245-099-3","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"e19d31e373f0f37db7fb0c4b65c9d2ffc1a10a56","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"01229a6be58ee5407c951914c502e8f644f26a66","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22580-55-8","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["d32a9a5a-748e-44a5-a3de-b06375ab4b9b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Hydrogen tribromide, compound with pyrrolidin-2-one (1:3)","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["d32a9a5a-748e-44a5-a3de-b06375ab4b9b"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"EINECS 245-100-7","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["d32a9a5a-748e-44a5-a3de-b06375ab4b9b"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22580-55-8","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["095be176-94c9-4d0d-b9ef-60c669539c4f"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"095be176-94c9-4d0d-b9ef-60c669539c4f","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"d32a9a5a-748e-44a5-a3de-b06375ab4b9b","citation":"File null imported on Fri Feb 17 09:20:51 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n  7  7  0  0  0  0  0  0  0  0999 V2000\n    4.5691   -0.1807    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    3.6180    0.1284    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.3090    1.0794    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.3090    1.0794    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.0000    0.1284    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8090   -0.4594    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8090   -1.0794    0.0000 H   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  2  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  1  0  0  0  0\n  2  6  1  0  0  0  0\n  6  7  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["d32a9a5a-748e-44a5-a3de-b06375ab4b9b"],"hash":null,"_matchContext":null},"moieties":[],"_name":"Hydrogen tribromide, compound with pyrrolidin-2-one (1:3)","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22580-55-8","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Hydrogen tribromide, compound with pyrrolidin-2-one (1:3)","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"EINECS 245-100-7","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"93d5b64e13cdb0cf9028b9880bb5aa1a6d54273f","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"0b1e2d5bbf4f7b185c96fac2171e5fb093007f1b","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22580-55-8","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Hydrogen tribromide, compound with pyrrolidin-2-one (1:3)","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"EINECS 245-100-7","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"93d5b64e13cdb0cf9028b9880bb5aa1a6d54273f","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"0b1e2d5bbf4f7b185c96fac2171e5fb093007f1b","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"22581-05-1","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["674a1d6d-26da-4a40-8ff5-2f4fc15866e4"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"1-Cyanoprop-1-enyl acetate","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["674a1d6d-26da-4a40-8ff5-2f4fc15866e4"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"EINECS 245-101-2","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["674a1d6d-26da-4a40-8ff5-2f4fc15866e4"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22581-05-1","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["0000bd41-75ef-4e0b-a78a-6543b80dd94f"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"0000bd41-75ef-4e0b-a78a-6543b80dd94f","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"674a1d6d-26da-4a40-8ff5-2f4fc15866e4","citation":"File null imported on Fri Feb 17 09:20:51 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n  9  8  0  0  0  0  0  0  0  0999 V2000\n    5.0792   -8.0875    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    5.0875   -8.8125    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.0875   -9.6458    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.5042   -9.6458    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.7958  -10.0625    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    6.5042   -8.8125    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    4.3292   -9.6500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.2125  -10.0625    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.7042   -9.6500    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  2  1  3  0  0  0  0\n  3  2  1  0  0  0  0\n  4  5  1  0  0  0  0\n  5  3  1  0  0  0  0\n  6  4  2  0  0  0  0\n  7  3  2  0  0  0  0\n  8  4  1  0  0  0  0\n  9  7  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["674a1d6d-26da-4a40-8ff5-2f4fc15866e4"],"hash":null,"_matchContext":null},"moieties":[],"_name":"EINECS 245-101-2","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"22581-05-1","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"1-Cyanoprop-1-enyl acetate","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"EINECS 245-101-2","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"29bb24c3ce09ec60a7ff9e5238c5d771d7548b77","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"7a7901a98b7cba8ea1cbaf9f60bc6791777a9312","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"22581-05-1","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"1-Cyanoprop-1-enyl acetate","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"EINECS 245-101-2","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"29bb24c3ce09ec60a7ff9e5238c5d771d7548b77","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"7a7901a98b7cba8ea1cbaf9f60bc6791777a9312","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"69CA58161M","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["f5c13e2c-4d52-48db-9714-73edf0986ff7"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"0022581062","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["f5c13e2c-4d52-48db-9714-73edf0986ff7"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Ilicicolin A","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["f5c13e2c-4d52-48db-9714-73edf0986ff7"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Benzaldehyde, 3-chloro-4,6-dihydroxy-2-methyl-5-(3,7,11-trimethyl-2,6,10-dodecatrienyl)-, (E,E)-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["f5c13e2c-4d52-48db-9714-73edf0986ff7"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"beta-Resorcylaldehyde, 5-chloro-6-methyl-3-(3,7,11-trimethyl-2,6,10-dodecatrienyl)- (8CI)","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["f5c13e2c-4d52-48db-9714-73edf0986ff7"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"BRN 2177332","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["f5c13e2c-4d52-48db-9714-73edf0986ff7"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"LL-Z 1272-alpha","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["f5c13e2c-4d52-48db-9714-73edf0986ff7"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"UNII-69CA58161M","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["f5c13e2c-4d52-48db-9714-73edf0986ff7"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22581-06-2","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["073fb22b-446b-4921-b6d6-b83f60b5e867"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"073fb22b-446b-4921-b6d6-b83f60b5e867","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"f5c13e2c-4d52-48db-9714-73edf0986ff7","citation":"File null imported on Fri Feb 17 09:20:52 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n 27 27  0  0  0  0  0  0  0  0999 V2000\n   -1.9808   -0.8815    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.3558    0.2010    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.9808    1.2836    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.3558    2.3661    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.1058    2.3661    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.5192    1.2836    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -0.1058    0.2010    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -3.2308   -0.8815    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.7692    1.2836    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.3942    0.2010    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.6442    0.2010    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2692   -0.8815    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.5192   -0.8815    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.1442   -1.9640    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.3942   -1.9640    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.0192   -3.0466    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.2692   -3.0466    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.8942   -1.9640    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.1442   -1.9640    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.7692   -0.8815    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.7692   -3.0466    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    8.0192   -0.8815    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2692    1.2836    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   -3.2308    1.2836    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    0.5192   -0.8815    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    0.5192    3.4486    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n   -1.9808    3.4486    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  2  0  0  0  0\n  4  5  1  0  0  0  0\n  5  6  2  0  0  0  0\n  6  7  1  0  0  0  0\n  2  7  2  0  0  0  0\n  1  8  2  0  0  0  0\n  9 10  1  0  0  0  0\n 10 11  2  0  0  0  0\n 11 12  1  0  0  0  0\n 12 13  1  0  0  0  0\n 13 14  1  0  0  0  0\n 14 15  2  0  0  0  0\n 15 16  1  0  0  0  0\n 16 17  1  0  0  0  0\n 17 18  1  0  0  0  0\n 18 19  2  0  0  0  0\n 19 20  1  0  0  0  0\n 19 21  1  0  0  0  0\n 15 22  1  0  0  0  0\n 11 23  1  0  0  0  0\n  6  9  1  0  0  0  0\n  3 24  1  0  0  0  0\n  7 25  1  0  0  0  0\n  5 26  1  0  0  0  0\n  4 27  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["f5c13e2c-4d52-48db-9714-73edf0986ff7"],"hash":null,"_matchContext":null},"moieties":[],"_name":"beta-Resorcylaldehyde, 5-chloro-6-methyl-3-(3,7,11-trimethyl-2,6,10-dodecatrienyl)- (8CI)","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"69CA58161M","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"0022581062","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Ilicicolin A","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Benzaldehyde, 3-chloro-4,6-dihydroxy-2-methyl-5-(3,7,11-trimethyl-2,6,10-dodecatrienyl)-, (E,E)-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"beta-Resorcylaldehyde, 5-chloro-6-methyl-3-(3,7,11-trimethyl-2,6,10-dodecatrienyl)- (8CI)","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"BRN 2177332","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"LL-Z 1272-alpha","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"UNII-69CA58161M","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"d9f6c2f634b30e867b158804bf2f91bd9a17b55f","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"3a8514462c09cadd19966c45d437f8b84be7cb57","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"69CA58161M","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"0022581062","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Ilicicolin A","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Benzaldehyde, 3-chloro-4,6-dihydroxy-2-methyl-5-(3,7,11-trimethyl-2,6,10-dodecatrienyl)-, (E,E)-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"beta-Resorcylaldehyde, 5-chloro-6-methyl-3-(3,7,11-trimethyl-2,6,10-dodecatrienyl)- (8CI)","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"BRN 2177332","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"LL-Z 1272-alpha","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"UNII-69CA58161M","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"d9f6c2f634b30e867b158804bf2f91bd9a17b55f","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"3a8514462c09cadd19966c45d437f8b84be7cb57","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"data":{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"definitionType":"PRIMARY","definitionLevel":"COMPLETE","substanceClass":"chemical","status":"pending","version":"1","approvedBy":null,"approved":null,"changeReason":null,"names":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"7A7A8AHW1U","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["73aa4f72-9645-49f7-b8ea-242ec0bbb71d"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"0022581073","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["73aa4f72-9645-49f7-b8ea-242ec0bbb71d"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Ilicicolin B","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["73aa4f72-9645-49f7-b8ea-242ec0bbb71d"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"UNII-7A7A8AHW1U","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["73aa4f72-9645-49f7-b8ea-242ec0bbb71d"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"Benzaldehyde, 2,4-dihydroxy-6-methyl-3-((2E,6E)-3,7,11-trimethyl-2,6,10-dodecatrien-1-yl)-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["73aa4f72-9645-49f7-b8ea-242ec0bbb71d"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"beta-Resorcylaldehyde, 6-methyl-3-(3,7,11-trimethyl-2,6,10-dodecatrienyl)-","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["73aa4f72-9645-49f7-b8ea-242ec0bbb71d"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"2,4-Dihydroxy-6-methyl-3-((2E,6E)-3,7,11-trimethyl-2,6,10-dodecatrien-1-yl)benzaldehyde","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["73aa4f72-9645-49f7-b8ea-242ec0bbb71d"],"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"name":"LL-Z 1272beta","stdName":null,"type":"cn","domains":[],"languages":["en"],"nameJurisdiction":[],"nameOrgs":[],"preferred":false,"displayName":false,"references":["73aa4f72-9645-49f7-b8ea-242ec0bbb71d"],"access":[],"_matchContext":null}],"codes":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":null,"codeSystem":"CASNUM","code":"22581-07-3","comments":null,"codeText":null,"type":"PRIMARY","url":null,"_isClassification":false,"references":["3771cb36-1252-4a7a-b641-af113f45dd12"],"access":[],"_matchContext":null}],"modifications":null,"notes":[],"properties":[],"relationships":[],"references":[{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"3771cb36-1252-4a7a-b641-af113f45dd12","citation":"System generated","docType":"SYSTEM","documentDate":null,"publicDomain":true,"tags":["PUBLIC_DOMAIN_RELEASE"],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null},{"created":null,"createdBy":null,"lastEdited":null,"lastEditedBy":null,"deprecated":false,"uuid":"73aa4f72-9645-49f7-b8ea-242ec0bbb71d","citation":"File null imported on Fri Feb 17 09:20:52 EST 2023","docType":"CATALOG","documentDate":null,"publicDomain":true,"tags":[],"uploadedFile":null,"id":null,"url":null,"access":[],"_matchContext":null}],"approvalID":null,"tags":[],"structure":{"id":null,"created":null,"lastEdited":null,"deprecated":false,"digest":null,"molfile":"\n  CDK     02172309202D\n\n 26 26  0  0  0  0  0  0  0  0999 V2000\n    7.6905   -6.2233    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.6677   -6.8138    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    6.6677   -7.9949    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    7.6905   -8.5855    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    5.6448   -8.5855    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.6219   -7.9950    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.5991   -8.5855    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    4.6219   -6.8139    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    3.5991   -6.2233    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    2.5762   -6.8139    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    5.6448   -6.2233    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    5.6448   -5.0422    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    8.7134   -6.8138    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.7363   -6.2233    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n    9.7363   -5.0422    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   10.7591   -6.8138    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   11.7820   -6.2233    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   12.8049   -6.8138    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.8277   -6.2233    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   13.8277   -5.0422    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   14.8506   -6.8138    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   15.8735   -6.2233    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   16.8963   -6.8138    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   17.9192   -6.2233    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   17.9192   -5.0422    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n   18.9421   -6.8138    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0\n  1  2  1  0  0  0  0\n  2  3  1  0  0  0  0\n  3  4  1  0  0  0  0\n  3  5  2  0  0  0  0\n  5  6  1  0  0  0  0\n  6  7  1  0  0  0  0\n  8  6  2  0  0  0  0\n  8  9  1  0  0  0  0\n  9 10  2  0  0  0  0\n 11  8  1  0  0  0  0\n  2 11  2  0  0  0  0\n 11 12  1  0  0  0  0\n  1 13  1  0  0  0  0\n 13 14  2  0  0  0  0\n 14 15  1  0  0  0  0\n 14 16  1  0  0  0  0\n 16 17  1  0  0  0  0\n 17 18  1  0  0  0  0\n 18 19  2  0  0  0  0\n 19 20  1  0  0  0  0\n 19 21  1  0  0  0  0\n 21 22  1  0  0  0  0\n 22 23  1  0  0  0  0\n 23 24  2  0  0  0  0\n 24 25  1  0  0  0  0\n 24 26  1  0  0  0  0\nM  END","smiles":null,"formula":null,"opticalActivity":null,"atropisomerism":"No","stereoComments":null,"stereoCenters":null,"definedStereo":null,"ezCenters":null,"charge":null,"mwt":0.0,"properties":[],"links":[],"count":1,"createdBy":null,"lastEditedBy":null,"stereochemistry":null,"stereoChemistry":null,"access":[],"references":["73aa4f72-9645-49f7-b8ea-242ec0bbb71d"],"hash":null,"_matchContext":null},"moieties":[],"_name":"beta-Resorcylaldehyde, 6-methyl-3-(3,7,11-trimethyl-2,6,10-dodecatrienyl)-","_approvalIDDisplay":"pending record","access":[],"_matchContext":null},"matches":{"query":[{"key":"Substance Name","value":"7A7A8AHW1U","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"0022581073","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Ilicicolin B","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"UNII-7A7A8AHW1U","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"Benzaldehyde, 2,4-dihydroxy-6-methyl-3-((2E,6E)-3,7,11-trimethyl-2,6,10-dodecatrien-1-yl)-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"beta-Resorcylaldehyde, 6-methyl-3-(3,7,11-trimethyl-2,6,10-dodecatrienyl)-","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"2,4-Dihydroxy-6-methyl-3-((2E,6E)-3,7,11-trimethyl-2,6,10-dodecatrien-1-yl)benzaldehyde","qualifier":"name type: cn","layer":1},{"key":"Substance Name","value":"LL-Z 1272beta","qualifier":"name type: cn","layer":1},{"key":"Primary Name","value":null,"qualifier":"Display Name","layer":0},{"key":"Definitional Hash - Layer 1","value":"6dd7133151101d3d26136d9d4dce266e0730d63e","qualifier":null,"layer":1},{"key":"Definitional Hash - Layer 2","value":"bff072a346df2060c9d1add4fc60090a68350fd4","qualifier":null,"layer":2}],"matches":[{"tupleUsedInMatching":{"key":"Substance Name","value":"7A7A8AHW1U","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"0022581073","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Ilicicolin B","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"UNII-7A7A8AHW1U","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"Benzaldehyde, 2,4-dihydroxy-6-methyl-3-((2E,6E)-3,7,11-trimethyl-2,6,10-dodecatrien-1-yl)-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"beta-Resorcylaldehyde, 6-methyl-3-(3,7,11-trimethyl-2,6,10-dodecatrienyl)-","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"2,4-Dihydroxy-6-methyl-3-((2E,6E)-3,7,11-trimethyl-2,6,10-dodecatrien-1-yl)benzaldehyde","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Substance Name","value":"LL-Z 1272beta","qualifier":"name type: cn","layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 1","value":"6dd7133151101d3d26136d9d4dce266e0730d63e","qualifier":null,"layer":1},"matchingRecords":[]},{"tupleUsedInMatching":{"key":"Definitional Hash - Layer 2","value":"bff072a346df2060c9d1add4fc60090a68350fd4","qualifier":null,"layer":2},"matchingRecords":[]}],"multiplyMatchedKeys":["Substance Name"],"uniqueMatchingKeys":["Substance Name","Primary Name","Definitional Hash - Layer 1","Definitional Hash - Layer 2"]}},{"limit":300}]};
    return demo;
  }

  setDemo2() {
    return {"created":1677095510859,"etag":"db677cdecd80bc1e","path":"","uri":"http://localhost:8081/api/v1/substances/importdata/search?facet=root_importmetadata_source/nlm_2%20part%2023.sdf","method":"GET","sha1":"06df68ee4914bdacdda7f114300c5ac4446c9219","total":4,"count":4,"skip":0,"top":10,"query":"facet=root_importmetadata_source/nlm_2 part 23.sdf","sideway":["root_importmetadata_source/nlm_2 part 23.sdf"],"facets":[{"name":"root_importmetadata_source","values":[{"label":"nlm_2 part 23.sdf","count":4},{"label":"nlm_2 part 24.sdf","count":4}],"enhanced":true,"prefix":"","selectedLabels":["nlm_2 part 23.sdf"]},{"name":"CAS","values":[{"label":"22616-15-5","count":1},{"label":"22616-19-9","count":1},{"label":"22616-31-5","count":1},{"label":"22617-04-5","count":1}],"enhanced":true,"prefix":""},{"name":"Code System","values":[{"label":"CAS","count":4}],"enhanced":true,"prefix":""},{"name":"Definition Level","values":[{"label":"COMPLETE","count":4}],"enhanced":true,"prefix":""},{"name":"Definition Level Access","values":[{"label":"public","count":4}],"enhanced":true,"prefix":""},{"name":"Definition Type","values":[{"label":"PRIMARY","count":4}],"enhanced":true,"prefix":""},{"name":"Deprecated","values":[{"label":"Not Deprecated","count":4}],"enhanced":true,"prefix":""},{"name":"Display Name Level Access","values":[{"label":"public","count":4}],"enhanced":true,"prefix":""},{"name":"GInAS Document Tag","values":[{"label":"PUBLIC_DOMAIN_RELEASE","count":4}],"enhanced":true,"prefix":""},{"name":"GInAS Language","values":[{"label":"en","count":4}],"enhanced":true,"prefix":""},{"name":"ImportStatus","values":[{"label":"staged","count":4}],"enhanced":true,"prefix":""},{"name":"LyChI_L4","values":[{"label":"null","count":4}],"enhanced":true,"prefix":""},{"name":"Modifications","values":[{"label":"No Modifications","count":4}],"enhanced":true,"prefix":""},{"name":"Molecular Weight","values":[{"label":"0:199","count":4}],"enhanced":true,"prefix":""},{"name":"Name Count","values":[{"label":"4.0","count":2},{"label":"3.0","count":1},{"label":"9.0","count":1}],"enhanced":true,"prefix":""},{"name":"Record Level Access","values":[{"label":"public","count":4}],"enhanced":true,"prefix":""},{"name":"Record Status","values":[{"label":"pending","count":4}],"enhanced":true,"prefix":""},{"name":"Reference Count","values":[{"label":"1.0","count":4}],"enhanced":true,"prefix":""},{"name":"Reference Type","values":[{"label":"CATALOG","count":4},{"label":"SYSTEM","count":4}],"enhanced":true,"prefix":""},{"name":"Substance Class","values":[{"label":"chemical","count":4}],"enhanced":true,"prefix":""},{"name":"SubstanceDeprecated","values":[{"label":"false","count":4}],"enhanced":true,"prefix":""},{"name":"ix.Class","values":[{"label":"gsrs.holdingarea.model.ImportMetadata","count":4},{"label":"ix.ginas.models.v1.ChemicalSubstance","count":4},{"label":"ix.ginas.models.v1.GinasChemicalStructure","count":4},{"label":"java.lang.Double","count":4},{"label":"java.lang.Integer","count":4},{"label":"java.lang.String","count":4}],"enhanced":true,"prefix":""},{"name":"processStatus","values":[{"label":"loaded","count":4}],"enhanced":true,"prefix":""},{"name":"version","values":[{"label":"1.0","count":4}],"enhanced":true,"prefix":""},{"name":"versionStatus","values":[{"label":"current","count":4}],"enhanced":true,"prefix":""}],"exactMatches":[],"narrowSearchSuggestions":[],"content":[{"instanceId":"bf2af72c-5d1a-4baf-9b7b-aee8864f285a","recordId":"9bff7923-f877-45a4-906f-c88d88aa4607","version":1,"sourceName":"nlm_2 part 23.sdf","versionCreationDate":1677038880446,"importStatus":"staged","importType":"create","versionStatus":"current","validationStatus":"valid","processStatus":"loaded","entityClassName":"ix.ginas.models.v1.Substance","dataFormat":"application/octet-stream","importAdapter":"SDF Adapter","access":[]},{"instanceId":"73f61a1b-4885-4cb7-8fd6-732e6e590729","recordId":"8dd981b1-c04f-43f7-bf32-9fbf70e69175","version":1,"sourceName":"nlm_2 part 23.sdf","versionCreationDate":1677038879334,"importStatus":"staged","importType":"create","versionStatus":"current","validationStatus":"warning","processStatus":"loaded","entityClassName":"ix.ginas.models.v1.Substance","dataFormat":"application/octet-stream","importAdapter":"SDF Adapter","access":[]},{"instanceId":"282512ef-a222-4c48-9c4e-2472408f714f","recordId":"b55c0bb7-c9d8-4bbd-9a52-57d992d4b57b","version":2,"sourceName":"nlm_2 part 23.sdf","versionCreationDate":1677038877859,"importStatus":"imported","importType":"create","versionStatus":"current","validationStatus":"valid","processStatus":"loaded","entityClassName":"ix.ginas.models.v1.Substance","dataFormat":"application/octet-stream","importAdapter":"SDF Adapter","access":[]},{"instanceId":"5706c49c-dafa-48ce-8f19-d365021b969a","recordId":"f4437e51-f7c2-4003-9f27-7b368533682d","version":1,"sourceName":"nlm_2 part 23.sdf","versionCreationDate":1677038878879,"importStatus":"staged","importType":"create","versionStatus":"current","validationStatus":"valid","processStatus":"loaded","entityClassName":"ix.ginas.models.v1.Substance","dataFormat":"application/octet-stream","importAdapter":"SDF Adapter","access":[]}]};

  }

  setDemo3() {
    return {
      "deprecated": false,
      "uuid": "eb17b78c-1e4b-4dca-bdef-6d64a0013aec",
      "definitionType": "PRIMARY",
      "definitionLevel": "COMPLETE",
      "substanceClass": "chemical",
      "status": "pending",
      "version": "1",
      "names": [
        {
          "deprecated": false,
          "uuid": "3204c8dc-8bc4-487e-8d74-91a2f5d49fb7",
          "name": "EINECS 245-123-2",
          "stdName": "EINECS 245-123-2",
          "type": "cn",
          "domains": [],
          "languages": [
            "en"
          ],
          "nameJurisdiction": [],
          "nameOrgs": [],
          "preferred": false,
          "displayName": true,
          "references": [
            "8b47627f-e78e-46ea-9d27-7cdfb80bb391"
          ],
          "access": []
        }
      ],
      "codes": [
        {
          "deprecated": false,
          "codeSystem": "CAS",
          "code": "22615-60-7",
          "type": "PRIMARY",
          "_isClassification": false,
          "references": [
            "7a8afac4-4448-4d8f-babe-cef3a85d5f2a"
          ],
          "access": []
        }
      ],
      "notes": [
        {
          "deprecated": false,
          "note": "[Validation]WARNING:Each fragment should be present as a separate record in the database. Please register: [Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]",
          "references": [
            "58e0915e-137d-48cc-997d-248474c8830b"
          ],
          "access": [
            "admin"
          ]
        }
      ],
      "properties": [],
      "relationships": [],
      "references": [
        {
          "deprecated": false,
          "uuid": "7a8afac4-4448-4d8f-babe-cef3a85d5f2a",
          "citation": "System generated",
          "docType": "SYSTEM",
          "publicDomain": true,
          "tags": [
            "PUBLIC_DOMAIN_RELEASE"
          ],
          "access": []
        },
        {
          "deprecated": false,
          "uuid": "8b47627f-e78e-46ea-9d27-7cdfb80bb391",
          "citation": "File null imported on Tue Feb 21 13:33:01 EST 2023",
          "docType": "CATALOG",
          "publicDomain": true,
          "tags": [],
          "access": []
        },
        {
          "deprecated": false,
          "uuid": "58e0915e-137d-48cc-997d-248474c8830b",
          "citation": "GSRS System-generated Validation messages",
          "docType": "VALIDATION_MESSAGE",
          "documentDate": 1677004382385,
          "publicDomain": false,
          "tags": [],
          "access": [
            "admin"
          ]
        }
      ],
      "tags": [],
      "structure": {
        "deprecated": false,
        "digest": "22dbfd7e56a5f5b642d9fb10746cee508e278dd7",
        "molfile": "\n  CDK     02212313332D\n\n 10  7  0  0  0  0  0  0  0  0999 V2000\n    2.3750   -3.7292    0.0000 Ru  0  2  0  0  0  0  0  0  0  0  0  0\n    1.6708   -3.7292    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    3.5542   -3.7125    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2708   -3.7125    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8958   -2.9875    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8917   -4.4958    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.7125   -4.5250    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8708   -2.8833    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    5.5375   -3.8875    0.0000 Cl  0  5  0  0  0  0  0  0  0  0  0  0\n   -0.6125   -3.7958    0.0000 Cl  0  5  0  0  0  0  0  0  0  0  0  0\n  1  5  1  0  0  0  0\n  1  2  1  0  0  0  0\n  1  6  1  0  0  0  0\n  1  7  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  8  1  0  0  0  0\n  3  4  2  0  0  0  0\nM  CHG  1   1   2\nM  CHG  1   9  -1\nM  CHG  1  10  -1\nM  END",
        "smiles": "[Cl-].[Cl-].[Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]",
        "formula": "2Cl.ClH8N5ORu",
        "opticalActivity": "NONE",
        "atropisomerism": "No",
        "stereoCenters": 0,
        "definedStereo": 0,
        "ezCenters": 0,
        "charge": 0,
        "mwt": 301.5202,
        "properties": [
          {
            "label": "SMILES",
            "text": "[Cl-].[Cl-].[Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]"
          },
          {
            "label": "InChI_Key",
            "term": "MYPLXICLEQNWLS_UHFFFAOYSA_K"
          },
          {
            "label": "EXACT_HASH",
            "term": "MYPLXICLEQNWLS_UHFFFAOYSA_K"
          },
          {
            "label": "STEREO_INSENSITIVE_HASH",
            "term": "MYPLXICLEQNWLS"
          }
        ],
        "links": [],
        "count": 1,
        "stereochemistry": "ACHIRAL",
        "stereoChemistry": "ACHIRAL",
        "access": [],
        "references": [
          "8b47627f-e78e-46ea-9d27-7cdfb80bb391"
        ],
        "hash": "MYPLXICLEQNWLS_UHFFFAOYSA_K"
      },
      "moieties": [
        {
          "deprecated": false,
          "digest": "d0c87fddbea1426d6f72954f3472043800d74085",
          "molfile": "\n  CDK     02212313332D\n\n  8  7  0  0  0  0  0  0  0  0999 V2000\n    2.3750   -3.7292    0.0000 Ru  0  2  0  0  0  0  0  0  0  0  0  0\n    1.6708   -3.7292    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0\n    3.5542   -3.7125    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    4.2708   -3.7125    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0\n    1.8958   -2.9875    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8917   -4.4958    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    1.7125   -4.5250    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n    2.8708   -2.8833    0.0000 N   0  0  0  0  0  0  0  0  0  0  0  0\n  1  5  1  0  0  0  0\n  1  2  1  0  0  0  0\n  1  6  1  0  0  0  0\n  1  7  1  0  0  0  0\n  1  3  1  0  0  0  0\n  1  8  1  0  0  0  0\n  3  4  2  0  0  0  0\nM  CHG  1   1   2\nM  END",
          "smiles": "[Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]",
          "formula": "ClH8N5ORu",
          "opticalActivity": "NONE",
          "atropisomerism": "No",
          "stereoCenters": 0,
          "definedStereo": 0,
          "ezCenters": 0,
          "charge": 2,
          "mwt": 230.6143,
          "properties": [
            {
              "label": "SMILES",
              "text": "[Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]"
            },
            {
              "label": "InChI_Key",
              "term": "YRVVILPTLZEWRT_UHFFFAOYSA_M"
            },
            {
              "label": "EXACT_HASH",
              "term": "YRVVILPTLZEWRT_UHFFFAOYSA_M"
            },
            {
              "label": "STEREO_INSENSITIVE_HASH",
              "term": "YRVVILPTLZEWRT"
            }
          ],
          "links": [],
          "count": 1,
          "stereochemistry": "ACHIRAL",
          "stereoChemistry": "ACHIRAL",
          "access": [],
          "references": [],
          "hash": "YRVVILPTLZEWRT_UHFFFAOYSA_M",
          "countAmount": {
            "deprecated": false,
            "type": "MOL RATIO",
            "average": 1.0,
            "units": "MOL RATIO",
            "references": [],
            "access": []
          }
        },
        {
          "deprecated": false,
          "digest": "d542d8767d587637cd9c5293fb6d3c5b0b8911b2",
          "molfile": "\n  CDK     02212313332D\n\n  1  0  0  0  0  0  0  0  0  0999 V2000\n    5.5375   -3.8875    0.0000 Cl  0  5  0  0  0  0  0  0  0  0  0  0\nM  CHG  1   1  -1\nM  END",
          "smiles": "[Cl-]",
          "formula": "Cl",
          "opticalActivity": "NONE",
          "atropisomerism": "No",
          "stereoCenters": 0,
          "definedStereo": 0,
          "ezCenters": 0,
          "charge": -1,
          "mwt": 35.4529,
          "properties": [
            {
              "label": "SMILES",
              "text": "[Cl-]"
            },
            {
              "label": "InChI_Key",
              "term": "VEXZGXHMUGYJMC_UHFFFAOYSA_M"
            },
            {
              "label": "EXACT_HASH",
              "term": "VEXZGXHMUGYJMC_UHFFFAOYSA_M"
            },
            {
              "label": "STEREO_INSENSITIVE_HASH",
              "term": "VEXZGXHMUGYJMC"
            }
          ],
          "links": [],
          "count": 2,
          "stereochemistry": "ACHIRAL",
          "stereoChemistry": "ACHIRAL",
          "access": [],
          "references": [],
          "hash": "VEXZGXHMUGYJMC_UHFFFAOYSA_M",
          "countAmount": {
            "deprecated": false,
            "type": "MOL RATIO",
            "average": 2.0,
            "units": "MOL RATIO",
            "references": [],
            "access": []
          }
        }
      ],
      "_name": "EINECS 245-123-2",
      "_approvalIDDisplay": "pending record",
      "access": [],
      "_metadata": {
        "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
        "recordId": "8669cf29-b311-456d-a172-96151a031f52",
        "version": 1,
        "sourceName": "nlm_2 part 22m.sdf",
        "versionCreationDate": 1677004381837,
        "importStatus": "merged",
        "importType": "create",
        "versionStatus": "current",
        "validationStatus": "warning",
        "processStatus": "loaded",
        "entityClassName": "ix.ginas.models.v1.Substance",
        "keyValueMappings": [
          {
            "mappingId": "79df508c-121d-45f0-b7c3-457c8dfbcbdc",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "CAS NUMBER",
            "value": "22615-60-7",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "fafde51e-3b6a-4a7b-acd1-9df0d5187c76",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "Substance Name",
            "value": "EINECS 245-123-2",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "93e91be3-c924-4867-bac8-af576062fe0c",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "Primary Name",
            "value": "EINECS 245-123-2",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "1c4ffb1a-f4d9-4175-8946-4ca1469e32a8",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "Definitional Hash - Layer 1",
            "value": "e4530fce3e163ba464763e873f6df801188284f5",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "f1ce2517-99da-48ca-a6b6-8e0a0efe0098",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "Definitional Hash - Layer 2",
            "value": "fd8d4dcba08581303eed2c2ca9dc1d81cfcee0e4",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "3dfd49bb-5037-462b-8c17-98841428994d",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "CODE",
            "value": "22615-60-7",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          },
          {
            "mappingId": "3fe53378-16a5-47ab-9fbf-2dceda290945",
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "recordId": "8669cf29-b311-456d-a172-96151a031f52",
            "key": "UUID",
            "value": "eb17b78c-1e4b-4dca-bdef-6d64a0013aec",
            "dataLocation": "Staging Area",
            "entityClass": "ix.ginas.models.v1.Substance"
          }
        ],
        "validations": [
          {
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "version": 1,
            "validationDate": 1677004382386,
            "validationMessage": "Each fragment should be present as a separate record in the database. Please register: [Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]",
            "validationJson": "ValidationResponse{validationMessages=[INFO: No moieties found in submission. They will be generated automatically., WARNING: Each fragment should be present as a separate record in the database. Please register: [Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]], valid=true, newObject=Substance{uuid=eb17b78c-1e4b-4dca-bdef-6d64a0013aec, substanceClass=chemical, version='1'}}",
            "validationType": "warning",
            "validationId": "72bd0cbc-12a0-46a0-9718-b7971bad0491"
          },
          {
            "instanceId": "402260f4-5c9c-4e96-ac1b-87c597191638",
            "version": 1,
            "validationDate": 1677004382389,
            "validationMessage": "No moieties found in submission. They will be generated automatically.",
            "validationJson": "ValidationResponse{validationMessages=[INFO: No moieties found in submission. They will be generated automatically., WARNING: Each fragment should be present as a separate record in the database. Please register: [Cl-].[N-]=O.[NH2-].[NH2-].[NH2-].[NH2-].[Ru+8]], valid=true, newObject=Substance{uuid=eb17b78c-1e4b-4dca-bdef-6d64a0013aec, substanceClass=chemical, version='1'}}",
            "validationType": "info",
            "validationId": "afebceda-e15a-4a9a-a270-7b3787e58678"
          }
        ],
        "dataFormat": "application/octet-stream",
        "importAdapter": "SDF Adapter",
        "access": []
      },
      "_matches": {
        "query": [
          {
            "key": "CAS NUMBER",
            "value": "22615-60-7",
            "qualifier": "CAS",
            "layer": 1
          },
          {
            "key": "Substance Name",
            "value": "EINECS 245-123-2",
            "qualifier": "name type: cn",
            "layer": 1
          },
          {
            "key": "Primary Name",
            "value": "EINECS 245-123-2",
            "qualifier": "Display Name",
            "layer": 0
          },
          {
            "key": "Definitional Hash - Layer 1",
            "value": "801bdccb80fe39f42eb7ec2ba029adb91bd76479",
            "layer": 1
          },
          {
            "key": "Definitional Hash - Layer 2",
            "value": "142616304821caf525b137f43414aad6f61e58c3",
            "layer": 2
          },
          {
            "key": "CODE",
            "value": "22615-60-7",
            "qualifier": "Code system: CAS; type: PRIMARY",
            "layer": 0
          }
        ],
        "matches": [
          {
            "tupleUsedInMatching": {
              "key": "CAS NUMBER",
              "value": "22615-60-7",
              "qualifier": "CAS",
              "layer": 1
            },
            "matchingRecords": [
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "4673c329-569b-4068-8700-d661376a454d"
                },
                "sourceName": "GSRS",
                "matchedKey": "CAS NUMBER"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "3924bf03-1013-4cb0-8fb5-494219e136e4"
                },
                "sourceName": "GSRS",
                "matchedKey": "CAS NUMBER"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "8669cf29-b311-456d-a172-96151a031f52"
                },
                "sourceName": "Staging Area",
                "matchedKey": "CAS NUMBER"
              }
            ]
          },
          {
            "tupleUsedInMatching": {
              "key": "Substance Name",
              "value": "EINECS 245-123-2",
              "qualifier": "name type: cn",
              "layer": 1
            },
            "matchingRecords": [
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "4673c329-569b-4068-8700-d661376a454d"
                },
                "sourceName": "GSRS",
                "matchedKey": "Substance Name"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "3924bf03-1013-4cb0-8fb5-494219e136e4"
                },
                "sourceName": "GSRS",
                "matchedKey": "Substance Name"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "8669cf29-b311-456d-a172-96151a031f52"
                },
                "sourceName": "Staging Area",
                "matchedKey": "Substance Name"
              }
            ]
          },
          {
            "tupleUsedInMatching": {
              "key": "Primary Name",
              "value": "EINECS 245-123-2",
              "qualifier": "Display Name",
              "layer": 0
            },
            "matchingRecords": [
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "3924bf03-1013-4cb0-8fb5-494219e136e4"
                },
                "sourceName": "GSRS",
                "matchedKey": "Primary Name"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "8669cf29-b311-456d-a172-96151a031f52"
                },
                "sourceName": "Staging Area",
                "matchedKey": "Primary Name"
              }
            ]
          },
          {
            "tupleUsedInMatching": {
              "key": "Definitional Hash - Layer 1",
              "value": "801bdccb80fe39f42eb7ec2ba029adb91bd76479",
              "layer": 1
            },
            "matchingRecords": []
          },
          {
            "tupleUsedInMatching": {
              "key": "Definitional Hash - Layer 2",
              "value": "142616304821caf525b137f43414aad6f61e58c3",
              "layer": 2
            },
            "matchingRecords": []
          },
          {
            "tupleUsedInMatching": {
              "key": "CODE",
              "value": "22615-60-7",
              "qualifier": "Code system: CAS; type: PRIMARY",
              "layer": 0
            },
            "matchingRecords": [
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "4673c329-569b-4068-8700-d661376a454d"
                },
                "sourceName": "GSRS",
                "matchedKey": "CODE"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "3924bf03-1013-4cb0-8fb5-494219e136e4"
                },
                "sourceName": "GSRS",
                "matchedKey": "CODE"
              },
              {
                "recordId": {
                  "kind": "ix.ginas.models.v1.ChemicalSubstance",
                  "idString": "8669cf29-b311-456d-a172-96151a031f52"
                },
                "sourceName": "Staging Area",
                "matchedKey": "CODE"
              }
            ]
          }
        ],
        "multiplyMatchedKeys": [],
        "uniqueMatchingKeys": [
          "CAS NUMBER",
          "Substance Name",
          "Primary Name",
          "Definitional Hash - Layer 1",
          "Definitional Hash - Layer 2",
          "CODE"
        ]
      }
    };
  }

}
