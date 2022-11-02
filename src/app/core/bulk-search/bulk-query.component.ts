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
  searchEntityControl = new FormControl();
  queryEntities: any;
  private subscriptions: Array<Subscription> = [];
  private searchEntity: string;

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
    this.setSearchEntity('substances');
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
  this.postOrPutBulkQueryAndNavigateToBrowse();
}

  bulkSearchSubmit(): void {
    const eventLabel = 'Bulk search submit `${this.searchEntity}`';
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
      if(params.searchOnIdentifiers && params.searchOnIdentifiers === "false") { 
        this.searchOnIdentifiers = false;
      } else {
        this.searchOnIdentifiers = true;
      }
      this.setSearchEntity(params.searchEntity);
      const observables: Array<Observable<BulkQuery>> = [];
      const texts: string[] = [];
          // Part B: load queries terms
          subscriptions[1] = this.bulkSearchService.getBulkQuery(
            this.searchEntity,
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
                    .getBulkQuery(this.searchEntity, this._bulkQueryIdOnLoad, top, skip);
                  observables.push(observable);
                  const s = observable.subscribe((bulkQuery1) => {
                    texts.push(bulkQuery1.queries.join('\n'));
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


  postOrPutBulkQueryAndNavigateToBrowse() {
    // This assumes we post/put the query and launch the search FROM the browse page. 
    this.loadingService.setLoading(true);
    const s1 = this.bulkSearchService.postOrPutBulkQuery(
      // this._bulkQueryIdOnLoad,      
      this.searchEntity,
      this.queryText
    )
    .subscribe(bulkQuery => {
      this.isError = false;
      this._bulkQuery = bulkQuery;
      this._bulkQueryIdAfterSubmit = bulkQuery.id;
      const navigationExtras: NavigationExtras = {
        queryParams: {
          // eslint-disable-next-line @typescript-eslint/naming-convention
          bulkQID: this._bulkQueryIdAfterSubmit,
          searchOnIdentifiers: this.searchOnIdentifiers,
          searchEntity: this.searchEntity
        }
      };
      this.router.navigate(['/browse-substance'], navigationExtras);
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

  setSearchEntity(value: string) {
    this.searchEntity = value;
    this.searchEntityControl.setValue(value);
  }

  searchEntitySelected($event) {
    this.setSearchEntity($event.value);
  }

}
