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
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail, SubstanceName, SubstanceCode, SubstanceSummary } from '../substance/substance.model';
import { ConfigService } from '../config/config.service';
import * as _ from 'lodash';
import { LoadingService } from '../loading/loading.service';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { UtilsService } from '../utils/utils.service';
import { MatSidenav } from '@angular/material/sidenav';
import { StructureImageModalComponent } from '../structure/structure-image-modal/structure-image-modal.component';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { environment } from '../../../environments/environment';
import { AuthService } from '../auth/auth.service';
import { searchSortValues } from '../utils/search-sort-values';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { StructureService } from '@gsrs-core/structure';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { NarrowSearchSuggestion, PagingResponse } from '@gsrs-core/utils';
import { FacetParam } from '@gsrs-core/facets-manager';
import { Facet, FacetUpdateEvent } from '../facets-manager/facet.model';
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
import { SubBrowseEmitterService } from './sub-browse-emitter.service';
import { WildcardService } from '@gsrs-core/utils/wildcard.service';
import { I } from '@angular/cdk/keycodes';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { UserQueryListDialogComponent } from '@gsrs-core/bulk-search/user-query-list-dialog/user-query-list-dialog.component';

@Component({
  selector: 'app-substances-browse',
  templateUrl: './substances-browse.component.html',
  styleUrls: ['./substances-browse.component.scss']
})
export class SubstancesBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
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

  public substances: Array<SubstanceDetail>;
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
  bulkSearchFacet: Facet;
  userLists: Array<string>;

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
    private bulkSearchService: BulkSearchService,
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




  fetchBulkLists() {
    this.bulkSearchService.getBulkSearchLists().subscribe(result => {
      console.log(result);
    }, error => {
      console.log(error);
    });

  }

  ngOnInit() {
    this.gaService.sendPageView('Browse Substances');
    this.cvService.getDomainVocabulary('CODE_SYSTEM').pipe(take(1)).subscribe(response => {
      this.codeSystem = response['CODE_SYSTEM'].dictionary;

      this.bulkSearchService.listEmitter.subscribe(result => {
        this.userLists = result;
      });

    });
    
    this.title.setTitle('Browse Substances');

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
    // the sort order should be set to default (similarity) for structure searches, last edited for all others
    this.order = this.activatedRoute.snapshot.queryParams['order'] || 
    (this.privateStructureSearchTerm && this.privateStructureSearchTerm !== '' ? 'default':'$root_lastEdited');
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
    this.bulkSearchService.getBulkSearchLists().subscribe( result => {
      console.log(result);
      this.userLists = result.lists;

        }, error => {
          console.log(error);
          this.userLists = null;
        })
      } else {
        this.showDeprecated = false;
        this.isLoggedIn = false;
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
    if (this.argsHash == null || this.argsHash !== newArgsHash) {
      this.isLoading = true;
      this.loadingService.setLoading(true);
      this.argsHash = newArgsHash;
      const skip = this.pageIndex * this.pageSize;
      const subscription = this.substanceService.getSubstancesSummaries({
        searchTerm: this.privateSearchTerm,
        structureSearchTerm: this.privateStructureSearchTerm,
        sequenceSearchTerm: this.privateSequenceSearchTerm,
        bulkQID: this.bulkSearchQueryId,
        searchOnIdentifiers: this.searchOnIdentifiers,
        searchEntity: this.searchEntity,
        cutoff: this.privateSearchCutoff,
        type: this.privateSearchType,
        seqType: this.privateSearchSeqType,
        order: this.order,
        pageSize: this.pageSize,
        facets: this.privateFacetParams,
        skip: skip,
        sequenceSearchKey: this.privateSequenceSearchKey,
        deprecated: this.showDeprecated
      })
        .subscribe(pagingResponse => {
          this.privateBulkSearchStatusKey = pagingResponse.statusKey;
          this.isError = false;
          this.totalSubstances = pagingResponse.total;
          if (pagingResponse.total % this.pageSize === 0) {
            this.lastPage = (pagingResponse.total / this.pageSize);
          } else {
            this.lastPage = Math.floor(pagingResponse.total / this.pageSize + 1);
          }

          if (pagingResponse.exactMatches && pagingResponse.exactMatches.length > 0
            && pagingResponse.skip === 0
            && (!pagingResponse.sideway || pagingResponse.sideway.length < 2)
          ) {
            this.exactMatchSubstances = pagingResponse.exactMatches;
            this.showExactMatches = true;
          }

          if (pagingResponse.summary && pagingResponse.summary.length > 0
            && pagingResponse.skip === 0
            && (!pagingResponse.sideway || pagingResponse.sideway.length < 2)
          ) {
            this.privateBulkSearchSummary = pagingResponse.summary;
          }

          this.substances = pagingResponse.content;
          this.totalSubstances = pagingResponse.total;
          this.etag = pagingResponse.etag;
          if (pagingResponse.facets && pagingResponse.facets.length > 0) {
            this.rawFacets = pagingResponse.facets;
            
          }
          this.narrowSearchSuggestions = {};
          this.matchTypes = [];
          this.narrowSearchSuggestionsCount = 0;

          if (pagingResponse.narrowSearchSuggestions && pagingResponse.narrowSearchSuggestions.length) {

            pagingResponse.narrowSearchSuggestions.forEach(suggestion => {
              if (this.codeSystem && this.codeSystem[suggestion.displayField]) {
                suggestion.displayField = this.codeSystem[suggestion.displayField].display;
              }

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

            if(this.privateSearchTerm && !this.utilsService.looksLikeComplexSearchTerm(this.privateSearchTerm)) {

              const lq: string = this.utilsService.makeBeginsWithSearchTerm('root_names_name', this.privateSearchTerm.toString());

              // The match type usually originates from the backend.
              // But below, it is specified here to make additonal match options(s) in the backend.
              // Can't figure out why the sort of matchTypes does not work.
              // I am not sure it worked before this change.
              // I would like Additional matches to appear first.

              let suggestion: NarrowSearchSuggestion = {
                matchType: 'ADDITIONAL',
                count: 0,
                displayField: 'Any Name Begins With',
                luceneField: 'root_names_name',
                luceneQuery: lq
              };
              this.substanceService.searchSubstances(lq).subscribe(response => {
                if(response?.total && response.total>0) {
                  suggestion.count = response.total;
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
                }
              });
            }

            // use method sortMatchTypes in template instead
            // this.matchTypes.sort();

          }
          this.substanceService.getExportOptions(pagingResponse.etag).subscribe(response => {
            this.exportOptions = response.filter(exp => {
              if (exp.extension) {
                //TODO Make this generic somehow, so addditional-type exports are isolated
                if ((exp.extension === 'appxlsx') || (exp.extension === 'prodxlsx') ||
                    (exp.extension === 'ctusxlsx')|| (exp.extension === 'cteuxlsx')) {
                  return false;
                }
              }
              return true;
            });
          });
          this.substanceService.setResult(pagingResponse.etag, pagingResponse.content, pagingResponse.total);
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
          this.notificationService.setNotification(notification);
        }, () => {
          subscription.unsubscribe();
          if (this.exactMatchSubstances && this.exactMatchSubstances.length > 0) {
            this.exactMatchSubstances.forEach(substance => {
              this.setSubstanceNames(substance.uuid);
              this.setSubstanceCodes(substance.uuid);
            });

          }
          this.substances.forEach(substance => {
            this.setSubstanceNames(substance.uuid);
            this.setSubstanceCodes(substance.uuid);
          });
          this.isLoading = false;
          this.loadingService.setLoading(this.isLoading);
        });
    }

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
    this.searchSubstances();
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
          this.loadingService.setLoading(true);
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
    this.loadingService.setLoading(true);
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
    this.searchSubstances();
  }

  seedSmiles(smiles: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        importStructure: encodeURIComponent(smiles)
      }
    };
    this.router.navigate(['/substances/register/chemical'], navigationExtras);
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
    this.searchSubstances();
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
    this.searchSubstances();
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

  addToList(): void {
      let data = {view: 'add', etag: this.etag, lists: this.userLists};

      
      const dialogRef = this.dialog.open(UserQueryListDialogComponent, {
        width: '800px',
        autoFocus: false,
              data: data
  
      });
      this.overlayContainer.style.zIndex = '1002';
  
      const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
        if (response) {
          this.overlayContainer.style.zIndex = null;
        }
      });
    }
  

}
