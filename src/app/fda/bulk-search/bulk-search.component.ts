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
  import { BulkQuery } from './bulk-search.model';

  @Component({
    selector: 'app-bulk-search',
    templateUrl: './bulk-search.component.html',
    styleUrls: ['./bulk-search.component.scss']
  })
  
  export class BulkSearchComponent implements OnInit, OnDestroy {
    loadedComponents: LoadedComponents;
    advancedSearchFacetDisplay = false;
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


    queryableSubstanceDict: QueryableSubstanceDictionary;
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
    private searchType: string;
    private searchEntity: string;
    _searchtype: string;
    _searchentity: string;
    searchTypeControl = new FormControl();
    searchEntityControl = new FormControl();

    @ViewChild('contentContainer', { static: true }) contentContainer;
    private overlayContainer: HTMLElement;
  
    constructor(
      private loadingService: LoadingService,
      public authService: AuthService,
      private notificationService: MainNotificationService,
      private bulkSearchService: BulkSearchService,      
      private configService: ConfigService
    ) {
      this.searchType = 'identifiers';
      this._searchtype = 'identifiers';
      this.searchEntity = 'substances';
      this._searchentity = 'substances';
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


postBulkQuery() {
    this.loadingService.setLoading(true);
    const subscription = this.bulkSearchService.postBulkQuery(
      this.context,
      this.queryText
    )
      .subscribe(bulkQuery => {
        this.isError = false;
        this._bulkQuery = bulkQuery;  
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

  makeOrSearch(field: string){
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

    /*
    showTextInputDialog() {
        if (this.authService.getUser() !== '') {
          const text = 'hello';
          const dialogReference = this.dialog.open(TextInputDialogComponent, {
            height: '215x',
            width: '550px',
            data: { 'text': text }
          });
          const showTextInputDialogSub = dialogReference.afterClosed().subscribe(query => {
            if (query && query !== '') {
              const navigationExtras = {
                queryParams: {'search': query}
              };           
              this.router.navigate(['/browse-substance'], navigationExtras);        }
          });
        } else {
          //this.disableExport = true;
        }
      }
 */   
 
  }
  