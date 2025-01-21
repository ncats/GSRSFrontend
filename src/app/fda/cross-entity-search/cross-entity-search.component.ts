import { Component, OnInit, Input, ViewChild, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras, Params } from '@angular/router';
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
import { Facet, FacetUpdateEvent } from '../../core/facets-manager/facet.model';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification/notification.model';
import { A } from '@angular/cdk/keycodes';

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
      entityValue: this.ENTITY_SUBSTANCE
    },
    {
      entityDisplay: 'Product',
      entityValue: this.ENTITY_PRODUCT
    },
    {
      entityDisplay: 'Application',
      entityValue: this.ENTITY_APPLICATION
    },
    {
      entityDisplay: 'Clinical Trial',
      entityValue: this.ENTITY_CLINICAL_TRIAL
    }
  ];

  thisEntity = null;
  entitySelectedForSearch = null;
  entityDisplaySelectedForSearch = null;

  rawFacets: Array<Facet>;
  idListForSearch: Array<String>;
  queryText: string = '';
  entity_link_substances_ids: Array<String> = [];

  isLoading = false;
  isError = false;
  searchOnIdentifiers = false;

  private subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
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
    public applicationService: ApplicationService) { }

  ngOnInit(): void {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  @Input()
  set entity(ent) {
    this.thisEntity = ent;
  }

  @Input()
  set idLists(list: Array<String>) {
    this.idListForSearch = list || [];
  }

  get filteredEntity() {
    // if entity is 'substances', display all the values in the dropdown.
    if (this.thisEntity === this.ENTITY_SUBSTANCE) {
      return this.entityLists.filter(entity => entity.entityValue !== this.thisEntity);
    } else {
      // if entity is non-substance, only display Substance value in the dropdown
      return this.entityLists.filter(entity => entity.entityValue === 'substances');
    }

  }

  entitySelectedChange(event: any): void {
    // Get Entity Display such as Substance, Application, Product, etc
    let entity = this.entityLists.find(entity => entity.entityValue === event.value);
    this.entityDisplaySelectedForSearch = entity.entityDisplay;

    if (event.value === this.ENTITY_SUBSTANCE) {
      this.entitySelectedForSearch = this.ENTITY_SUBSTANCE;

      // Get Substance Facets
     // this.searchSubstances();

     this.createQueryTextWithIds("substances");
     this.postOrPutBulkQuery();

    }
    else if (event.value === this.ENTITY_PRODUCT) {
      this.entitySelectedForSearch = this.ENTITY_PRODUCT;

       // Get Product Facets
       this.bulkQueryCrossEntity();

      //this.getBulkStatus();
    } else if (event.value === this.ENTITY_APPLICATION) {
      this.entitySelectedForSearch = this.ENTITY_APPLICATION;

      // Get Application Facets
      this.getFacetsWithBulkQueryApplication();
    }

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

    this.createQueryTextWithIds("substances");

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
          this.openModalControls();
        }

      });
  }

  getFacetsWithBulkQueryApplication() {
    this.createQueryTextWithIds();

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

  // for facets cross-entity search
  facetsParamsCrossEntityUpdated(facetsUpdateEvent: FacetUpdateEvent): void {
    // this.searchProducts();

  }

  createQueryTextWithIds(entity?: string) {
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

    console.log("QQQQQQQQQQQQQQ " + this.queryText);
  }

  bulkQueryCrossEntity() {
    this.createQueryTextWithIds();

    //let queryText = 'entity_link_substances: \"f2f87acc-d824-4022-888f-b754d0997272\"';
    // This assumes we post/put the query and launch the search FROM the browse page.
    const s1 = this.bulkSearchService.postOrPutBulkQuery(
      // this._bulkQueryIdOnLoad,
      this.thisEntity,
      this.queryText
    )
      .subscribe(bulkQuery => {
        this.isError = false;
        let bulkQID = bulkQuery.id;
        let searchOnIdentifiers = this.searchOnIdentifiers;
        let searchEntity = this.thisEntity;
        //  this._bulkQuery = bulkQuery;
        // this._bulkQueryIdAfterSubmit = bulkQuery.id;
        const navigationExtras: NavigationExtras = {
          queryParams: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            bulkQID: bulkQuery.id,
            searchOnIdentifiers: this.searchOnIdentifiers,
            searchEntity: this.thisEntity
          }
        };

        // Perform BULK SEARCH
        this.bulkSearchProduct(bulkQID, searchOnIdentifiers, searchEntity);

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
        console.log("AAAAAAAAAAAA " + JSON.stringify(pagingResponse.facets));

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

  postOrPutBulkQuery() {
    this.bulkSearchService.postOrPutBulkQuery(this.entitySelectedForSearch, this.queryText).subscribe(result => {
      console.log("QUERY SEARCH" + JSON.stringify(result));
      if (result) {
        if (result.id) {
          this.getBulkSearch(this.entitySelectedForSearch, result.id);
        }
      }
    });
  }

  getBulkSearch(entity: string, bulkQID) {
    this.bulkSearchService.getBulkSearch(entity, bulkQID, false).subscribe(result => {
      if (result) {
        if (result.key) {
          this.bulkSearchService.getBulkSearchStatusResults(result.key, 0, 10, 0, 10).subscribe(searchResult => {
            if (searchResult && searchResult.total > 0) {
              this.rawFacets = searchResult.facets;

              this.openModalControls();
            }
          });
        }
      }
    });
  }

  getBulkStatus() {
    this.bulkSearchService.getBulkSearchStatus('ae67711c7e0ba7993c2fa8f1efa91951f07e09c5').subscribe(result => {
      alert(JSON.stringify(result));

    });
  }

  getBulkSearchStatusResults() {
    this.bulkSearchService.getBulkSearchStatus('ae67711c7e0ba7993c2fa8f1efa91951f07e09c5').subscribe(result => {
    });
  }

  openModalControls() {
    const dialogRef = this.dialog.open(this.crossEntitySearchTemplate, {
      minWidth: '30%',
      maxWidth: '30%',
      disableClose: true // Prevents closing on outside click
    });

    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  closePopup() {
    this.dialog.closeAll();
  }
}
