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
  import { QueryableSubstanceDictionary } from '@gsrs-core/guided-search/queryable-substance-dictionary.model';
  import { LoadingService } from '@gsrs-core/loading';
  import { TextInputFormComponent } from '@gsrs-core/utils/text-input-form/text-input-form.component';
  import { AuthService } from '../../core/auth/auth.service';
  import { BulkSearchService } from './service/bulk-search.service';
  import { BulkQuery } from './bulk-query.model';
  import { BulkSearch } from './bulk-search.model';
  import { environment } from '@environment/environment';
  

  @Component({
    selector: 'app-bulk-query',
    templateUrl: './bulk-query.component.html',
    styleUrls: ['./bulk-query.component.scss']
  })
  
  export class BulkQueryComponent implements OnInit, OnDestroy {
    loadedComponents: LoadedComponents;
    showAudit: boolean;
    isAdmin = false;
    isLoggedIn = false;
    showDeprecated = false;
    queryText: string;
    context: string = 'substances';
    _bulkQuery: BulkQuery;  
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
    _querytype: string;
    _queryentity: string;
    queryTypeControl = new FormControl();
    queryEntityControl = new FormControl();

    @ViewChild('contentContainer', { static: true }) contentContainer;
    private overlayContainer: HTMLElement;
  
    constructor(
      private loadingService: LoadingService,
      public authService: AuthService,
      private notificationService: MainNotificationService,
      private bulkSearchService: BulkSearchService,      
      private configService: ConfigService,
      private router: Router
    ) {
      this.queryType = 'identifiers';
      this._querytype = 'identifiers';
      this.queryEntity = 'substances';
      this._queryentity = 'substances';
    }
  
    ngOnInit() {

      this.loadingService.setLoading(true);
      this.showSpinner = true;  // Start progress spinner
  
      // Get configration values to hide/show Modules
      this.loadedComponents = this.configService.configData.loadedComponents || null;
  
      if (this.loadedComponents) {
        if (this.loadedComponents.applications) {
          // this.getBrowseApplicationDetails();
        }
      }  
  
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
    this.postBulkQuery();


 }

 bulkSearchSubmit(): void {
  const eventLabel = 'Bulk search submit `${this.queryEntity}`';
  // this.gaService.sendEvent('Application Filtering', 'icon-button:bulk-search-submit', eventLabel);

}

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
          message: 'There was an error trying to post a bulk query.',
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


  }
  