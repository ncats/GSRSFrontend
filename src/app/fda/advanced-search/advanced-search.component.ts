import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  PLATFORM_ID,
  Inject,
  OnDestroy,
  ViewChild,
  ElementRef, AfterViewInit
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { Location, formatNumber } from '@angular/common';
import { Title } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { MatDialog, MatTabChangeEvent } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { transform } from 'lodash';
import { environment } from '../../../environments/environment';
import { ConfigService } from '@gsrs-core/config';
import { UtilsService } from '@gsrs-core/utils';
import { Ketcher } from 'ketcher-wrapper';
import { JSDraw } from 'jsdraw-wrapper';
/*
import { InterpretStructureResponse } from '@gsrs-core/structure/structure-post-response.model';
import { StructureExportComponent } from '@gsrs-core/structure/structure-export/structure-export.component';
import { StructureImportComponent } from '@gsrs-core/structure/structure-import/structure-import.component';
import { EditorImplementation } from '@gsrs-core/structure-editor/structure-editor-implementation.model';
import { ApplicationsBrowseComponent } from '../application/applications-browse/applications-browse.component';
*/
import { Facet, FacetParam, FacetValue, FacetUpdateEvent, FacetsManagerService } from '@gsrs-core/facets-manager';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { QueryableSubstanceDictionary } from '@gsrs-core/guided-search/queryable-substance-dictionary.model';
import { Editor } from '@gsrs-core/structure-editor/structure.editor.model';
import { AdvancedQueryStatement } from './advanced-query-statement/advanced-query-statement.model';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';
import { LoadingService } from '@gsrs-core/loading';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ApplicationService } from '../application/service/application.service';
import { ProductService } from '../product/service/product.service';
import { ClinicalTrialService } from '../clinical-trials/clinical-trial/clinical-trial.service';
import { AdverseEventService } from '../adverse-event/service/adverseevent.service';
import { AdvancedSearchService } from './service/advanced-search.service';

@Component({
  selector: 'app-advanced-search',
  templateUrl: './advanced-search.component.html',
  styleUrls: ['./advanced-search.component.scss']
})

/*
export interface FacetValueAdvanced {
  label: string;
  count: number;
  url: string;
}
*/

export class AdvancedSearchComponent implements OnInit, OnDestroy {

  query: string;
  queryStatements: Array<AdvancedQueryStatement> = [];
  queryableSubstanceDict: QueryableSubstanceDictionary;
  displayProperties: Array<string>;
  displayPropertiesCommon: Array<string>;
  searchTypeControl = new FormControl();
  facetViewControl = new FormControl();
  private editor: Editor;
  private searchType: string;
  similarityCutoff?: number;
  showSimilarityCutoff = false;
  // editor: EditorImplementation;
  // @Output() editorOnLoad = new EventEmitter<EditorImplementation>();
  // @Output() loadedMolfile = new EventEmitter<string>();
  private ketcher: Ketcher;
  private jsdraw: JSDraw;
  structureEditor: string;
  anchorElement: HTMLAnchorElement;
  smiles: string;
  mol: string;
  height = 0;
  width = 0;
  canvasToggle = true;
  canvasMessage = '';
  tempClass = '';
  categoryOptions = [
    'Substance',
    'Application',
    'Product',
    'Clinical Trial',
    'Adverse Event'
  ];
  tabSelectedIndex = 0;
  category = 'Substance';
  configName: 'substances';
  tabClicked = false;
  @ViewChild('structure_canvas', { static: false }) myCanvas: ElementRef;
  public context: CanvasRenderingContext2D;
  public canvasCopy: HTMLCanvasElement;
  private jsdrawScriptUrls = [
    `${environment.baseHref || ''}assets/dojo/dojo.js`,
    `${environment.baseHref || ''}assets/jsdraw/Scilligence.JSDraw2.Pro.js`,
    `${environment.baseHref || ''}assets/jsdraw/Scilligence.JSDraw2.Resources.js`,
    `${environment.baseHref || ''}assets/jsdraw/JSDraw.extensions.js`
  ];
  ketcherFilePath: string;
  showSpinner = false;
  @ViewChild('contentContainer', { static: true }) contentContainer;
  private overlayContainer: HTMLElement;
  dictionaryFileName: string;
  private subscriptions: Array<Subscription> = [];
  panelExpanded = false;
  numFacetsLoaded = 0;
  queryStatementHashes: Array<number>;
  private privateFacetParams: FacetParam;
  privateFacetParamsUrl: string;
  facetKey = 'substances';
  rawFacets: Array<Facet> = [];
  rawFacetsSubstance: Array<Facet> = [];
  rawFacetsApplication: Array<Facet> = [];
  rawFacetsProduct: Array<Facet> = [];
  rawFacetsClinicalTrial: Array<Facet> = [];
  rawFacetsAdverseEventPt: Array<Facet> = [];
  rawFacetsAdverseEventDme: Array<Facet> = [];
  rawFacetsAdverseEventCvm: Array<Facet> = [];
  public displayFacets: Array<DisplayFacet> = [];
  facetViewCategorySelected = 'Default';
  facetViewCategory: Array<String> = [];
  substanceFacetsQuickSearch: Array<Facet> = [];
  applicationFacetsQuickSearch: Array<Facet> = [];
  productFacetsQuickSearch: Array<Facet> = [];
  clinicalTrialFacetsQuickSearch: Array<Facet> = [];
  navigationExtrasFacet: NavigationExtras = {
    queryParams: {}
  };
  queryFacet = '';
  queryDisplay = '';
  facetNameText = '';
  facetDisplayType = 'all';
  substanceFacetsDisplay = ['Record Status', 'Substance Class', 'Relationships', 'GInAS Tag'];
  applicationFacetsDisplay = ['Center', 'Application Type', 'Application Status', 'Provenance (GSRS)'];
  productFacetsDisplay = ['Provenance', 'Company Country', 'Product Type', 'Dosage Form Name'];
  clinicalTrialFacetsDisplay = ['Intervention Type', 'Age Groups', 'Conditions', 'Study Types'];

  applicationFacetValue: Array<FacetValue> = [];

  substances: Array<SubstanceDetail>;
  applications: any;
  products: any;
  clinicalTrials: any;
  adverseEventPt: any;
  adverseEventDme: any;
  adverseEventCvm: any;

  substanceCount = '0';
  applicationCount = '0';
  productCount = '0';
  clinicalTrialCount = '0';
  adverseEventPtCount = '0';
  adverseEventDmeCount = '0';
  adverseEventCvmCount = '0';

  constructor(
    private http: HttpClient,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private loadingService: LoadingService,
    private advancedSearchService: AdvancedSearchService,
    private adverseEventService: AdverseEventService,
    private configService: ConfigService,
    private utilitiesService: UtilsService,
    private substanceService: SubstanceService,
    public applicationService: ApplicationService,
    public productService: ProductService,
    private clinicalTrialService: ClinicalTrialService,
    private facetManagerService: FacetsManagerService,
    private gaService: GoogleAnalyticsService,
    private titleService: Title,
    private overlayContainerService: OverlayContainer,
    private location: Location,
    private dialog: MatDialog
  ) { }

  ngOnInit() {
    this.loadingService.setLoading(true);
    this.showSpinner = true;  // Start progress spinner

    this.titleService.setTitle(`Advanced Search`);
    const advancedSearchHash = Number(this.activatedRoute.snapshot.queryParams['g-search-hash']) || null;

    // Get Stored Search Criteria
    if (advancedSearchHash) {
      const queryStatementHashesString = localStorage.getItem(advancedSearchHash.toString());
      if (queryStatementHashesString != null) {
        this.queryStatementHashes = JSON.parse(queryStatementHashesString);

        // Get Category from Stored Cookies
        if (this.queryStatementHashes[0] != null) {
          const categoryStored = localStorage.getItem(this.queryStatementHashes[0].toString());
          if (categoryStored != null) {
            this.category = categoryStored;
            this.categoryOptions.forEach((cat, index) => {
              if (cat != null) {
                if (cat === categoryStored) {
                  this.tabSelectedIndex = index;
                }
              }
            });
            this.queryStatementHashes.splice(0, 1);
          }
        }

      }
    }
    this.getBrowseClinicalTrialDetails();

    this.getBrowseSubstanceDetails();
    this.getBrowseApplicationDetails();
    this.getBrowseProductDetails();
    this.getBrowseAdverseEventPtDetails();
 //   this.getBrowseAdverseEventDmeDetails();
 //   this.getBrowseAdverseEventCvmDetails();

    this.loadFileName();

    this.loadFacetViewFromConfig();

    this.showSpinner = false;  // Stop progress spinner
    this.loadingService.setLoading(false);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
    this.facetManagerService.unregisterFacetSearchHandler();
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

  getBrowseSubstanceDetails() {
    const subscriptionBrowseSub = this.advancedSearchService.getSubstances(
      0,
      10,
      null,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.substances = pagingResponse.content;
        this.substanceCount = formatNumber(Number(pagingResponse.total), 'en-US', '1.0-0');
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          //  this.substanceFacetsQuickSearch = this.populateFacets(pagingResponse.facets, this.substanceFacetsDisplay, 'browse-substance');

          //   this.rawFacets = this.populateFacets(pagingResponse.facets, this.substanceFacetsDisplay, 'browse-substance');
          this.rawFacetsSubstance = pagingResponse.facets;
          this.rawFacets = pagingResponse.facets;
        }
      });
    this.subscriptions.push(subscriptionBrowseSub);
  }

  getBrowseApplicationDetails() {
    const subscriptionBrowseApp = this.advancedSearchService.getApplications(
      0,
      10,
      null,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.applications = pagingResponse.content;

        // Convert Number with commas
        this.applicationCount = formatNumber(Number(pagingResponse.total), 'en-US', '1.0-0');

        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacetsApplication = pagingResponse.facets;
        }
      });
    this.subscriptions.push(subscriptionBrowseApp);
  }

  getBrowseProductDetails() {
    const subscriptionBrowseProd = this.advancedSearchService.getProducts(
      0,
      10,
      null,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.products = pagingResponse.content;

        this.productCount = formatNumber(Number(pagingResponse.total), 'en-US', '1.0-0');

        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacetsProduct = pagingResponse.facets;
          // this.productFacetsQuickSearch = this.populateFacets(pagingResponse.facets, this.productFacetsDisplay, 'browse-products');
        }
      });
    this.subscriptions.push(subscriptionBrowseProd);
  }

  getBrowseClinicalTrialDetails() {
    const subscriptionBrowseClinical = this.advancedSearchService.getClinicalTrials(
      0,
      10,
      null,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.clinicalTrials = pagingResponse.content;

        this.clinicalTrialCount = formatNumber(Number(pagingResponse.total), 'en-US', '1.0-0');

        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacetsClinicalTrial = pagingResponse.facets;
          //  this.clinicalTrialFacetsQuickSearch = this.populateFacets(pagingResponse.facets
          // , this.clinicalTrialFacetsDisplay, 'browse-clinical-trials');
        }
      });
    this.subscriptions.push(subscriptionBrowseClinical);
  }

  getBrowseAdverseEventPtDetails() {
    const subscriptionBrowseAdvPt = this.adverseEventService.getAdverseEventPt(
      null,
      0,
      10,
      null,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.adverseEventPt = pagingResponse.content;

        this.adverseEventPtCount = formatNumber(Number(pagingResponse.total), 'en-US', '1.0-0');

        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacetsAdverseEventPt = pagingResponse.facets;
          // this.productFacetsQuickSearch = this.populateFacets(pagingResponse.facets, this.productFacetsDisplay, 'browse-products');
        }
      });
    this.subscriptions.push(subscriptionBrowseAdvPt);
  }

  getBrowseAdverseEventDmeDetails() {
    const subscriptionBrowseAdvDme = this.adverseEventService.getAdverseEventDme(
      null,
      0,
      10,
      null,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.adverseEventDme = pagingResponse.content;

        this.adverseEventDmeCount = formatNumber(Number(pagingResponse.total), 'en-US', '1.0-0');

        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacetsAdverseEventDme = pagingResponse.facets;
          // this.productFacetsQuickSearch = this.populateFacets(pagingResponse.facets, this.productFacetsDisplay, 'browse-products');
        }
      });
    this.subscriptions.push(subscriptionBrowseAdvDme);
  }

  getBrowseAdverseEventCvmDetails() {
    const subscriptionBrowseAdvCvm = this.adverseEventService.getAdverseEventCvm(
      null,
      0,
      10,
      null,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.adverseEventCvm = pagingResponse.content;

        this.adverseEventCvmCount = formatNumber(Number(pagingResponse.total), 'en-US', '1.0-0');

        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacetsAdverseEventCvm = pagingResponse.facets;
          // this.productFacetsQuickSearch = this.populateFacets(pagingResponse.facets, this.productFacetsDisplay, 'browse-products');
        }
      });
    this.subscriptions.push(subscriptionBrowseAdvCvm);
  }


  /*
  private populateFacets(rawFacets: Array<Facet>, facetDisplay: Array<String>, browse: string): Array<Facet> {
    const facetQuickSearch: Array<Facet> = [];
    if (rawFacets && facetDisplay) {
      const facetsCopy = rawFacets.slice();
      facetDisplay.forEach(facetKey => {
        for (let facetIndex = 0; facetIndex < facetsCopy.length; facetIndex++) {
          if (facetKey === facetsCopy[facetIndex].name) {
            const facetValues = facetsCopy[facetIndex].values;
            for (let valueIndex = 0; valueIndex < facetValues.length; valueIndex++) {
            }
            facetQuickSearch.push(facetsCopy[facetIndex]);
          }
        }
      });
    }
    return facetQuickSearch;
  }
  */

  tabSelectedUpdated(event: MatTabChangeEvent) {
    if (event) {
      this.category = event.tab.textLabel;
      if (this.category) {
        this.tabClicked = true;
        this.loadFileName();
      }
    }
  }

  private loadFileName() {
    if (this.category) {
      this.query = '';
      this.facetDisplayType = 'default';
      this.facetManagerService.clearSelections();
      this.facetManagerService.unregisterFacetSearchHandler();

      if (this.category === 'Substance') {
        this.dictionaryFileName = 'substance_dictionary.json';
        this.facetManagerService.registerGetFacetsHandler(this.substanceService.getSubstanceFacets);
        this.rawFacets = this.rawFacetsSubstance;
        this.facetKey = 'substances';
        this.facetDisplayType = 'facetView';
      } else if (this.category === 'Application') {
        this.dictionaryFileName = 'application_dictionary.json';
        this.facetManagerService.registerGetFacetsHandler(this.applicationService.getApplicationFacets);
        this.rawFacets = this.rawFacetsApplication;
        this.facetKey = 'applications';
      } else if (this.category === 'Product') {
        this.dictionaryFileName = 'product_dictionary.json';
        this.facetManagerService.registerGetFacetsHandler(this.productService.getProductFacets);
        this.rawFacets = this.rawFacetsProduct;
        this.facetKey = 'products';
      } else if (this.category === 'Clinical Trial') {
        this.dictionaryFileName = 'clinicaltrial_dictionary.json';
        this.facetManagerService.registerGetFacetsHandler(this.clinicalTrialService.getClinicalTrialsFacets);
        this.rawFacets = this.rawFacetsClinicalTrial;
        this.facetKey = 'ctclinicaltrial';
      } else if (this.category === 'Adverse Event') {
        this.dictionaryFileName = 'adverseevent_dictionary.json';
        this.facetManagerService.registerGetFacetsHandler(this.adverseEventService.getAdverseEventPtFacets);
        this.rawFacets = this.rawFacetsAdverseEventPt;
        this.facetKey = 'adverseeventpt';
      //  this.facetManagerService.registerGetFacetsHandler(this.adverseEventService.getAdverseEventDmeFacets);
      //  this.rawFacets = this.rawFacetsAdverseEventDme;
      //  this.facetKey = 'adverseeventDme';
       // this.rawFacets.splice(0, this.rawFacets.length);
      }
    }
    this.getSearchField();
  }

  getSearchField() {
    this.http.get(`${this.configService.environment.baseHref}assets/data/` + this.dictionaryFileName)
      //   this.http.get(`${this.configService.environment.baseHref}assets/data/substance_dictionary.json`)
      .subscribe((response: QueryableSubstanceDictionary) => {

        response['All'] = {
          lucenePath: 'text',
          description: 'All substance fields',
          type: 'string',
          cvDomain: ''
        };
        this.queryableSubstanceDict = response;

        const displayProperties = ['All'];
        const displayPropertiesCommon = ['All'];
        Object.keys(this.queryableSubstanceDict).forEach(key => {
          displayProperties.push(key);
          if (this.queryableSubstanceDict[key].priority != null) {
            displayPropertiesCommon.push(key);
          }
        });
        this.displayProperties = displayProperties;
        this.displayPropertiesCommon = displayPropertiesCommon;

        if (this.queryStatementHashes != null) {
          if (this.tabClicked === false) {
            this.queryStatementHashes.forEach(queryStatementHash => {
              this.queryStatements.push({ queryHash: queryStatementHash });
            });
          }
        }

        if (this.queryStatements.length === 0) {
          this.queryStatements.push({});
        }
        //  }
      });
  }

  queryUpdated(queryStatement: AdvancedQueryStatement, index: number) {
    setTimeout(() => {
      Object.keys(queryStatement).forEach(key => {
        this.queryStatements[index][key] = queryStatement[key];
      });
      this.query = '';
      this.query = this.queryStatements.map(statement => statement.query).join(' ').trim();

      // Combine query and facetQuery
      this.facetQueryConstruct();
      // this.queryDisplay = this.query + this.queryFacet;
    });
  }

  addQueryStatement(): void {
    this.queryStatements.push({
      condition: '',
      queryableProperty: 'All',
      command: ''
    });
  }

  removeQueryStatement(index: number): void {
    this.queryStatements.splice(index, 1);
    this.query = this.queryStatements.map(statement => statement.query).join(' ');

    // Combine query and facetQuery
    this.queryDisplay = this.query + this.queryFacet;
  }

  togglePanelExpand() {
    this.showSpinner = true;  // Start progress spinner
    this.panelExpanded = !this.panelExpanded;
    this.showSpinner = false;  // Stop progress spinner
  }

  // for facets
  facetsLoaded(numFacetsLoaded: number) {
    this.numFacetsLoaded = numFacetsLoaded;
  }

  facetViewChange(event): void {
    this.facetViewCategorySelected = event.value;
  }

  clearSearch(): void {

    //   const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;
    //  this.gaService.sendEvent('applicationFiltering', 'icon-button:clear-search', eventLabel);

    //   this.privateSearchTerm = '';
    //  this.pageIndex = 0;
    //  this.pageSize = 10;

    //  this.populateUrlQueryParameters();
    // this.searchApplications();
  }

  clearFilters(): void {
    // for facets
    this.displayFacets.forEach(displayFacet => {
      displayFacet.removeFacet(displayFacet.type, displayFacet.bool, displayFacet.val);
    });
    this.clearSearch();

    this.facetManagerService.clearSelections();
  }

  facetQueryConstruct(): void {
    this.queryFacet = '';
    this.displayFacets.forEach((element, index) => {
      if (element) {
        const boolQuery = (this.query && index === 0) ? ' AND ' : '';
        const bool = (this.queryFacet) ? ' AND ' : '';
        this.queryFacet = boolQuery + this.queryFacet + bool + element.type + ':' + element.val;

      }
    });
    // Combine query and facetQuery
    this.queryDisplay = this.query + this.queryFacet;
  }

  // for facets
  facetsParamsUpdated(facetsUpdateEvent: FacetUpdateEvent): void {

    this.privateFacetParams = facetsUpdateEvent.facetParam;
    this.displayFacets = facetsUpdateEvent.displayFacets;

    this.populateUrlQueryParameters();
    this.facetQueryConstruct();

    let applyReady = false;
    for (const key of Object.keys(this.privateFacetParams)) {
      if ((this.privateFacetParams[key].isUpdated === false) && (this.displayFacets.length > 0)) {
        applyReady = true;
      } else {
        applyReady = false;
        break;
      }
    }

    // When Apply Button is clicked, Do Search]
    if (applyReady === true) { // && this.privateFacetParamsUrl) {
      this.setFacetLocationUrl();
      // Search Button, Search Browse
      this.processSearch();
    }
  }
  private encodeValue(facetValue: string) {
    let encFV = facetValue.replace('!', '!@');
    encFV = encFV.replace(/[.]/g, '!.');
    encFV = encFV.replace(/[\+]/g, '!+');
    encFV = encFV.replace(/[,]/g, '!,');
    encFV = encFV.replace(/[\*]/g, '!*');
    return encFV;
  }

  populateUrlQueryParameters(deprecated?: boolean): void {
    const catArr = [];
    let facetString = '';
    for (const key of Object.keys(this.privateFacetParams)) {
      if (this.privateFacetParams[key] !== undefined &&
        this.privateFacetParams[key].hasSelections === true &&
        !(this.privateFacetParams[key] !== undefined &&
          this.privateFacetParams[key].params &&
          this.privateFacetParams[key].params['Deprecated'] === true)) {
        const cat = this.privateFacetParams[key];
        const valArr = [];
        for (const subkey of Object.keys(cat.params)) {
          if (typeof cat.params[subkey] === 'boolean') {
            valArr.push(this.encodeValue(subkey) + '.' + cat.params[subkey]);
          }
        }
        if (cat.isAllMatch) {
          valArr.push('is_all_match.true');
        }
        catArr.push(key + '*' + valArr.join('+'));
        const paramsString = JSON.stringify(this.privateFacetParams[key].params);
        // const newHash = this.utilsService.hashCode(paramsString, this.privateFacetParams[key].isAllMatch.toString());
        //   this.privateFacetParams[key].currentStateHash = newHash;
        //  this.privateFacetParams[key].isUpdated = false;
      }
    }
    facetString = catArr.join(',');
    if (facetString !== '') {
      this.navigationExtrasFacet.queryParams['facets'] = facetString;
    }
    /*
     if (this.showDeprecated) {
      navigationExtras.queryParams['showDeprecated'] = 'true';
    } else {
      navigationExtras.queryParams['showDeprecated'] = null;
    }

    this.previousState.push(this.router.url);
    */

    /*
    setTimeout(() => {
      const urlTree = this.router.createUrlTree([], {
        queryParams: this.navigationExtrasFacet.queryParams,
        queryParamsHandling: 'merge',
        preserveFragment: true
      });
      this.location.go(urlTree.toString());
    });
    */

  }

  setFacetLocationUrl() {
    setTimeout(() => {
      const urlTree = this.router.createUrlTree([], {
        queryParams: this.navigationExtrasFacet.queryParams,
        queryParamsHandling: 'merge',
        preserveFragment: true
      });
      this.location.go(urlTree.toString());
    });
  }

  processSearch(): void {
    const queryStatementHashes = [];

    // Store in cookies, Category tab (Substance, Application, etc)
    const categoryHash = this.utilitiesService.hashCode(this.category);
    localStorage.setItem(categoryHash.toString(), this.category);
    queryStatementHashes.push(categoryHash);

    // Generate Hash Code for Query Statement
    this.queryStatements.forEach(queryStatement => {
      const queryStatementString = JSON.stringify(queryStatement);
      const hash = this.utilitiesService.hashCode(queryStatementString);

      // Store in cookies, Each Query Statement is stored in separate hash
      localStorage.setItem(hash.toString(), queryStatementString);

      // Push Query Statements Hashes in Array
      queryStatementHashes.push(hash);
    });

    // Generate Hash Code for Query
    const queryHash = this.utilitiesService.hashCode(this.query);

    const queryStatementHashesString = JSON.stringify(queryStatementHashes);

    // Store in cookies,  store in Query Hash - Query Statement Hashes Array
    localStorage.setItem(queryHash.toString(), queryStatementHashesString);

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    if ((this.query) || (Object.keys(this.privateFacetParams).length > 0)) {

      if (this.query) {
        if (this.category === 'Clinical Trial') {
          navigationExtras.queryParams['searchTerm'] = this.query;
        } else {
          navigationExtras.queryParams['search'] = this.query;
          navigationExtras.queryParams['g-search-hash'] = queryHash.toString();
        }
      } else if (Object.keys(this.privateFacetParams).length > 0) {
        navigationExtras.queryParams['facets'] = this.navigationExtrasFacet.queryParams['facets'];
      }

      // const navigationExtrasClinical: NavigationExtras = {
      // queryParams: this.query ? { 'searchTerm': this.query, 'facets': this.privateFacetParamsUrl } : null
      // };

      const navigationExtras2: NavigationExtras = {
        queryParams: {
          'g-search-hash': queryHash.toString()
        }
      };

      // this is a test of the push state needed
      // to keep the back button working as desired
      window.history.pushState({}, 'Advanced Search', '/advanced-search'
        + '?g-search-hash=' + navigationExtras2.queryParams['g-search-hash']);

      if (this.category === 'Substance') {
        this.router.navigate(['/browse-substance'], navigationExtras);
      } else if (this.category === 'Application') {
        this.router.navigate(['/browse-applications'], navigationExtras);
      } else if (this.category === 'Product') {
        this.router.navigate(['/browse-products'], navigationExtras);
      } else if (this.category === 'Clinical Trial') {
        this.router.navigate(['/browse-clinical-trials'], navigationExtras);
      } else if (this.category === 'Adverse Event') {
        this.router.navigate(['/browse-adverse-events'], navigationExtras);
      } else {
        this.router.navigate(['/browse-substance'], navigationExtras);
      }
    } else {
      alert('Please select any criteria to search');
    }
  }

  /*
  <!-- STRUCTURE EDITOR -->
  editorOnLoad(editor: Editor): void {
    this.loadingService.setLoading(false);
    this.editor = editor;
    setTimeout(() => {
      this.activatedRoute
        .queryParamMap
        .subscribe(params => {
          if (params.has('structure')) {
            this.structureService.getMolfile(params.get('structure')).subscribe(molfile => {
              this.editor.setMolecule(molfile);
            });
          }
          if (params.has('type')) {
            this.searchType = params.get('type');
          }

          if (this.searchType === 'similarity') {
            this.showSimilarityCutoff = true;
            this.similarityCutoff = params.has('cutoff') && Number(params.get('cutoff')) || 0.8;
          }

          this.searchTypeControl.setValue(this.searchType);
        });
    });
    }

  searchTypeSelected(event): void {
    this.searchType = event.value;

    this.gaService.sendEvent('structureSearch', 'select:search-type', this.searchType);

    if (this.searchType === 'similarity') {
      this.showSimilarityCutoff = true;
      this.similarityCutoff = 0.8;
    } else {
      this.showSimilarityCutoff = false;
    }
  }

  molvecUpdate(mol: any) {
    this.editor.setMolecule(mol);
  }

  openStructureImportDialog(): void {
    this.gaService.sendEvent('structureSearch', 'button:import', 'import structure');
    const dialogRef = this.dialog.open(StructureImportComponent, {
      height: 'auto',
      width: '650px',
      data: {}
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe((structurePostResponse?: InterpretStructureResponse) => {
      this.overlayContainer.style.zIndex = null;

      if (structurePostResponse && structurePostResponse.structure && structurePostResponse.structure.molfile) {
        this.editor.setMolecule(structurePostResponse.structure.molfile);
      }
    }, () => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  openStructureExportDialog(): void {
    this.gaService.sendEvent('structureSearch', 'button:export', 'export structure');
    const dialogRef = this.dialog.open(StructureExportComponent, {
      height: 'auto',
      width: '650px',
      data: {
        molfile: this.editor.getMolfile(),
        smiles: this.editor.getSmiles()
      }
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
    }, () => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  searchCutoffChanged(event): void {
    this.similarityCutoff = event.value;
    this.gaService.sendEvent('structureSearch', 'slider', 'similarity-cutoff', this.similarityCutoff);
  }

  get _editor(): Editor {
    return this.editor;
  }

  get _searchType(): string {
    return this.searchType;
  }

  nameResolved(molfile: string): void {
    this.editor.setMolecule(molfile);
  }
  */

}
