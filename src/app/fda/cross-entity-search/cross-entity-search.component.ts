import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { Location } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';

/* GSRS Core Import */
import { AuthService } from '@gsrs-core/auth/auth.service';
import { UtilsService } from '@gsrs-core/utils/utils.service';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { ConfigService } from '@gsrs-core/config/config.service';
import { MainNotificationService } from '@gsrs-core/main-notification/main-notification.service';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { SubstanceService } from '@gsrs-core/substance';
import { GeneralService } from '../../fda/service/general.service';
import { ProductService } from '../../fda/product/service/product.service';
import { ApplicationService } from '../../fda/application/service/application.service';
import { CrossEntitySearchService } from '../cross-entity-search/cross-entity-search.service'
import { AppNotification, NotificationType } from '@gsrs-core/main-notification/notification.model';
import { Facet, FacetUpdateEvent } from '../../core/facets-manager/facet.model';
import { FacetParam } from '@gsrs-core/facets-manager';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';
import { P } from '@angular/cdk/keycodes';


@Component({
  selector: 'app-cross-entity-search',
  templateUrl: './cross-entity-search.component.html',
  styleUrls: ['./cross-entity-search.component.scss']
})
export class CrossEntitySearchComponent implements OnInit {

  private ENTITY_SUBSTANCE = 'substances';
  private ENTITY_PRODUCT = 'products';
  private ENTITY_APPLICATION = "applications";
  private ENTITY_APPLICATION_ALL = "applicationsall";
  private ENTITY_CLINICAL_TRIAL = "clinicaltrialsus";

  @ViewChild('crossEntitySearchTemplate') crossEntitySearchTemplate: TemplateRef<any>;

  entityLists =
    [{
      entityDisplay: 'Substance',
      entity: this.ENTITY_SUBSTANCE
    },
    {
      entityDisplay: 'Product',
      entity: this.ENTITY_PRODUCT
    },
    {
      entityDisplay: 'Application',
      entity: this.ENTITY_APPLICATION
    },
    {
      entityDisplay: 'Clinical Trial',
      entity: this.ENTITY_CLINICAL_TRIAL
    }
    ];

  @Output() crossEntityFacetsSelected = new EventEmitter<DisplayFacet[]>();
  @Output() getSearchIdsOnly = new EventEmitter<boolean>();

  // Needed for facets
  private isFacetsParamsInit = false;
  private rawFacets: Array<Facet>;
  private privateFacetParams: FacetParam;
  private displayFacets: Array<DisplayFacet> = [];

  // Needed for cross/sub entity search
  thisEntity = null;
  subEntityEndpoint = null;
  subEntityDisplay = null;
  thisEntityDisplayFacets = null;
  thisEntityFullBrowserUrl = null;
  entitySearchTerm = null;
  thisEntityFacetParams: FacetParam;
  bulkQID = null;
  queryText = '';
  statusMessage = '';
  idListForSearch: Array<String>;
  thisEntityTotalRecords = 0;
  subEntityTotalRecords = 0;
  facetsParamsUpdateCount = 0;

  subEntitySearchResultContent: Array<any> = [];
  entity_link_substances_ids: Array<String> = [];

  searchOnIdentifiers = false;
  showDeprecated = false;

  isComponentInit = false;
  isPopupOpen = false;
  isLoading = false;
  isError = false;


  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;

  constructor(
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private location: Location,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    public utilsService: UtilsService,
    public authService: AuthService,
    private overlayContainerService: OverlayContainer,
    private bulkSearchService: BulkSearchService,
    public substanceService: SubstanceService,
    public generalServcie: GeneralService,
    public productService: ProductService,
    public applicationService: ApplicationService,
    public crossEntitySearchService: CrossEntitySearchService) { }

  @Input()
  set searchTerm(entSearchTerm) {
    this.entitySearchTerm = entSearchTerm;
  }

  @Input()
  set entityFacetParams(entFacetParams) {
    this.thisEntityFacetParams = entFacetParams;
  }

  @Input()
  set entityDisplayFacets(entDisplayFacets) {
    this.thisEntityDisplayFacets = entDisplayFacets;
  }

  @Input()
  set entity(ent) {
    this.thisEntity = ent;
  }

  @Input()
  set idLists(list: Array<String>) {
    this.idListForSearch = list || [];

    if (this.idListForSearch.length > 0) {
      // Perform Bulk Query
      this.performBulkQuery(this.subEntityEndpoint);
    }
  }

  @Input()
  set entityTotalRecords(entTotalRecords: number) {
    this.thisEntityTotalRecords = entTotalRecords;
  }

  ngOnInit(): void {
    this.overlayContainer = this.overlayContainerService.getContainerElement();

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  facetsLoaded($event) {
  }

  get filteredSubEntity() {
    // if entity is 'substances', display all the values in the dropdown.
    if (this.thisEntity === this.ENTITY_SUBSTANCE) {
      return this.entityLists.filter(entity => entity.entity !== this.thisEntity);
    } else {
      // if entity is non-substance, only display Substance value in the dropdown
      return this.entityLists.filter(entity => entity.entity === 'substances');
    }

  }

  subEntitySelectedChange(event: any): void {
    // Get Object that is selected in the dropdown
    let subEntity = this.entityLists.find(ent => ent.entity === event.value);

    // Get sub-entity endpoint
    this.subEntityEndpoint = subEntity.entity;
    this.subEntityDisplay = subEntity.entityDisplay;

    //alert("CURRENT URL" + this.location.path());
    this.thisEntityFullBrowserUrl = this.location.path();

    // Show message on popup that loading facets
    if (this.idListForSearch.length == 0) {
      this.statusMessage = 'Loading ' + this.subEntityDisplay + ' facets for ' + this.thisEntityTotalRecords + ' ' + this.thisEntityDisplay + ' records ...';
    }

    // Trigger Emit to call entity/parent to get Search Ids only
    this.getSearchIdsOnly.emit(true);

    // Show sub-entity facets on popup dialog
    this.openModalControls();

    // this.performBulkQuery(this.subEntityEndpoint);

  }

  // for facets. This function is called during facets loading and facets selection/Apply
  subEntityfacetsParamsUpdated(facetsUpdateEvent: FacetUpdateEvent): void {
    
    // Show message on popup that loading facets
    if (this.idListForSearch.length > 0) {
      this.statusMessage = '';
    }

    // count the number of times this function has been called
    this.facetsParamsUpdateCount = this.facetsParamsUpdateCount + 1;

    if (facetsUpdateEvent.deprecated && facetsUpdateEvent.deprecated === true) {
      this.showDeprecated = true;
    } else {
      this.showDeprecated = false;
    }

    // Get Facet selected parameters
    this.privateFacetParams = facetsUpdateEvent.facetParam;

    this.displayFacets = facetsUpdateEvent.displayFacets.filter(facet => !(facet.type === 'Deprecated' && facet.bool === false));

    if (Object.keys(this.privateFacetParams).length > 0) {
    }

    // If this function is called the second time, close the facet popup and call bulkSearch
    if (this.facetsParamsUpdateCount == 2) {

      // if facet popup dialog is open, close it
      if (this.dialog) {
        // Close the popup dialog that has facets
        this.closePopup();

        this.getBulkSearch(this.subEntityEndpoint, this.bulkQID, 100);
      }
    }

  }

  createQueryTextWithIds(entity: string) {
    this.queryText = '';

    // *** Get lists of Substance uuid from facet 'Substance UUID' ***
    if (this.rawFacets && this.rawFacets.length > 0) {
      let ids: Array<string> = [];
      let facetSubUuid = this.rawFacets.find(facet => facet.name === "Substance UUID");
      if (facetSubUuid) {
        facetSubUuid.values.forEach(value => {
          if (value) {
            if (value.label) {
              ids.push(value.label);
            }
          }
        });

        this.idListForSearch = ids;
      }
    }

    this.idListForSearch.forEach((id, index) => {
      if (id) {
        if (index > 0) {
          this.queryText = this.queryText + '\n';
        }
        if (entity && entity === 'substances') {
          this.queryText = this.queryText + 'root_uuid:"' + id + '"';
        } else {
          this.queryText = this.queryText + 'entity_link_substances:"' + id + '"';
        }
      }
    });

    console.log()
  }

  performBulkQuery(entity: string) {

    // Create queries for bulk search
    this.createQueryTextWithIds(entity);

    // ** Perform BULK QUERY **
    this.bulkSearchService.postOrPutBulkQuery(entity, this.queryText).subscribe(result => {
      if (result) {
        if (result.id) {

          this.bulkQID = result.id;

          // Call bulkSearch API
          this.getBulkSearch(entity, result.id);
        }
      }
    });
  }

  getBulkSearch(entity: string, bulkQID: number, fdim: number = 10) {

    // ** Perform BULK SEARCH **
    this.bulkSearchService.getBulkSearch(entity, bulkQID, this.privateFacetParams, this.searchOnIdentifiers).subscribe(response => {
      if (response) {
        if (response.key) {
          // ** Perform BULK SEARCH STATUS RESULTS **
          this.bulkSearchService.getBulkSearchStatusResults(response.key, 10, 0, 10, 0, null, null, response.url, fdim, 'key').subscribe(searchResult => {

            // Only display facets on Popup if facetsParamsUpdateCount() function is called FIRST time
            if (this.facetsParamsUpdateCount == 0) {
              // Set sub-entity facets, and display on Popup
              this.rawFacets = searchResult.facets;

              //this.subEntitySearchResultContent = searchResult.content;

              this.subEntityTotalRecords = searchResult.total;

              // Show sub-entity facets on popup dialog
              //this.openModalControls();
            }

            // Perform Bulk Query Search on this entity to display final results
            if (this.facetsParamsUpdateCount == 2) {

              this.facetsParamsUpdateCount = 3;

              this.privateFacetParams = this.thisEntityFacetParams;
              this.performBulkQuery(this.thisEntity);
            }

            // POPUP FACETS SELECTED, RELOAD ORIGINAL/ENTITY URL with updated results
            if (this.facetsParamsUpdateCount == 3) {
              //Emit sub-entity Facet selections to entity/parent component
              this.crossEntityFacetsSelected.emit(this.displayFacets)

              setTimeout(() => {

                this.router.routeReuseStrategy.shouldReuseRoute = () => false;
                this.router.onSameUrlNavigation = 'reload';

                //const currentUrl = this.router.url;

                //alert("CURRENT URL" + this.location.path());
                this.router.navigateByUrl(this.thisEntityFullBrowserUrl);

              }, 4000);

            }
          });
        }
      }
    });
  }

  searchSubstances() {
    let size = 10;
    let index = 0;
    let privateSearchTerm = null;
    let privateStructureSearchTerm = null;
    let privateSequenceSearchTerm = null;
    let privateSearchType = null;
    let privateSearchSeqType = null
    let privateSequenceSearchKey = null;
    let searchType = null;
    let privateSearchCutoff = null;
    let privateFacetParams = null;

    let sort = null;

    this.createQueryTextWithIds(this.subEntityEndpoint);

    privateSearchTerm = this.queryText;

    //privateSearchTerm = 'root_names_name:\"*POTASSIUM ASPARTATE*\"';

    const subscription = this.substanceService.getSubstancesSummaries({
      searchTerm: privateSearchTerm,
      structureSearchTerm: privateStructureSearchTerm,
      sequenceSearchTerm: privateSequenceSearchTerm,
      cutoff: privateSearchCutoff,
      type: privateSearchType,
      seqType: privateSearchSeqType,
      order: sort,
      pageSize: size,
      facets: privateFacetParams,
      skip: index,
      sequenceSearchKey: privateSequenceSearchKey,
      deprecated: false
    })
      .subscribe(pagingResponse => {

        if (pagingResponse.total > 0) {
          this.rawFacets = pagingResponse.facets;

          // Open Popup with Facet
          //if (this.isPopupFacet == true) {
          this.openModalControls();
          //}
        }

      });
  }

  getFacetsWithBulkQueryApplication() {
    this.createQueryTextWithIds(this.subEntityEndpoint);

    // let queryText = 'entity_link_substances: \"562dbaa7-ee6f-4f58-b64e-41217678aee7\"';

    const s1 = this.bulkSearchService.postOrPutBulkQuery(
      // this._bulkQueryIdOnLoad,
      'applicationsall',
      this.queryText
    )
      .subscribe(bulkQuery => {
        this.isError = false;
        let bulkQID = bulkQuery.id;
        let searchOnIdentifiers = this.searchOnIdentifiers;

        /*
        let searchEntity = 'products';
      //  this._bulkQuery = bulkQuery;
       // this._bulkQueryIdAfterSubmit = bulkQuery.id;
        const navigationExtras: NavigationExtras = {
          queryParams: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            bulkQID: bulkQuery.id,
            searchOnIdentifiers: this.searchOnIdentifiers,
            searchEntity: 'products'
          }
        }; */

        // Perform BULK SEARCH
        this.bulkSearchApplication(bulkQID, searchOnIdentifiers, 'applicationsall');

        // this.router.navigate(['/browse-substance'], navigationExtras);
      }, error => {
        console.log('Error trying to post/put a bulk query.');
        const notification: AppNotification = {
          message: 'Error trying to post/put a bulk query.',
          milisecondsToShow: 6000
        };
        this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
      }, () => {
        s1.unsubscribe();
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      }
      );
  }

  bulkSearchApplication(bulkQID: number, searchOnIdentifiers: boolean, searchEntity: string) {
    const appSearchSubscription = this.applicationService.applicationBulkSearch(
      null,
      bulkQID,
      searchOnIdentifiers,
      searchEntity,
      0,
      'bulk',
      10,
      null,
      'asc',
      0,
    ).subscribe(pagingResponse => {
      if (pagingResponse) {
        // Get Facets from the search results
        this.rawFacets = pagingResponse.facets;

        // Open Popup with Facet
        this.openModalControls();
      }
    });
    this.subscriptions.push(appSearchSubscription);
  }

  bulkQueryCrossEntity() {

    this.createQueryTextWithIds(this.subEntityEndpoint);

    // Do Bulk Query Search on Sub-Entity and show facets on popup
    //let queryText = 'entity_link_substances: \"f2f87acc-d824-4022-888f-b754d0997272\"';

    const s1 = this.bulkSearchService.postOrPutBulkQuery(
      // this._bulkQueryIdOnLoad,
      this.thisEntity,
      this.queryText
    )
      .subscribe(bulkQuery => {
        this.isError = false;
        this.bulkQID = bulkQuery.id;
        let searchOnIdentifiers = this.searchOnIdentifiers;
        let searchEntity = this.thisEntity;

        //  this._bulkQuery = bulkQuery;
        // this._bulkQueryIdAfterSubmit = bulkQuery.id;
        const navigationExtras: NavigationExtras = {
          queryParams: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            bulkQID: this.bulkQID,
            searchOnIdentifiers: this.searchOnIdentifiers,
            searchEntity: this.thisEntity
          }
        };

        // Perform BULK SEARCH
        this.bulkSearchProduct(this.bulkQID, searchOnIdentifiers, searchEntity);

        // this.router.navigate(['/browse-substance'], navigationExtras);
      }, error => {
        console.log('Error trying to post/put a bulk query.');
        const notification: AppNotification = {
          message: 'Error trying to post/put a bulk query.',
          milisecondsToShow: 6000
        };
        this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
      }, () => {
        s1.unsubscribe();
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      }
      );
  }

  bulkSearchProduct(bulkQID: number, searchOnIdentifiers: boolean, searchEntity: string) {
    const prodSubscription = this.productService.productBulkSearch(
      null,
      bulkQID,
      searchOnIdentifiers,
      searchEntity,
      0,
      'bulk',
      10,
      null,
      'asc',
      0,
    ).subscribe(pagingResponse => {
      if (pagingResponse) {

        // Get Facets from the search results
        this.rawFacets = pagingResponse.facets;

        // Open Popup with Facet
        this.openModalControls();

      }
    });
    this.subscriptions.push(prodSubscription);

  }

  searchProducts() {
    let entitySublink = 'entity_link_substances:';
    let privateSearch = entitySublink + '\"' + 'f2f87acc-d824-4022-888f-b754d0997272' + '\"';
    const prodSubscription = this.generalServcie.getProducts(
      'asc',
      0,
      1,
      privateSearch,
      null
    ).subscribe(pagingResponse => {
      if (pagingResponse) {
        // Get Facets from the search results
        this.rawFacets = pagingResponse.facets;
        // Open Popup and display facets for selected Entity
        this.openModalControls();
      }
    });
    this.subscriptions.push(prodSubscription);
  }

  openModalControls() {
    // Set this to false so that Popup dialog is not called next time, instead it should 
    // perform bulk query/bluk search/bulk result for entity endpoint.
    this.isPopupOpen = true;

    const dialogRef = this.dialog.open(this.crossEntitySearchTemplate, {
      minWidth: '60%',
      maxWidth: '80%',
      minHeight: '50%',
      maxHeight: '80%',
      disableClose: true // Prevents closing on outside click
    });

    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  get thisEntityDisplay(): string {
    // Get Object of thisEntity
    let entity = this.entityLists.find(ent => ent.entity === this.thisEntity);

    if (entity) {
      return entity.entityDisplay;
    } else {
      return null;
    }
  }

  closePopup() {
    this.dialog.closeAll();
  }
}
function urldecode(thisEntityFullBrowserUrl: any): any {
  throw new Error('Function not implemented.');
}

