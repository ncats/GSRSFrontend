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
import lodashSortBy from 'lodash/sortBy';
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
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
// eslint-disable-next-line max-len
import { BrowseHeaderDynamicSectionDirective } from '@gsrs-core/substances-browse/browse-header-dynamic-section/browse-header-dynamic-section.directive';
import { DYNAMIC_COMPONENT_MANIFESTS, DynamicComponentManifest } from '@gsrs-core/dynamic-component-loader';
import { SubstanceBrowseHeaderDynamicContent } from '@gsrs-core/substances-browse/substance-browse-header-dynamic-content.component';
import { Title } from '@angular/platform-browser';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { FormControl } from '@angular/forms';
import { WildcardService } from '@gsrs-core/utils/wildcard.service';
import { SubstanceDetail, SubstanceName, SubstanceCode, SubstanceService } from '@gsrs-core/substance';
import { ConfigService } from '@gsrs-core/config';
import { SubBrowseEmitterService } from '@gsrs-core/substances-browse/sub-browse-emitter.service';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService, AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { Observable } from 'rxjs';
import { BulkActionDialogComponent } from '@gsrs-core/admin/import-browse/bulk-action-dialog/bulk-action-dialog.component';
import { ImportScrubberComponent } from '@gsrs-core/admin/import-management/import-scrubber/import-scrubber.component';
import {Environment} from "@environment/environment.model";
import { ImportSearchStateService } from '@gsrs-core/admin/import-browse/import-search-state.service';
import { FileDownloadService } from '@gsrs-core/utils/file-download.service';
import { ClipboardService } from '@gsrs-core/utils/clipboard.service';
import { ImportStagedRecordsService } from '@gsrs-core/admin/import-browse/import-staged-records.service';

@Component({
    selector: 'app-import-browse',
    templateUrl: './import-browse.component.html',
    styleUrls: ['./import-browse.component.scss'],
    standalone: false,
    providers: [ImportSearchStateService, ImportStagedRecordsService]
})
export class ImportBrowseComponent implements OnInit, AfterViewInit, OnDestroy {

  public substances: Array<any> = [];
 records: Array<any> = [];

  public exactMatchSubstances: Array<SubstanceDetail>;

  environment: Environment;
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
  private argsHash?: number;
  public order: string;
  public sortValues = searchSortValues;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];
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
  showDeprecated = true;
  codeSystem: any;
  previousState: Array<string> = [];
  facetViewCategorySelected = 'Default';
  facetDisplayType = 'facetView';
  facetViewCategory: Array<String> = [];
  facetViewControl = new FormControl();
  private wildCardText: string;
  bulkSearchPanelOpen = false;
  private resizeTimeout: any;
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
    private title: Title,
    private cvService: ControlledVocabularyService,
    private wildCardService: WildcardService,
    private adminService: AdminService,
    @Inject(DYNAMIC_COMPONENT_MANIFESTS) private dynamicContentItems: DynamicComponentManifest<any>[],
    public searchState: ImportSearchStateService,
    private fileDownloadService: FileDownloadService,
    private clipboardService: ClipboardService,
    private stagedRecordsService: ImportStagedRecordsService,

  ) {
  }

  // Getter, not a field, so template reads always reflect the current privilege signal.
  get canUserImportData(): boolean {
    return this.authService.hasPrivilege('Import Data');
  }

  get showAudit(): boolean {
    return this.authService.hasPrivilege('Restore Previous Versions');
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
    this.searchState.setUpPrivateSearchTerm(this.wildCardText);
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
      this.subscriptions.push(exportSub);
  }

  selectBulk(type?: string) {
    if(type && type === 'all') {
      this.isLoading = true;
      this.loadingService.setLoading(true);
      const skip = this.pageIndex * this.pageSize;
      const subscription = this.adminService.SearchStagedData(skip, this.privateFacetParams, this.searchState.searchTerm, this.totalSubstances, 'selectable')
        .subscribe(pagingResponse => {
          let start = 0;
          let skipped = 0;
          let added = 0;
          if (pagingResponse.content){


      pagingResponse.content.forEach(record => {
        if ( record && record.id) {
          if (this.bulkList[record.id]) {
            if (! this.bulkList[record.id].checked) {
              added++;
            }
            this.bulkList[record.id].checked = true;
          } else {
            this.bulkList[record.id] = {"checked": true, "name": record.name, "id": record.id};
            added++;
          }
        } else {
          skipped++;
        }
      });
    } else {
      this.isLoading = false;
      this.loadingService.setLoading(false);
      alert('Error: unable to retrieve staged response content');
    }
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
          if (record.id && this.bulkList[record.id]) {
            this.bulkList[record.id].checked = true;
          } else if (record._metadata.recordId && this.bulkList[record._metadata.recordId]) {
            this.bulkList[record._metadata.recordId].checked = true;
          } else if (record._metadata.recordId) {
            this.bulkList[record._metadata.recordId] = {"checked": true, "name": record._name, "id": record._metadata.recordId};
          } else {
            this.bulkList[record.id] = {"checked": true, "name": record.name, "id": record.id};
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

    this.searchState.setUpPrivateSearchTerm(this.wildCardText);
    this.searchState.initFromRoute();

    this.order = this.activatedRoute.snapshot.queryParams['order'] || '$root_lastEdited';
    this.view = this.activatedRoute.snapshot.queryParams['view'] || 'cards';
    this.pageSize = parseInt(this.activatedRoute.snapshot.queryParams['pageSize'], null) || 10;
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
    });
    this.facetManagerService.registerGetFacetsHandler(this.substanceService.getStagingFacets );

    this.environment = this.configService.environment;

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
    clearTimeout(this.resizeTimeout);
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.facetManagerService.unregisterFacetSearchHandler();
  }

  @HostListener('window:resize')
  onResize() {
    // Debounce resize handler to avoid measuring during animation
    clearTimeout(this.resizeTimeout);
    this.resizeTimeout = setTimeout(() => {
      this.processResponsiveness();
    }, 150);
  }

  private loadComponent(): void {

    if (this.isFacetsParamsInit && this.isComponentInit || this.isRefresher) {

      this.searchSubstances();

    } else {

      // There should be a better way to do this.
      this.bulkSearchPanelOpen =
      (this.searchState.searchTerm ===undefined || this.searchState.searchTerm ==='')
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
    return this.stagedRecordsService.getRecord(id, this.idMapping, this.demoResp);
  }

  organizeMatches() {
    this.matches = this.stagedRecordsService.organizeMatches(this.records);
  }

  searchforIDs() {
     // if (this.argsHash == null || this.argsHash !== newArgsHash) {
        this.isLoading = true;
        this.loadingService.setLoading(true);
        const skip = this.pageIndex * this.pageSize;
        const subscription = this.adminService.SearchStagedData(skip, this.privateFacetParams, this.searchState.searchTerm, this.totalSubstances)
          .subscribe(pagingResponse => {
 console.log(pagingResponse)
});
  }

  searchSubstances() {
    this.disableExport = false;
    const newArgsHash = this.utilsService.hashCode(
      this.searchState.searchTerm,
      this.searchState.structureSearchTerm,
      this.searchState.sequenceSearchTerm,
      this.searchState.bulkSearchQueryId,
      this.searchState.searchCutoff,
      this.searchState.searchType,
      this.searchState.searchSeqType,
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
      const subscription = this.adminService.SearchStagedData(skip, this.privateFacetParams, this.searchState.searchTerm, this.pageSize)
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
    return lodashSortBy(a);
}

searchTermOkforBeginsWithSearch(): boolean {
  return this.searchState.searchTermOkforBeginsWithSearch();
}

  restricSearh(searchTerm: string): void {
    this.searchState.restricSearh(searchTerm);
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
    this.searchState.editAdvancedSearch();
  }

  editStructureSearch(): void {
    this.searchState.editStructureSearch();
  }

  clearStructureSearch(): void {
    this.searchState.clearStructureSearch();
    this.pageIndex = 0;
  }

  editSequenceSearh(): void {
    this.searchState.editSequenceSearh();
  }

  clearSequenceSearch(): void {
    this.searchState.clearSequenceSearch();
    this.pageIndex = 0;
  }

  editBulkSearch(): void {
    this.searchState.editBulkSearch();
  }

  clearBulkSearch(): void {
    this.searchState.clearBulkSearch();
    this.pageIndex = 0;
  }

  clearSearch(): void {
    this.searchState.clearSearch();
    this.wildCardText = '';
    this.pageIndex = 0;
    this.searchSubstances();
  }

  clearFilters(): void {
    // for facets
    // Does this facet remove work completely?  When I (aw) click RESET button the facet
    // is cleared but this.displayFacets still has the value.
    this.displayFacets.forEach(displayFacet => {
      displayFacet.removeFacet(displayFacet.type, displayFacet.bool, displayFacet.val);
    });
    if (this.searchState.structureSearchTerm != null && this.searchState.structureSearchTerm !== '') {
      this.clearStructureSearch();
    } else if (this.searchState.hasSequenceSearch) {
      this.clearSequenceSearch();
    } else if (this.searchState.bulkSearchQueryId != null && this.searchState.bulkSearchQueryId !== undefined) {
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
    return this.searchState.searchTerm;
  }

  get structureSearchTerm(): string {
    return this.searchState.structureSearchTerm;
  }

  get sequenceSearchTerm(): string {
    return this.searchState.sequenceSearchTerm;
  }

  get bulkSearchSummary(): string {
    return this.searchState.bulkSearchSummary;
  }
  get bulkSearchQueryId(): number {
    return this.searchState.bulkSearchQueryId;
  }
  get bulkSearchStatusKey(): string {
    return this.searchState.bulkSearchStatusKey;
  }

  get searchType(): string {
    return this.searchState.searchType;
  }

  get searchStrategy(): string {
    return this.searchState.searchStrategy;
  }


  get searchCutoff(): number {
    return this.searchState.searchCutoff;
  }

  get searchSeqType(): string {
    return this.searchState.searchSeqType;
  }

  get isSearchEditable(): boolean {
    return this.searchState.isSearchEditable;
  }

  get smiles(): string {
    return this.searchState.smiles;
  }

  private processResponsiveness = () => {
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
    const eventLabel = this.environment.isAnalyticsPrivate ? 'substance' : substance._name;
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
      this.fileDownloadService.download(response, filename);
      subscription.unsubscribe();
    }, error => {
      subscription.unsubscribe();
    });
  }

  getFasta(id: string, filename: string): void {
    const subscription = this.substanceService.getFasta(id).subscribe(response => {
      this.fileDownloadService.download(response, filename);
      subscription.unsubscribe();
    }, error => {
      subscription.unsubscribe();
    });
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
      this.fileDownloadService.download(JSON.stringify(response), id + '.json');
    });

  }

  copySmiles(val: string) {
    this.clipboardService.copyText(val);
  }


}
