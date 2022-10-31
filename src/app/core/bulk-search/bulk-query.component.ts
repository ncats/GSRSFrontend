import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subscription, Observable } from 'rxjs';
import { ConfigService, LoadedComponents } from '@gsrs-core/config';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { LoadingService } from '@gsrs-core/loading';
import { TextInputFormComponent } from '@gsrs-core/utils/text-input-form/text-input-form.component';
import { AuthService } from '../../core/auth/auth.service';
import { BulkSearchService } from './service/bulk-search.service';
import { BulkQuery } from './bulk-query.model';
import { BulkSearch } from './bulk-search.model';
import * as lodash from 'lodash';

  @Component({
    selector: 'app-bulk-query',
    templateUrl: './bulk-query.component.html',
    styleUrls: ['./bulk-query.component.scss']
  })

export class BulkQueryComponent implements OnInit, OnDestroy {
  _ = lodash;
  loadedComponents: LoadedComponents;
  showAudit: boolean;
  isAdmin = false;
  isLoggedIn = false;
  showDeprecated = false;
  queryText: string;
  _bulkQuery: BulkQuery;
  _bulkQueryIdAfterSubmit: number;
  _bulkQueryIdOnLoad: number;
  _bulkSearchIdOnLoad: number;
  _bulkSearchKeyOnLoad: string;
  _bulkSearch: BulkSearch;
  _bulkSearchResults: any;
  _bulkSearchResultKey: string;
  searchOnIdentifiers: boolean = true;
  query: string;
  isError = false;
  isLoading = false;
  displayProperties: Array<string>;
  displayPropertiesCommon: Array<string>;
  facetViewControl = new FormControl();
  structureEditor: string;
  anchorElement: HTMLAnchorElement;
  smiles: string;
  mol: string;
  height = 0;
  width = 0;
  textInputFormPlaceholder = 'ASPIRIN\n50-00-0\nroot_names_name:\"^parsley\$"\nR6Q3791S76\n1cf410f9-3eeb-41ed-ab69-eeb5076901e5\n';
  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(TextInputFormComponent, {static:true}) textInputForm: TextInputFormComponent;

  showSpinner = false;
  navigationExtrasFacet: NavigationExtras = {
    queryParams: {}
  };
  queryEntityControl = new FormControl();
  queryEntities: any;
  private subscriptions: Array<Subscription> = [];
  private queryEntity: string;

  constructor(
    private loadingService: LoadingService,
    public authService: AuthService,
    private notificationService: MainNotificationService,
    private bulkSearchService: BulkSearchService,
    private configService: ConfigService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {

    this.loadingService.setLoading(true);
    this.showSpinner = true;  // Start progress spinner

    // Get configration values to hide/show Modules
    // this.loadedComponents = this.configService.configData.loadedComponents || null;
    // if (this.loadedComponents) {
    //  if (this.loadedComponents.applications) {
    //  }
    // }

    this.showSpinner = false;  // Stop progress spinner
    this.loadingService.setLoading(false);
    const bsConfig = this.configService.configData.bulkSearch;
    this.queryEntities = bsConfig.entities;
    if (!this.queryEntities) {
//      this.queryEntities = {name: 'substances', title: 'Substances'};
    }
    const authSubscription = this.authService.getAuth().subscribe(auth => {
      if (auth) {
        this.isLoggedIn = true;
      } else {
        this.showDeprecated = false;
      }
      this.isAdmin = this.authService.hasAnyRoles('Updater', 'SuperUpdater');
      this.showAudit = this.authService.hasRoles('admin');
    });
    this.setQueryEntity('substances');
    this.checkBulkQueryIdParameterOnLoad();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

submitText() {
    this.queryText = this.textInputForm.textControl.value;
    this.postBulkQueryAndGetBulkSearchResultKeyAndNavigateToBrowse();
}

  bulkSearchSubmit(): void {
    const eventLabel = 'Bulk search submit `${this.queryEntity}`';
    // this.gaService.sendEvent('Application Filtering', 'icon-button:bulk-search-submit', eventLabel);
  }

  checkBulkQueryIdParameterOnLoad() {
    // We need to get the query id from the URL query parameter, then extract the queries
    // from the response. Queries come back as array, The number query terms in the
    // array is determined by `top`, so we may need to process multiple responses to get
    // the full list of queries for editing in the textarea.
    const top = 10000;
    let skip = 0;
    const subscriptions = [];

    // Part A: get url query param values
    subscriptions[0] = this.route.queryParams.subscribe(params => {
      this._bulkQueryIdOnLoad = params.bulkQID;
      this._bulkSearchKeyOnLoad = params.bulkSearchKey;
      const observables: Array<Observable<BulkQuery>> = [];
      const texts: string[] = [];

      // Part B: get status for context and searchOnIdentifiers
      subscriptions[1] = this.bulkSearchService.getBulkSearchStatus(
        this._bulkSearchKeyOnLoad
      ).subscribe( response => {
        this.setQueryEntity(response.context);
        this.searchOnIdentifiers = this.checkSearchOnIdentifiers(response.generatingUrl);

          // Get the first reponse so we know the values for top, skip, total.
          // Then loop through the rest of the reponses and store in order in the texts array.
          // However, the looping part does not work as expected perhaps due asyncronousity,
          // so instead I am for now setting top to 10000.

          // Part C: load queries terms
          subscriptions[1] = this.bulkSearchService.getBulkQuery(
            this.queryEntity,
            this._bulkQueryIdOnLoad,
            top,
            skip
          )
          .subscribe((bulkQuery) => {
            if(bulkQuery.queries) {
              texts.push(bulkQuery.queries.join('\n'));
              const left =  bulkQuery.total - bulkQuery.count;
              // Turning this off and using big top value for now.
              const off = true;
              if(!off && left>0) {
                const x = Math.floor(left/top);
                for (let i = 1; i <= x; i++) {
                  skip = skip + top;
                  const observable = this.bulkSearchService
                    .getBulkQuery(this.queryEntity, this._bulkQueryIdOnLoad, top, skip);
                  observables.push(observable);
                  const s = observable.subscribe((bulkQuery1) => {
                    texts.push(bulkQuery1.queries.join('\n'));
                    console.log(bulkQuery1.queries);
                    subscriptions.push(s);
                  });
                }
              }
            }
          },
          (error) => {
            console.log( 'Error getting bulk search status results data.');
          },
          () => {
            // completed
            // Join all values in the texts array and insert into form text area.
            this.textInputForm.textControl.setValue(texts.join(''));
          });
          // Part C End
      },
      error => {
        console.log('Error getting bulk search status data.');
      });
      // Part B End
    },
    () => {
      subscriptions.forEach(
        (o) => {
          o.unsubscribe();
        });
    });
    // Part A (Params) end)
  }

  checkSearchOnIdentifiers(url: string): boolean {
    if(url && url.indexOf('searchOnIdentifiers=true')>-1) {
      return true;
    } else {
      return false;
    }
  }

  postBulkQueryAndGetBulkSearchResultKeyAndNavigateToBrowse() {
    this.loadingService.setLoading(true);
    const s1 = this.bulkSearchService.postBulkQuery(
      this.queryEntity,
      this.queryText
    )
    .subscribe(bulkQuery => {
      this.isError = false;
      this._bulkQuery = bulkQuery;
      this._bulkQueryIdAfterSubmit = bulkQuery.id;
      const s2 = this.bulkSearchService
        .getBulkSearch(this.queryEntity, this._bulkQueryIdAfterSubmit, this.searchOnIdentifiers).subscribe(bulkSearch => {
        this._bulkSearch = bulkSearch;
        this._bulkSearchResultKey = this._bulkSearch.key;
        const navigationExtras: NavigationExtras = {
          queryParams: {
            // eslint-disable-next-line @typescript-eslint/naming-convention
            bulk_search: this._bulkSearchResultKey,
            bulkQID: this._bulkQueryIdAfterSubmit,
          }
        };
        this.router.navigate(['/browse-substance'], navigationExtras);
      }, error => {
        console.log('Error posting bulk search and getting bulk search result key.');
      }, () => {
          s2.unsubscribe();
      });
    }, error => {
      console.log('Error trying to post a bulk query.');
      const notification: AppNotification = {
        message: 'Error trying to post a bulk query.',
        type: NotificationType.error,
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

  setQueryEntity(value: string) {
    this.queryEntity = value;
    this.queryEntityControl.setValue(value);
  }

  queryEntitySelected($event) {
    this.setQueryEntity($event.value);
  }

}
