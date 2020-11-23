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
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail, SubstanceName, SubstanceCode } from '../substance/substance.model';
import { ConfigService } from '../config/config.service';
import * as _ from 'lodash';
import { LoadingService } from '../loading/loading.service';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import { MatDialog, PageEvent } from '@angular/material';
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
import { NarrowSearchSuggestion } from '@gsrs-core/utils';

import { FacetParam } from '@gsrs-core/facets-manager';
import { Facet, FacetUpdateEvent } from '../facets-manager/facet.model';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';
import { SubstanceTextSearchService } from '@gsrs-core/substance-text-search/substance-text-search.service';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
// tslint:disable-next-line:max-line-length
import { BrowseHeaderDynamicSectionDirective } from '@gsrs-core/substances-browse/browse-header-dynamic-section/browse-header-dynamic-section.directive';
import { DYNAMIC_COMPONENT_MANIFESTS, DynamicComponentManifest } from '@gsrs-core/dynamic-component-loader';
import { SubstanceBrowseHeaderDynamicContent } from '@gsrs-core/substances-browse/substance-browse-header-dynamic-content.component';
import { Title } from '@angular/platform-browser';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';

@Component({
  selector: 'app-substances-browse',
  templateUrl: './substances-browse.component.html',
  styleUrls: ['./substances-browse.component.scss']
})
export class SubstancesBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  private privateSearchTerm?: string;
  private privateStructureSearchTerm?: string;
  private privateSequenceSearchTerm?: string;
  private privateSearchType?: string;
  private privateSearchCutoff?: number;
  private privateSearchSeqType?: string;
  private privateSequenceSearchKey?: string;
  public substances: Array<SubstanceDetail>;
  public exactMatchSubstances: Array<SubstanceDetail>;
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


  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    public configService: ConfigService,
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
    @Inject(DYNAMIC_COMPONENT_MANIFESTS) private dynamicContentItems: DynamicComponentManifest<any>[]
  ) { }

  ngOnInit() {
    this.facetManagerService.registerGetFacetsHandler(this.substanceService.getSubstanceFacets);
    this.gaService.sendPageView('Browse Substances');
    this.cvService.getDomainVocabulary('CODE_SYSTEM').pipe(take(1)).subscribe(response => {
      this.codeSystem = response['CODE_SYSTEM'].dictionary;

      });
    this.title.setTitle('Browse Substances');

    this.pageSize = 10;
    this.pageIndex = 0;

    this.privateSearchTerm = this.activatedRoute.snapshot.queryParams['search'] || '';

    if (this.privateSearchTerm) {
      this.searchTermHash = this.utilsService.hashCode(this.privateSearchTerm);
      this.isSearchEditable = localStorage.getItem(this.searchTermHash.toString()) != null;
    }

    this.privateStructureSearchTerm = this.activatedRoute.snapshot.queryParams['structure_search'] || '';
    this.privateSequenceSearchTerm = this.activatedRoute.snapshot.queryParams['sequence_search'] || '';
    this.privateSequenceSearchKey = this.activatedRoute.snapshot.queryParams['sequence_key'] || '';

    this.privateSearchType = this.activatedRoute.snapshot.queryParams['type'] || '';
    this.privateSearchCutoff = Number(this.activatedRoute.snapshot.queryParams['cutoff']) || 0;
    this.privateSearchSeqType = this.activatedRoute.snapshot.queryParams['seq_type'] || '';
    this.smiles = this.activatedRoute.snapshot.queryParams['smiles'] || '';
    this.order = this.activatedRoute.snapshot.queryParams['order'] || '$root_lastEdited';
    this.view = this.activatedRoute.snapshot.queryParams['view'] || 'cards';
    this.pageSize = parseInt(this.activatedRoute.snapshot.queryParams['pageSize'], null) || 10;
    const deprecated = this.activatedRoute.snapshot.queryParams['showDeprecated'];
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

    this.subscriptions.push(authSubscription);
    this.isComponentInit = true;
    this.loadComponent();
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
    const dynamicSubscription = this.dynamicContentContainer.changes.pipe(take(1)).subscribe((comps: QueryList<any>) => {
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
    if (this.isFacetsParamsInit && this.isComponentInit) {
      this.searchSubstances();
    }
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

  // for facets
  facetsLoaded(numFacetsLoaded: number) {
    if (numFacetsLoaded > 0) {
      this.processResponsiveness();
    } else {
      this.matSideNav.close();
    }
  }

  searchSubstances() {
    this.disableExport = false;
    const newArgsHash = this.utilsService.hashCode(
      this.privateSearchTerm,
      this.privateStructureSearchTerm,
      this.privateSequenceSearchTerm,
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

          this.substances = pagingResponse.content;
          this.totalSubstances = pagingResponse.total;
          if (pagingResponse.facets && pagingResponse.facets.length > 0) {
            this.rawFacets = pagingResponse.facets;
          }
          this.narrowSearchSuggestions = {};
          this.matchTypes = [];
          this.narrowSearchSuggestionsCount = 0;
          console.log(this.codeSystem);
          if (pagingResponse.narrowSearchSuggestions && pagingResponse.narrowSearchSuggestions.length) {
            pagingResponse.narrowSearchSuggestions.forEach(suggestion => {
              console.log(suggestion);
              if (this.narrowSearchSuggestions[suggestion.matchType] == null) {
                console.log(suggestion.displayField);
                if (this.codeSystem[suggestion.displayField]) {
                  console.log('found' + suggestion.displayField);
                  suggestion.displayField = this.codeSystem[suggestion.displayField].display;
                }
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
          this.substanceService.getExportOptions(pagingResponse.etag).subscribe(response => {
            this.exportOptions = response;
          });
          this.substanceService.setResult(pagingResponse.etag, pagingResponse.content, pagingResponse.total);
        }, error => {
          this.gaService.sendException('getSubstancesDetails: error from API cal');
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
        height: '215x',
        width: '550px',
        data: { 'extension': extension }
      });

      this.overlayContainer.style.zIndex = '1002';

      const exportSub = dialogReference.afterClosed().subscribe(name => {
        this.overlayContainer.style.zIndex = null;
        if (name && name !== '') {
          this.loadingService.setLoading(true);
          const fullname = name + '.' + extension;
          this.authService.startUserDownload(url, this.privateExport, fullname).subscribe(response => {
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
    this.loadingService.setLoading(true);
    this.substanceService.getSubstanceNames(substanceId).pipe(take(1)).subscribe(names => {
      this.names[substanceId] = names;
      this.loadingService.setLoading(false);
    }, error => {
      this.loadingService.setLoading(false);
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

    const urlTree = this.router.createUrlTree([], {
      queryParams: navigationExtras.queryParams,
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.location.go(urlTree.toString());
  }

  editGuidedSearch(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'guided search term' :
      `${this.privateSearchTerm}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-guided-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {
        'g-search-hash': this.searchTermHash
      }
    };

    this.router.navigate(['/guided-search'], navigationExtras);
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

  editSequenceSearh(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'sequence search term' :
      `${this.privateSequenceSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}-${this.privateSearchSeqType}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-sequence-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['sequence'] = this.privateSequenceSearchTerm || null;
    navigationExtras.queryParams['type'] = this.privateSearchType || null;
    navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff || 0;
    navigationExtras.queryParams['seq_type'] = this.privateSearchSeqType || null;

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

  clearSearch(): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-search', eventLabel);

    this.privateSearchTerm = '';
    this.searchTermHash = null;
    this.pageIndex = 0;

    this.populateUrlQueryParameters();
    this.substanceTextSearchService.setSearchValue('main-substance-search');
    this.searchSubstances();
  }

  clearFilters(): void {
    // for facets
    this.displayFacets.forEach(displayFacet => {
      displayFacet.removeFacet(displayFacet.type, displayFacet.bool, displayFacet.val);
    });
    if (this.privateStructureSearchTerm != null && this.privateStructureSearchTerm !== '') {
      this.clearStructureSearch();
    } else if ((this.privateSequenceSearchTerm != null && this.privateSequenceSearchTerm !== '') ||
      (this.privateSequenceSearchKey != null && this.privateSequenceSearchKey !== '')) {
      this.clearSequenceSearch();
    } else {
      this.clearSearch();
    }
    this.facetManagerService.clearSelections();
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

  get searchType(): string {
    return this.privateSearchType;
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
        structure: substance.structure.id,
        smiles: substance.structure.smiles,
        uuid: substance.uuid,
        names: substance.names
      };
    } else {
      data = {
        structure: substance.polymer.displayStructure.id,
        names: substance.names
      };
    }

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

}
