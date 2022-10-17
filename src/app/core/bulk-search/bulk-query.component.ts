import {
    Component,
    OnInit,
    OnDestroy,
    ViewChild,
  } from '@angular/core';
  import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
  import { FormControl } from '@angular/forms';
  import { Subscription } from 'rxjs';
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
    context: string = 'substances';
    _bulkQuery: BulkQuery;
    _bulkQueryIdAfterSubmit: number;  
    _bulkQueryIdOnLoad: number;  
    _bulkSearch: BulkSearch;
    _bulkSearchResults: any;
    _bulkSearchResultKey: string;

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

    @ViewChild(TextInputFormComponent, {static:true}) textInputForm: TextInputFormComponent;

    showSpinner = false;
    private subscriptions: Array<Subscription> = [];
    navigationExtrasFacet: NavigationExtras = {
      queryParams: {}
    };  
    private queryType: string;
    private queryEntity: string;
    queryTypeControl = new FormControl();
    queryEntityControl = new FormControl();
  
    constructor(
      private loadingService: LoadingService,
      public authService: AuthService,
      private notificationService: MainNotificationService,
      private bulkSearchService: BulkSearchService,      
      private configService: ConfigService,
      private route: ActivatedRoute,
      private router: Router
    ) {
      this.queryType = 'identifiers';
      this.queryEntity = 'substances';
    }
  
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

      const authSubscription = this.authService.getAuth().subscribe(auth => {
        if (auth) {
          this.isLoggedIn = true;
        } else {
          this.showDeprecated = false;
        }
        this.isAdmin = this.authService.hasAnyRoles('Updater', 'SuperUpdater');
        this.showAudit = this.authService.hasRoles('admin');  
      });

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
      // this.postBulkQuery();
      this.postBulkQueryAndGetBulkSearchResultKeyAndNavigateToBrowse()
  }

  bulkSearchSubmit(): void {
    const eventLabel = 'Bulk search submit `${this.queryEntity}`';
    // this.gaService.sendEvent('Application Filtering', 'icon-button:bulk-search-submit', eventLabel);
  }

  checkBulkQueryIdParameterOnLoad() { 
    const s1 = this.route.queryParams.subscribe(params => {
      this._bulkQueryIdOnLoad = params.bulkQID;
      if(this._bulkQueryIdOnLoad != undefined) {
        const s2 = this.bulkSearchService.getBulkQuery(this.context, this._bulkQueryIdOnLoad)
        .subscribe(bulkQuery => {
          if(bulkQuery.queries) {
            console.log("awd check bulk query param");
            console.log(bulkQuery.queries);

            this.textInputForm.textControl.setValue(this._.join(bulkQuery.queries, "\n"));
          }
        },
        error => {
          console.log("Error getting bulk query on load with bulkQID " + this._bulkQueryIdOnLoad);
        },
        () => {
          s2.unsubscribe();
        })
      }
    },
    error => {
      console.log("Error checking for bulk query id parameter on load.")  
    },
    () => {
      s1.unsubscribe();
    });
  }

  postBulkQueryAndGetBulkSearchResultKeyAndNavigateToBrowse() {
    this.loadingService.setLoading(true);
    const s1 = this.bulkSearchService.postBulkQuery(
      this.context,
      this.queryText
    )
    .subscribe(bulkQuery => {
      this.isError = false;
      this._bulkQuery = bulkQuery;
      this._bulkQueryIdAfterSubmit = bulkQuery.id;
      const s2 = this.bulkSearchService
        .getBulkSearch(this.context, this._bulkQueryIdAfterSubmit).subscribe(bulkSearch => {
        this._bulkSearch = bulkSearch;
        this._bulkSearchResultKey = this._bulkSearch.key;
        // console.log("here abc qid: " + this._bulkQueryIdAfterSubmit);
        // console.log("here abc key: " + this._bulkSearchResultKey);
        const navigationExtras: NavigationExtras = {
          queryParams: {
            'bulk_search': this._bulkSearchResultKey,
            'bulkQID': this._bulkQueryIdAfterSubmit,
          }
        };
        this.router.navigate(['/browse-substance'], navigationExtras);
      }, error => {
        console.log("Error posting bulk search and getting bulk search result key.");
      }, () => {
          s2.unsubscribe();
      })
    }, error => {
      console.log("Error trying to post a bulk query.");
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

  makeOrQuery(field: string){
      const text = this.textInputForm.textControl.value;
      console.log("text");
      
      console.log(text);

      let a:Array<string> = [];
      let b:Array<string> = [];
      let query = "";
      alert(text);
      const re1 = new RegExp(/\n/);
      const re2 = new RegExp(/^\s*$/);
      if(text) {
        query = text.split(re1).map(function(element) {
          if(!re2.test(element)) {
            return field + ':"^' +  element +'$"';          
          } else { 
            return '';
          }
        }).filter(x => typeof x === 'string' && x.length > 0).join(' OR ');
        console.log("QUERY: "+ query);
      }
      return query;
    }

    queryTypeSelected($event) { 
    }

    queryEntitySelected($event) { 
    }

/*

postBulkQuery() {
    this.loadingService.setLoading(true);
    const subscription = this.bulkSearchService.postBulkQuery(
      this.context,
      this.queryText
    )
      .subscribe(bulkQuery => {
        this.isError = false;
        this._bulkQuery = bulkQuery;
        const navigationExtras: NavigationExtras = {
          queryParams: {'bulkQID': bulkQuery.id}
        };
        this.router.navigate(['/bulk-search-results'], navigationExtras);
      }, error => {
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
        subscription.unsubscribe();
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      });
  }
*/


  }
  