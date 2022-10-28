import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { NavigationExtras,ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { ConfigService, LoadedComponents } from '@gsrs-core/config';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { LoadingService } from '@gsrs-core/loading';
import { AuthService } from '../../core/auth/auth.service';
import { BulkSearchService } from './service/bulk-search.service';
import { BulkSearch } from './bulk-search.model';

  @Component({
    selector: 'app-bulk-search',
    templateUrl: './bulk-search.component.html',
    styleUrls: ['./bulk-search.component.scss']
  })
  export class BulkSearchComponent implements OnInit, OnDestroy {
    loadedComponents: LoadedComponents;
    showAudit: boolean;
    isAdmin = false;
    isLoggedIn = false;
    showDeprecated = false;
    queryText: string;
    context: string = 'substances';
    _bulkSearch: BulkSearch;  
    _bulkSearchResults: any;
    bulkQID: number;
    searchOnIdentifiers: boolean;
    bulkSearchResultsTop: number = 10;
    bulkSearchResultsSkip: number = 0;
    bulkSearchResultsQTop: number = 10;
    bulkSearchResultsQSkip: number = 0;
    isError = false;
    isLoading = false;
    anchorElement: HTMLAnchorElement;
    showSpinner = false;
    JSON: any; 
    
    private subscriptions: Array<Subscription> = [];
    navigationExtrasFacet: NavigationExtras = {
      queryParams: {}
    };  
    private searchType: string;
    private searchEntity: string;
  
    constructor(
      private loadingService: LoadingService,
      public authService: AuthService,
      private notificationService: MainNotificationService,
      private bulkSearchService: BulkSearchService,      
      private configService: ConfigService,
      private route: ActivatedRoute
    ) {
      this.JSON = JSON;
    }
  
    ngOnInit() {

      this.loadingService.setLoading(true);
      this.showSpinner = true;  // Start progress spinner
  
      // Get configration values to hide/show Modules
      this.loadedComponents = this.configService.configData.loadedComponents || null;
  
      if (this.loadedComponents) {
        if (this.loadedComponents.applications) {
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

      const s1 = this.route.queryParams.subscribe(params => {
        // this.loadingService.setLoading(true);   
         // this.isError = false;    
         this.bulkQID = params.bulkQID;
         const subscription = this.bulkSearchService.getBulkSearch(
          this.context,
          this.bulkQID,
          this.searchOnIdentifiers
        ).subscribe(bulkSearch => {
            this._bulkSearch = bulkSearch;
            const subscription = this.bulkSearchService.getBulkSearchStatusResults(
              this._bulkSearch.key,
              this.bulkSearchResultsTop,
              this.bulkSearchResultsSkip,
              this.bulkSearchResultsQTop,
              this.bulkSearchResultsQSkip
            ).subscribe(bulkSearchResults => {
              this._bulkSearchResults = bulkSearchResults;
            });
          })      
    }
    );
    }
/*
,
    error => {
      const notification: AppNotification = {
        message: 'There was an error trying to get a bulk search results.',
        type: NotificationType.error,
        milisecondsToShow: 6000
      };
      this.isError = true;
      this.isLoading = false;
      this.loadingService.setLoading(this.isLoading);
      this.notificationService.setNotification(notification);
    },
    () => {
      this.isLoading = false;
      this.loadingService.setLoading(this.isLoading);
    }

*/
   
   
   
    ngOnDestroy() {
      this.subscriptions.forEach(subscription => {
        if (subscription) {
          subscription.unsubscribe();
        }
      });
    }
 
    



    getBulkSearch(context: string, id: number) {
      this.loadingService.setLoading(true); 
      const subscription = this.bulkSearchService.getBulkSearch(
        context,
        id
      )
        .subscribe(bulkSearch => {
          this.isError = false;
          this._bulkSearch = bulkSearch;
        }, error => {
          const notification: AppNotification = {
            message: 'There was an error trying to get a bulk search result.',
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

    getBulkSearchStatusResults(
      key: string, 
      top: number,
      skip: number,
      qTop: number,
      qSkip: number
    ) {
      this.loadingService.setLoading(true); 
      const subscription = this.bulkSearchService.getBulkSearchStatusResults(
        key,
        top,
        skip,
        qTop,
        qSkip
      )
        .subscribe(bulkSearchResults => {
          this.isError = false;
          this._bulkSearchResults = bulkSearchResults;
          console.log("this._bulkSearchResults");
          
          console.log(this._bulkSearchResults);

        }, error => {
          const notification: AppNotification = {
            message: 'There was an error trying to get a bulk search results.',
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



  }
  