import { Component, OnInit, Input, Output, EventEmitter, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
import { Location } from '@angular/common';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Subscription } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { FormControl } from '@angular/forms';
import lodashCloneDeep from 'lodash/cloneDeep';

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
    styleUrls: ['./cross-entity-search.component.scss'],
    standalone: false
})
export class CrossEntitySearchComponent implements OnInit, OnDestroy {

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
  thisEntityFacetString = '';
  thisEntitySmiles = null;
  thisEntityType = null;
  thisEntityCutoff: number;
  thisEntityStructureSearchTerm = null;
  thisEntitySequenceSearchTerm = null;
  thisEntityFacetParams: FacetParam;
  thisEntityDisplayFacets: Array<DisplayFacet> = [];
  editSubEntitySearchHashCode = null;
  bulkSearchKey = null;
  cancelSearch = false;

  subEntityEndpoint = null;
  subEntityDisplay = null;

  bulkQID = null;
  facetBulkQID = null;
  bulkSearchUrl = null;
  queryText = '';
  statusMessage = '';
  statusMessageSecond = '';

  idListForSearch: Array<string>;
  idListForSearchOld: Array<string>;
  secondIdListForSearch: Array<string>;

  thisEntityTotalRecords = 0;
  subEntityTotalRecords = 0;

  bulkSearchTotal = 0;
  bulkSearchTotalPercent = 0;
  bulkSearchCurrentCount = 0;

  facetsParamsUpdateCount = 0;

  searchOnIdentifiers = false;
  useServiceInUrl: boolean = false;
  showDeprecated = false;

  showFacets: boolean = true;
  isSearchRunning: boolean = false;
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
  set entitySmiles(entSmiles) {
    this.thisEntitySmiles = entSmiles;
  }

  @Input()
  set entityType(entType) {
    this.thisEntityType = entType;
  }

  @Input()
  set entityCutoff(entCutoff) {
    this.thisEntityCutoff = entCutoff;
  }

  @Input()
  set entityStructureSearchTerm(entStructureSearchTerm) {
    this.thisEntityStructureSearchTerm = entStructureSearchTerm;
  }

  @Input()
  set entitySequenceSearchTerm(entSequenceSearchTerm) {
    this.thisEntitySequenceSearchTerm = entSequenceSearchTerm;
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
  set entityTotalRecords(entTotalRecords: number) {
    this.thisEntityTotalRecords = entTotalRecords;
  }

  @Input()
  set editSubEntitySearchHash(editSubEntitySearchHashCd: any) {
    this.editSubEntitySearchHashCode = editSubEntitySearchHashCd;

    // Call function to restore parameters from local storage
    this.editSubEntitySearch();
  }

  @Input()
  set secondIdLists(list: Array<string>) {
    this.secondIdListForSearch = list || [];
  }

  @Input()
  set idLists(list: Array<string>) {
    this.idListForSearch = list || [];

    // copy the lists in the temporary array to use later for comparison
    this.idListForSearchOld = lodashCloneDeep(this.idListForSearch);

    // Only run if search is not canceled
    if (this.cancelSearch == false) {
      if (this.idListForSearch) {
        if (this.idListForSearch.length > 0) {
          // Perform Bulk Query, pass sub-entity endpoint
          this.performBulkQuery(this.subEntityEndpoint, 'key');
        } else {
          // No record found
          this.statusMessage = "No related " + this.subEntityDisplay + " record Found. Please redefine your search criteria.";
          this.isSearchRunning = false;
        }
      }
    }
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

  showMessageTwo() {
    // Show message
    this.statusMessageSecond = 'Narrow down ' + this.thisEntityDisplay + ' search results by applying related '
      + this.subEntityDisplay + ' facets.';

    if (!this.thisEntityDisplayFacets || !this.thisEntitySearchTerm) {
      this.statusMessageSecond += ' It is preferable to select any search criteria in Browse ' + this.thisEntityDisplay + ' before getting ' + this.subEntityDisplay + ' facets.';
    }
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

  getEntityUrlParameters() {
    if (this.thisEntityDisplayFacets && this.thisEntityDisplayFacets.length > 0) {
      this.thisEntityDisplayFacets.forEach((facet, index) => {
        if (facet) {
          if (index > 0) {
            this.thisEntityFacetString += ',';
          }
          this.thisEntityFacetString += facet.type + '*' + facet.val + '.' + facet.bool;
        }
      });
    }
  }

  cancelBulkSearch() {
    this.statusMessage = "Canceling Search...";

    if (this.subEntityEndpoint !== this.ENTITY_SUBSTANCE) {
      this.useServiceInUrl = true;
    }

    if (this.bulkSearchKey) {
      this.crossEntitySearchService.cancelBulkSearch(this.subEntityEndpoint, this.bulkSearchKey, this.useServiceInUrl).subscribe(response => {
        this.cancelSearch = true;
        this.isSearchRunning = false;
        this.statusMessage = "Search Canceled";
      }, error => {
        this.statusMessage = 'Something went wrong while canceling the search';
        console.log('Error canceling Bulk Search');
      }
      );
    } else {
      this.cancelSearch = true;
      this.isSearchRunning = false;
      this.statusMessage = "Search Canceled";
    }

  }

  showSubEntityFacets() {
    // Initialize values
    this.bulkSearchKey = null;
    this.cancelSearch = false;
    this.isSearchRunning = true;
    this.bulkSearchTotal = 0;
    this.bulkSearchTotalPercent = 0;
    this.bulkSearchCurrentCount = 0;

    this.statusMessage = 'Preparing to get ' + this.subEntityDisplay + ' facets for ' + this.thisEntityTotalRecords + ' ' + this.thisEntityDisplay + ' records ...';

    // Trigger Emit to call entity/parent to get Search Ids only
    this.getSearchIdsOnly.emit(true);
  }

  getCommonStrings(arr1: string[], arr2: string[]): string[] {
    return arr1.filter(str => arr2.includes(str));
  }

  subEntitySelectedChange(event: any): void {
    // Get Object that is selected in the dropdown
    let subEntity = this.entityLists.find(ent => ent.entity === event.value);

    // Get sub-entity endpoint
    this.subEntityEndpoint = subEntity.entity;
    this.subEntityDisplay = subEntity.entityDisplay;

    // Initialize 
    this.facetsParamsUpdateCount = 0;
    this.bulkSearchTotal = 0;
    this.bulkSearchKey = null;
    this.isSearchRunning = false;
    this.showFacets = true;
    this.rawFacets = [];
    this.privateFacetParams = null;

    this.showMessageTwo();

    this.statusMessage = "It may take some time to display " + this.subEntityDisplay + " facets here."
    this.statusMessage += "<br><br>Click 'Show " + this.subEntityDisplay + " Facets' button to continue."

    // Get parameter values from URL, such as facets, q
    this.getEntityUrlParameters();

    // Show sub-entity facets on popup dialog
    this.openModal();

  }

  // for facets. This function is called during facets loading and facets selection/Apply
  subEntityfacetsParamsUpdated(facetsUpdateEvent: FacetUpdateEvent): void {
    // clear message
    // this.statusMessage = '';

    // count the number of times this function has been called. This function is called during
    // facets initialization or facets apply
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
        this.removePrivateFacetParams = lodashCloneDeep(this.privateFacetParams);
      }
    }

    // FACET APPLY CLICKED: If this function is called the second time, and after facets selected and clicked 'Apply',
    // close the facet popup and call bulk search on sub-entity with facet values
    if (this.facetsParamsUpdateCount == 2) {

      // Strip off the any Entity/Parent facet selection passed along with sub-entity facet selection
      if (this.removePrivateFacetParams) {
        const facetKeysToRemove = Object.keys(this.removePrivateFacetParams);
        facetKeysToRemove.forEach(key => {
          delete this.privateFacetParams[key];
        });
      }

      // if facet popup dialog is open
      if (this.dialog) {

        // Do not show facets on popup
        this.showFacets = false;
        this.facetBulkQID = this.bulkQID;

        this.statusMessage = "Applying " + this.subEntityDisplay + " facets and will reload " + this.thisEntityDisplay + " search results.";

        // ******** Perform bulk search on sub-entity after FACET SELECTION on sub-entity ********
        this.getSearchStatusResults(this.subEntityEndpoint, this.bulkSearchKey, 'key', 10);

        // this.performBulkSearch(this.subEntityEndpoint, this.bulkQID, 'key', this.MAX_RECORD);
      }
    }

  }

  createQueryTextWithIds(entity: string, rootId: boolean = false) {
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

    // Sub-Entity facets have been applied
    if ((this.facetsParamsUpdateCount == 3) && (entity === 'substances')) {
      // Filter the Ids
      // For Browse Substance page, after Product/Application facets are selected and applied, need to find 
      // the common Substance Uuid from the original substance browser to Product facets, since each product can have many substances
      const commonIdLists = this.getCommonStrings(this.idListForSearchOld, this.idListForSearch);
      this.idListForSearch = commonIdLists;
    }

    // if entity is product, application
    if (rootId) {
      const commonIdLists = this.getCommonStrings(this.secondIdListForSearch, this.idListForSearch);
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
          if (rootId) {
            this.queryText = this.queryText + 'root_id:"' + id + '"';
          } else {
            this.queryText = this.queryText + 'entity_link_substances:"' + id + '"';
          }
        }
      }
    });
  }

  performBulkQuery(entity: string, view?: string, reloadBrowser: boolean = false, rootId: boolean = false, loopBulkSearch: boolean = true) {

    // Create queries for bulk search
    this.createQueryTextWithIds(entity, rootId);

    // ** Perform BULK QUERY **
    this.bulkSearchService.postOrPutBulkQuery(entity, this.queryText).subscribe(result => {
      if (result) {
        if (result.id) {

          // Do not get field value _self if the entity is not substances
          /*if (entity && entity !== this.ENTITY_SUBSTANCE) {
            // Get ._self field after executing @bulkQuery
            let selfUrl = result._self;
            if (selfUrl) {
              const urlIndex: number = selfUrl.indexOf('@');
              if (urlIndex > 0) {
                this.bulkSearchUrl = selfUrl.substring(0, urlIndex) + 'bulkSearch';
              }
            }
          } */

          this.bulkQID = result.id;

          if (reloadBrowser) {

            // Reset message
            this.statusMessage = '';

            // Close popup if it is open
            if (this.dialog) {
              this.closePopup();
            }

            // Reload browser with new bulk search results
            this.reloadBrowser();
          } else {
            // Call bulkSearch API
            this.performBulkSearch(entity, result.id, view, 10, loopBulkSearch);
          }
        }
      }
    });
  }

  performBulkSearch(entity: string, bulkQID: number, view?: string, fdim: number = 10, loopBulkSearch: boolean = true) {
    let iterator = 0;
    this.getBulkSearch(entity, bulkQID, view, fdim, loopBulkSearch, iterator);
  }

  getBulkSearch(entity: string, bulkQID: number, view?: string, fdim: number = 10, loopBulkSearch: boolean = true, iterator: number = 0) {
    iterator = iterator + 1;

    // ** Perform BULK SEARCH **
    if (entity !== this.ENTITY_SUBSTANCE) {
      this.useServiceInUrl = true;
    }

    if (this.cancelSearch == false) {

      // if false, set it to true
      if (!this.isSearchRunning) {
        this.isSearchRunning = true;
      };

      this.crossEntitySearchService.getBulkSearchWithFacets(entity, bulkQID, this.bulkSearchUrl, this.searchOnIdentifiers, this.privateFacetParams, view, this.useServiceInUrl).subscribe(response => {
        const searchResults: any = response;

        if (searchResults) {

          this.bulkSearchKey = searchResults.key;

          // Bulk Search NOT FINSHED YET, call again
          if (searchResults.finished == false) {

            // Get Search Total
            // get Total after every 5 bulkSearch API is called
            if (this.facetsParamsUpdateCount == 0) {
              if ((iterator == 1) || (iterator % 4 === 0)) {
                this.getBulkSearchTotal(entity, searchResults.key, this.useServiceInUrl);
              }
            }

            // Calculate records percentage
            if (this.bulkSearchTotal > 0) {
              let notRoundedPercent = (searchResults.count / this.bulkSearchTotal) * 100;
              this.bulkSearchTotalPercent = Math.round(notRoundedPercent);
            }

            this.bulkSearchCurrentCount = searchResults.count;

            // Doing search after 'Apply' is clicked on popup facets
            if (this.facetsParamsUpdateCount >= 2) {
              this.statusMessage = "Applying " + this.subEntityDisplay + " facets, will reload Browse " + this.thisEntityDisplay + " page soon...";
            } else {
              /*if (this.entity === this.ENTITY_SUBSTANCE)
                this.statusMessage = "Found " + "<span class='colorblack'>" + searchResults.count + " of " + this.bulkSearchTotal + "</span> " +
                this.subEntityDisplay + " records so far, still searching...";
              } else { */
              this.statusMessage = "Getting " + this.subEntityDisplay + " facets. Please wait...";
              //}  
            }

            if (loopBulkSearch) {
              setTimeout(() => {
                this.getBulkSearch(entity, bulkQID, view, fdim, loopBulkSearch, iterator);
              }, 8000); // every 8 second
            } else {
              this.getSearchStatusResults(entity, searchResults.key, view, fdim);
            }

          } else {
            // If bulk search is finished, call bulk search status results
            if (searchResults.finished == true) {

              this.statusMessage = '';
              this.isSearchRunning = false;

              if (searchResults.total > 0) {
                // Call Search Status Results after bulk Search field 'finished = true'
                this.getSearchStatusResults(entity, searchResults.key, view, fdim);
              } else {
                this.statusMessage = 'No ' + this.subEntityDisplay + ' records were found.';
              }
            }
          }
        } else {
          this.isSearchRunning = false;
        }
      }, error => {
        this.statusMessage = 'Something went wrong while getting the facets. Close this dialog and perform search again';
        console.log('Error getting Bulk Search');
      }
      );

    } else {
      this.isSearchRunning = false;
      this.statusMessage = 'Search Canceled';
    }
  }

  getSearchStatusResults(entity: string, key: number, view: string = 'key', fdim: number) {
    let viewField = null;
    let viewLabel = null;
    let simpleSearchOnly = 'false';
    let top = 10;

    // In the Facet Popup Dialog, facets are selected and clicked 'Apply'
    if (this.facetsParamsUpdateCount == 2) {
      if (this.entity === this.ENTITY_SUBSTANCE) {
        viewField = 'facet';
        viewLabel = 'Substance UUID';
      } else {
        // if entity is products, applications, etc
        top = 1000000;
        fdim = 10;
        simpleSearchOnly = 'true';
      }
    }

    // After Sub Entity facet is applied, assigned this values
    if (this.facetsParamsUpdateCount == 3) {

      // if entity is products, applications
      top = 1000000;
      view = 'key';
      //viewField = 'id';
    }

    if (entity !== this.ENTITY_SUBSTANCE) {
      this.useServiceInUrl = true;
    }

    // ** Perform BULK SEARCH STATUS RESULTS **
    this.crossEntitySearchService.getBulkSearchStatusResults(entity, key, fdim, view, viewField, viewLabel, this.useServiceInUrl, simpleSearchOnly, this.privateFacetParams, top).subscribe(response => {

      // Only display facets on Popup, if facetsParamsUpdateCount() function is called FIRST time
      if (this.facetsParamsUpdateCount == 0) {

        this.subEntityTotalRecords = response.total;

        this.isSearchRunning = false;

        if (response.total > 0) {
          // Set sub-entity facets, and display on Popup
          this.rawFacets = response.facets;

          this.statusMessage = 'Select ' + this.subEntityDisplay + " facets below and click 'Apply' to narrow down related" + this.thisEntityDisplay + ' records';
        } else {
          this.statusMessage = 'No ' + this.subEntityDisplay + ' found.';
        }
      }

      // Keep this code in this order, This is called when entity is product, application, etc
      if (this.facetsParamsUpdateCount == 3) {

        this.facetsParamsUpdateCount = 4;

        this.statusMessage = 'Searching records, will refresh Browse ' + this.subEntityDisplay + ' page soon...';

        this.privateFacetParams = this.entityFacetParams;

        /*
        if (response.total > 0) {
          let ids: Array<string> = [];
          if (response.content && response.content.length > 0) {
            response.content.forEach(productId => {
              if (productId) {
                ids.push(productId);
              }
            });

            // This will trigger to call bulkQuery, bulkSearch, and bulkSearchStatusResults
            this.idListForSearch = ids;
          }
        } */

        this.getResultsFromStatusMatchType(response.summary);
      }

      // RESULT after facets Applied. Perform Bulk Query Search on this entity to display final results
      if (this.facetsParamsUpdateCount == 2) {

        this.facetsParamsUpdateCount = 3;

        this.privateFacetParams = this.entityFacetParams;

        if (response.total > 0) {

          // if entity is substances
          if (this.entity && this.entity === 'substances') {
            // *** get lists of Substance UUID *** from product, application, etc facets
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

              // Perform ***FINAL**** search on Entity
              this.performBulkQuery(this.entity, 'full', true);
            }
          } else {
            // else if entity is either products or applications, etc (non-substance)
            // get Substance uuids from content[]
            let ids: Array<string> = [];
            if (response.content && response.content.length > 0) {
              response.content.forEach(substance => {
                if (substance) {
                  if (substance.idString) {
                    ids.push(substance.idString);
                  }
                }
              });

              this.idListForSearch = ids;

              // Perform search on Entity
              this.performBulkQuery(this.entity, 'full', false, false, false);
            }
          }
        } // total > 0

      } // facetsParamsUpdateCount == 2

      // RELOAD ORIGINAL/ENTITY URL with updated results
      if (this.facetsParamsUpdateCount == 4) {
        // Perform FINAL search on Entity
        this.performBulkQuery(this.entity, 'full', true, true);
      }

    });
  }

  getBulkSearchTotal(entity: string, key: number, useServiceInUrl: boolean) {
    let qTop = 1000000;
    let count = 0;
    if (entity === this.ENTITY_SUBSTANCE) {
      this.bulkSearchTotal = this.idListForSearch.length;
    } else {

      // ** Perform BULK SEARCH STATUS RESULTS **       
      this.crossEntitySearchService.getBulkSearchStatusResults(entity, key, 10, null, null, null, useServiceInUrl, null, this.privateFacetParams, 10, 0, 1000000).subscribe(response => {
        if (response) {
          if (response.summary) {
            //  this.bulkSearchTotal = response.summary.qMatchTotal;

            let summary = response.summary;

            if (summary.queries && summary.queries.length > 0) {
              let queries = summary.queries;
              // Loop through queries
              queries.forEach((query, index) => {
                if (query) {
                  if (query.records) {
                    if (query.records.length > 0) {
                      let records = query.records;
                      if (records && records.length > 0) {
                        let length = records.length;
                        count = count + length;
                      }
                    }
                  }
                }

                if (queries.length == index + 1) {
                  // Get Search Total                
                  this.bulkSearchTotal = count;
                }
              }); // forEach queries

            } // if summary.queries

          } // if response.summary
        } // response
      });
    }
  }

  getResultsFromStatusMatchType(summary: any) {
    let idsFromBulkSearchSummary = [];
    if (summary) {
      if (summary.queries && summary.queries.length > 0) {
        let queries = summary.queries;
        queries.forEach((query, index) => {
          if (query) {
            if (query.records) {
              if (query.records.length > 0) {
                let records = query.records;
                records.forEach(record => {
                  if (record) {
                    if (record.id) {
                      idsFromBulkSearchSummary.push(record.id);
                    }
                  }

                  // This will trigger to call bulkQuery, bulkSearch, and bulkSearchStatusResults
                  if (queries.length == index + 1) {

                    // Only get Ids that was searched originally
                    const commonIdLists = this.getCommonStrings(this.secondIdListForSearch, idsFromBulkSearchSummary);

                    // This will TRIGGER query
                    this.idListForSearch = commonIdLists;


                  }

                });
              } else {
              }
            }
          }
        }); // forEach
      }
    } // if summary

  }

  reloadBrowser() {
    // store values in array to retreive later from localStorage
    let item = {
      'entity': this.entity,
      'subEntityDisplay': this.subEntityDisplay,
      'thisEntitySmile': this.thisEntitySmiles,
      'thisEntityType': this.thisEntityType,
      'thisEntityCutoff': this.thisEntityCutoff,
      'thisEntityStructureSearchTerm': this.thisEntityStructureSearchTerm,
      'thisEntitySequenceSearchTerm': this.thisEntitySequenceSearchTerm,
      'thisEntityFacetParams': this.thisEntityFacetParams,
      'thisEntityDisplayFacets': this.thisEntityDisplayFacets,
      'subEntityDisplayFacets': this.subEntityDisplayFacets,
      'idListForSearch': this.idListForSearchOld,
      'thisEntityTotalRecords': this.thisEntityTotalRecords,
      'subEntityTotalRecords': this.subEntityTotalRecords,
      'rawFacets': this.rawFacets,
      'facetBulkQID': this.facetBulkQID,
      'secondIdListForSearch': this.secondIdListForSearch
    };

    // Store in cookies,  store sub-entity facets selected
    const searchItemHash = this.utilsService.hashCode(item);

    // Store parameters in local storage
    localStorage.setItem(searchItemHash.toString(), JSON.stringify(item));

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    if (this.bulkQID > 0) {
      navigationExtras.queryParams['bulkQID'] = this.bulkQID;
    }

    if (this.bulkQID > 0) {
      navigationExtras.queryParams['searchEntity'] = this.entity;
    }

    if (searchItemHash) {
      navigationExtras.queryParams['subentity-hash'] = searchItemHash;
    }

    if (this.thisEntitySearchTerm) {
      navigationExtras.queryParams['search'] = this.thisEntitySearchTerm || null;
    }

    if (this.thisEntityType) {
      navigationExtras.queryParams['type'] = this.thisEntityType || null;
    }

    if (this.thisEntityCutoff) {
      navigationExtras.queryParams['cutoff'] = this.thisEntityCutoff || null;
    }

    if (this.thisEntitySmiles) {
      navigationExtras.queryParams['smiles'] = this.thisEntitySmiles || null;
    }

    if (this.thisEntityFacetString) {
      navigationExtras.queryParams['facets'] = this.thisEntityFacetString;
    }

    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';

    if (this.entity === this.ENTITY_SUBSTANCE) {
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

      // remove digits after '_' from the Hash code
      let hashCodeIndex: number = this.editSubEntitySearchHashCode.indexOf('_');

      // Found character '_'
      if (hashCodeIndex > 0) {
        let truncatedHashCode = this.editSubEntitySearchHashCode.substring(0, hashCodeIndex);

        let searchParams = localStorage.getItem(truncatedHashCode);

        if (searchParams) {
          const searchParamItems = JSON.parse(searchParams);

          if (searchParamItems) {
            this.entity = searchParamItems['entity'];
            this.subEntityDisplay = searchParamItems['subEntityDisplay'];

            this.thisEntityFacetParams = searchParamItems['thisEntityFacetParams'];
            this.subEntityDisplayFacets = searchParamItems['subEntityDisplayFacets'];

            this.thisEntityTotalRecords = searchParamItems['thisEntityTotalRecords'];
            this.subEntityTotalRecords = searchParamItems['subEntityTotalRecords'];

            this.secondIdListForSearch = searchParamItems['secondIdListForSearch'];

            this.thisEntityFacetParams =  searchParamItems['thisEntityFacetParams'];
            this.thisEntityDisplayFacets =  searchParamItems['thisEntityDisplayFacets'];

            this.privateFacetParams = null;

            // Get Object that is selected in the dropdown
            let subEntity = this.entityLists.find(ent => ent.entityDisplay === this.subEntityDisplay);

            // Get sub-entity endpoint
            if (subEntity) {
              this.subEntityEndpoint = subEntity.entity;
            }

            // Show Message
            this.showMessageTwo();

            // Initialize values
            this.statusMessage = 'Select ' + this.subEntityDisplay + " facets below and click 'Apply' to narrow down related" + this.thisEntityDisplay + ' records';
            this.showFacets = true;
            this.facetsParamsUpdateCount = 0;

            //this.idListForSearchOld = searchParamItems['idListForSearch'];
            // this.idListForSearch = searchParamItems['idListForSearch'];
            this.bulkQID = searchParamItems['facetBulkQID'];

            // Get Bulk Substance Key for bulkQID
            if (this.bulkQID) {
              this.crossEntitySearchService.getBulkSearchWithFacets(this.subEntityEndpoint, this.bulkQID, this.bulkSearchUrl, this.searchOnIdentifiers, this.privateFacetParams, 'key', this.useServiceInUrl).subscribe(response => {
                const searchResults: any = response;

                if (searchResults) {
                  this.bulkSearchKey = searchResults.key;
    
                  // Set Facets
                  this.rawFacets = searchParamItems['rawFacets'];

                }
              });
            }

          }

          // Open Facets Popup
          this.openModal();

        }
      }
    }
  }

  openModal() {
    const dialogRef = this.dialog.open(this.crossEntitySearchTemplate, {
      minWidth: '60vw',
      maxWidth: '80vw',
      minHeight: '50vh',
      maxHeight: '80vh',
      panelClass: 'cross-entity-search-dialog',
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