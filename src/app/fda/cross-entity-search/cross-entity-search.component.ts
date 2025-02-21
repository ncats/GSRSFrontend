import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { Location } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import * as _ from 'lodash';

/* GSRS Import */
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

@Component({
  selector: 'app-cross-entity-search',
  templateUrl: './cross-entity-search.component.html',
  styleUrls: ['./cross-entity-search.component.scss']
})
export class CrossEntitySearchComponent implements OnInit {

  @Output() crossEntityFacetsSelected = new EventEmitter<DisplayFacet[]>();
  @Output() getSearchIdsOnly = new EventEmitter<boolean>();

  private ENTITY_SUBSTANCE = 'substances';
  private ENTITY_PRODUCT = 'products';
  private ENTITY_APPLICATION = "applications";
  private ENTITY_APPLICATION_ALL = "applicationsall";
  private ENTITY_CLINICAL_TRIAL = "clinicaltrialsus";

  private MAX_RECORD = 1000000;

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
    }
      /*,
      {
        entityDisplay: 'Clinical Trial',
        entity: this.ENTITY_CLINICAL_TRIAL
      } */
    ];

  // Needed for facets
  private isFacetsParamsInit = false;
  private rawFacets: Array<Facet>;
  private privateFacetParams: FacetParam;
  private removePrivateFacetParams: FacetParam;
  private subEntityDisplayFacets: Array<DisplayFacet> = [];

  // Needed for cross/sub entity search
  thisEntitySearchTerm = null;
  thisEntityFacetParams: FacetParam;
  thisEntityDisplayFacets = null;
  editSubEntitySearchHashCode = null;

  subEntityEndpoint = null;
  subEntityDisplay = null;

  bulkQID = null;
  queryText = '';
  statusMessage = '';

  idListForSearch: Array<string>;
  idListForSearchOld: Array<string>;

  thisEntityTotalRecords = 0;
  subEntityTotalRecords = 0;
  facetsParamsUpdateCount = 0;

  searchOnIdentifiers = false;
  showDeprecated = false;

  isLoading = false;
  isError = false;

  showFacetForFormControl = new FormControl();
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

  @Input() entity: string;

  @Input()
  set searchTerm(entSearchTerm) {
    this.thisEntitySearchTerm = entSearchTerm;
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
  set idLists(list: Array<string>) {
    this.idListForSearch = list || [];

    // copy the lists in the temporary array to use later for comparision
    this.idListForSearchOld = _.cloneDeep(this.idListForSearch);

    if (this.idListForSearch.length > 0) {
      // Perform Bulk Query
      this.performBulkQuery(this.subEntityEndpoint, 'key');
    }
  }

  @Input()
  set entityTotalRecords(entTotalRecords: number) {
    this.thisEntityTotalRecords = entTotalRecords;
  }

  @Input()
  set editSubEntitySearchHash(editSubEntitySearchHashCd: any) {
    this.editSubEntitySearchHashCode = editSubEntitySearchHashCd;

    this.editSubEntitySearch();
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
    if (this.entity === this.ENTITY_SUBSTANCE) {
      return this.entityLists.filter(entity => entity.entity !== this.entity);
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

    // Show message on popup that loading facets
    this.statusMessage = 'Loading ' + this.subEntityDisplay + ' facets for ' + this.thisEntityTotalRecords + ' ' + this.thisEntityDisplay + ' records';

    this.facetsParamsUpdateCount = 0;

    if (this.editSubEntitySearchHashCode) {
    } else {
      // Trigger Emit to call entity/parent to get Search Ids only
      this.getSearchIdsOnly.emit(true);
    }

    // Show sub-entity facets on popup dialog
    this.openModal();

  }

  // for facets. This function is called during facets loading and facets selection/Apply
  subEntityfacetsParamsUpdated(facetsUpdateEvent: FacetUpdateEvent): void {
    // clear message
    this.statusMessage = '';

    // count the number of times this function has been called
    this.facetsParamsUpdateCount = this.facetsParamsUpdateCount + 1;

    // Get Facet selected parameters
    this.privateFacetParams = facetsUpdateEvent.facetParam;

    this.subEntityDisplayFacets = facetsUpdateEvent.displayFacets.filter(facet => !(facet.type === 'Deprecated' && facet.bool === false));

    if (facetsUpdateEvent.deprecated && facetsUpdateEvent.deprecated === true) {
      this.showDeprecated = true;
    } else {
      this.showDeprecated = false;
    }

    // Some how the facets selected in entity has been passed to sub-entity. Need to strip this off.
    if (this.facetsParamsUpdateCount == 1) {
      if (Object.keys(this.privateFacetParams).length > 0) {
        this.removePrivateFacetParams = _.cloneDeep(this.privateFacetParams);
      }
    }

    // If this function is called the second time, and after facets selected and clicke 'Apply',
    // close the facet popup and call bulk search on sub-entity with facet values
    if (this.facetsParamsUpdateCount == 2) {

      // Strip off the any Entity/Parent facet selection passed along with sub-entity facet selection
      if (this.removePrivateFacetParams) {
        const facetKeysToRemove = Object.keys(this.removePrivateFacetParams);
        facetKeysToRemove.forEach(key => {
          delete this.privateFacetParams[key];
        });
      }

      // if facet popup dialog is open, close it
      if (this.dialog) {
        // Close the popup dialog that has facets
        this.closePopup();

        // ******** Perform bulk search on sub-entity after FACET SELECTION on sub-entity ********
        this.getBulkSearch(this.subEntityEndpoint, this.bulkQID, 'key', this.MAX_RECORD);
      }
    }

  }

  getCommonStrings(arr1: string[], arr2: string[]): string[] {
    return arr1.filter(str => arr2.includes(str));
  }

  createQueryTextWithIds(entity: string) {
    this.queryText = '';

    // *** Get lists of Substance uuid from facet 'Substance UUID' ***
    if ((this.rawFacets && this.rawFacets.length > 0) && (this.facetsParamsUpdateCount == 1)) {
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

    if ((this.facetsParamsUpdateCount == 3) && (entity === 'substances')) {
      const commonIdLists = this.getCommonStrings(this.idListForSearchOld, this.idListForSearch);
      this.idListForSearch = commonIdLists;
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
  }

  performBulkQuery(entity: string, view?: string, performBulkSearch: boolean = true, reloadBrowser: boolean = false) {

    // Create queries for bulk search
    this.createQueryTextWithIds(entity);

    // ** Perform BULK QUERY **
    this.bulkSearchService.postOrPutBulkQuery(entity, this.queryText).subscribe(result => {
      if (result) {
        if (result.id) {

          this.bulkQID = result.id;

          if (performBulkSearch) {
            // Call bulkSearch API
            this.getBulkSearch(entity, result.id, view);
          }

          if (reloadBrowser) {
            this.reloadBrowser();
          }
        }
      }
    });
  }

  getBulkSearch(entity: string, bulkQID: number, view?: string, fdim: number = 10) {
    // ** Perform BULK SEARCH **
    // this.bulkSearchService.getBulkSearchOrStatusResults(entity, bulkQID, this.searchOnIdentifiers, this.privateFacetParams, view).subscribe(searchResult => {
    this.bulkSearchService.getBulkSearchWithFacets(entity, bulkQID, this.searchOnIdentifiers, this.privateFacetParams, view).subscribe(response => {

      const searchResults: any = response;

      if (searchResults) {
        if (searchResults.finished == false) {

          setTimeout(() => {
            this.getBulkSearch(entity, bulkQID, view, fdim);
          }, 7000); // every 7 seconds

        } else {
          if (searchResults.finished == true) {

            if (searchResults.total > 0) {
              // Call Search Status Results after bulk Search field 'finished = true'
              this.getSearchStatusResults(searchResults.key, searchResults.results, view, fdim);
            } else {
              this.statusMessage = 'No ' + this.subEntityDisplay + ' records were found.';
            }
          }
        }

        // if (response.statusKey) {

      }
    }, error => {
      this.statusMessage = 'Something went wrong while getting the facets. Close this dialog and perform search again';
      console.log('Error getting Bulk Search');
    }
    );
  }

  getSearchStatusResults(key: number, url: string, view = 'key', fdim: number) {
    let viewField = null;
    let viewLabel = null;

    if (this.facetsParamsUpdateCount == 2) {
      viewField = 'facet';
      viewLabel = 'Substance UUID';
    }

    // ** Perform BULK SEARCH STATUS RESULTS **
    this.bulkSearchService.getBulkSearchResults(key, url, fdim, view, viewField, viewLabel).subscribe(response => {

      // Only display facets on Popup if facetsParamsUpdateCount() function is called FIRST time
      if (this.facetsParamsUpdateCount == 0) {

        this.subEntityTotalRecords = response.total;

        if (response.total > 0) {
          // Set sub-entity facets, and display on Popup
          this.rawFacets = response.facets;
        }
      }

      // Perform Bulk Query Search on this entity to display final results
      if (this.facetsParamsUpdateCount == 2) {

        this.facetsParamsUpdateCount = 3;

        this.privateFacetParams = this.entityFacetParams;

        if (response.total > 0) {
          if (this.entity && this.entity === 'substances') {
            // *** get lists of Substance UUID ***
            let ids: Array<string> = [];
            let facetSubUuids = response.facets.find(facet => facet.name === "Substance UUID");

            if (facetSubUuids) {
              facetSubUuids.values.forEach(value => {
                if (value) {
                  if (value.label) {
                    ids.push(value.label);
                  }
                }
              });

              this.idListForSearch = ids;
            }
          }

          // Perform FINAL search on Entity
          this.performBulkQuery(this.entity, 'full', false, true);
        }

      }

      // RELOAD ORIGINAL/ENTITY URL with updated results
      if (this.facetsParamsUpdateCount == 3) {
      }

    });
  }

  reloadBrowser() {
    // store values in array to retreive later from localStorage
    let arrayStorage: Array<any> = [];
    let item: any = {}

    item = { 
      'subEntity': this.subEntityDisplay, 
      'subEntityDisplayFacets': this.subEntityDisplayFacets, 
      'idListForSearch': this.idListForSearchOld
    };

    // Store in cookies,  store sub-entity facets selected
    const searchItemHash = this.utilsService.hashCode(item);

    localStorage.setItem(searchItemHash.toString(), JSON.stringify(item));

    const navigationExtras: NavigationExtras = {
      queryParams: {}
      // queryParams: this.privateFacetParams ? { 'facets': this.privateFacetParams } : null
    };

    if (this.thisEntitySearchTerm) {

      //  navigationExtras.queryParams['q'] = this.entitySearchTerm || null;
    }

    if (searchItemHash) {
      navigationExtras.queryParams['subentity-hash'] = searchItemHash;
    }

    if (this.bulkQID > 0) {
      navigationExtras.queryParams['bulkQID'] = this.bulkQID;
    }

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';

    if (this.entity === this.ENTITY_SUBSTANCE) {
      this.router.routeReuseStrategy.shouldReuseRoute = () => false;
      this.router.onSameUrlNavigation = 'reload';
      this.router.navigate(['/browse-substance'], navigationExtras);
      //this.router.navigate(['/product', id, 'edit']);

      this.router.navigate(['/browse-substance'], navigationExtras);
    } else if (this.entity === this.ENTITY_PRODUCT) {
      this.router.navigate(['/browse-products'], navigationExtras);
    } else if (this.entity === this.ENTITY_APPLICATION) {
      this.router.navigate(['/browse-applications'], navigationExtras);
    }

  }

  get thisEntityDisplay(): string {
    // Get Object of thisEntity
    let entity = this.entityLists.find(ent => ent.entity === this.entity);

    if (entity) {
      return entity.entityDisplay;
    } else {
      return null;
    }
  }

  editSubEntitySearch() {
    if (this.editSubEntitySearchHashCode) {
      let searchParams = localStorage.getItem(this.editSubEntitySearchHashCode);

      if (searchParams) {
        const searchParamItems = JSON.parse(searchParams);
        if (searchParamItems) {
          this.idListForSearch = searchParamItems['idListForSearch'];

          console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB " + JSON.stringify(this.idListForSearch));
          //this.subEntity = searchParamItems['subEntity'];
          // this.subEntityDisplayFacets = searchParamItems['subEntityDisplayFacets'];
        }

        this.idLists = this.idListForSearch;

        this.subEntitySelectedChange(this.entity);
      }

    }
  }

  openModal() {
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

  closePopup() {
    // Deselect value in dropdown before closing the popup dialog
    this.showFacetForFormControl.setValue(null);
    this.dialog.closeAll();
  }

}