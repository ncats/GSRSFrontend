import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApplicationService } from '../service/application.service';
import { ApplicationSrs } from '../model/application.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
import * as _ from 'lodash';
import { Facet, FacetsManagerService, FacetUpdateEvent } from '@gsrs-core/facets-manager';
import { LoadingService } from '@gsrs-core/loading';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { PageEvent } from '@angular/material';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { Location, LocationStrategy } from '@angular/common';
import { GoogleAnalyticsService } from '../../../../app/core/google-analytics/google-analytics.service';
import { FacetParam } from '@gsrs-core/facets-manager';
import { Environment } from 'src/environments/environment.model';
import { Subscription, Observable, Subject } from 'rxjs';
import { take, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';


@Component({
  selector: 'app-applications-browse',
  templateUrl: './applications-browse.component.html',
  styleUrls: ['./applications-browse.component.scss']
})
export class ApplicationsBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  private privateSearchTerm?: string;
  public _searchTerm?: string;
  public applications: Array<ApplicationSrs>;
  // view = 'cards';
  hasBackdrop = false;
  pageIndex: number;
  pageSize: number;
  jumpToValue: string;
  totalApplications: number;
  isLoading = true;
  isError = false;
  isAdmin: boolean;
  displayedColumns: string[];
  dataSource = [];
  appType: string;
  appNumber: string;
  clinicalTrialApplication: Array<any>;
  environment: Environment;
  exportUrl: string;
  private isComponentInit = false;

  // needed for facets
  private privateFacetParams: FacetParam;
  rawFacets: Array<Facet>;
  private isFacetsParamsInit = false;

  constructor(
    public applicationService: ApplicationService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private router: Router,
    private sanitizer: DomSanitizer,
    public gaService: GoogleAnalyticsService,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    private authService: AuthService,
    // private overlayContainerService: OverlayContainer,
    private facetManagerService: FacetsManagerService
  ) {}

  ngOnInit() {
    this.facetManagerService.registerGetFacetsHandler(this.applicationService.getApplicationFacets);
    this.environment = this.configService.environment;
    this.gaService.sendPageView('Browse Applications');
    this.pageSize = 10;
    this.pageIndex = 0;
    this._searchTerm = '';

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['searchTerm'] = this.activatedRoute.snapshot.queryParams['searchTerm'] || '';
    navigationExtras.queryParams['order'] = this.activatedRoute.snapshot.queryParams['order'] || '';
    navigationExtras.queryParams['pageSize'] = this.activatedRoute.snapshot.queryParams['pageSize'] || '10';
    navigationExtras.queryParams['pageIndex'] = this.activatedRoute.snapshot.queryParams['pageIndex'] || '0';
    navigationExtras.queryParams['skip'] = this.activatedRoute.snapshot.queryParams['skip'] || '10';
    this.location.replaceState(
      this.router.createUrlTree(
        [this.locationStrategy.path().split('?')[0].replace(this.environment.baseHref, '')],
        navigationExtras
      ).toString()
    );

    this.activatedRoute.queryParamMap.subscribe(params => {

      this.privateSearchTerm = params.get('search') || '';

      if (params.get('pageSize')) {
        this.pageSize = parseInt(params.get('pageSize'), null);
      }
      if (params.get('pageIndex')) {
        this.pageIndex = parseInt(params.get('pageIndex'), null);
      }

      this.isComponentInit = true;
      this.loadComponent();
    });

    this.isAdmin = this.authService.hasAnyRoles('Admin', 'Updater', 'SuperUpdater');
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.facetManagerService.unregisterFacetSearchHandler();
  }

  private loadComponent(): void {
    if (this.isFacetsParamsInit && this.isComponentInit) {
      this.searchApplications();
    }
  }

  changePage(pageEvent: PageEvent) {

    let eventAction;
    let eventValue;

    if (this.pageSize !== pageEvent.pageSize) {
      eventAction = 'select:page-size';
      eventValue = pageEvent.pageSize;
    } else if (this.pageIndex !== pageEvent.pageIndex) {
      eventAction = 'icon-button:page-number';
      eventValue = pageEvent.pageIndex + 1;
    }

    this.gaService.sendEvent('applicationsContent', eventAction, 'pager', eventValue);

    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.populateUrlQueryParameters();
  }

  // for facets
  facetsParamsUpdated(facetsUpdateEvent: FacetUpdateEvent): void {
    this.pageIndex = 0;
    this.privateFacetParams = facetsUpdateEvent.facetParam;
    if (!this.isFacetsParamsInit) {
      this.isFacetsParamsInit = true;
      this.loadComponent();
    } else {
      this.searchApplications();
    }
  }

  // for facets
  facetsLoaded(numFacetsLoaded: number) {
  }

  searchApplications() {
    this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    this.applicationService.getApplications(
      skip,
      this.pageSize,
      this._searchTerm,
      this.privateFacetParams,
    )
      .subscribe(pagingResponse => {
        this.isError = false;
        this.applications = pagingResponse.content;
        // didn't work unless I did it like this instead of
        // below export statement
        this.dataSource = this.applications;
        this.totalApplications = pagingResponse.total;
        // Export Application Url
        this.exportUrl = this.applicationService.exportBrowseApplicationsUrl(
          skip,
          this.pageSize,
          this._searchTerm,
          this.privateFacetParams);
        this.getSubstanceDetailsByBdnum();

        // this.applicationService.getClinicalTrialApplication(this.applications);
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.rawFacets = pagingResponse.facets;
        }
      }, error => {
        console.log('error');
        const notification: AppNotification = {
          message: 'There was an error trying to retrieve Applicationss. Please refresh and try again.',
          type: NotificationType.error,
          milisecondsToShow: 6000
        };
        this.isError = true;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
      }, () => {
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      });
    this.populateUrlQueryParameters();
  }


  setSearchTermValue() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this._searchTerm = this._searchTerm.trim();
    this.searchApplications();
  }

  populateUrlQueryParameters(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };
    navigationExtras.queryParams['searchTerm'] = this.privateSearchTerm;
    navigationExtras.queryParams['pageSize'] = this.pageSize;
    navigationExtras.queryParams['pageIndex'] = this.pageIndex;
    navigationExtras.queryParams['skip'] = this.pageIndex * this.pageSize;

    this.router.navigate(
      [],
      navigationExtras
    );
  }

  get searchTerm(): string {
    return this.privateSearchTerm;
  }

  // get facetParams(): { [facetName: string]: { [facetValueLabel: string]: boolean } } {
  //   return this._facetParams;
  //  }

  get facetParams(): FacetParam | { showAllMatchOption?: boolean } {
    return this.privateFacetParams;
  }

  getSubstanceDetailsByBdnum(): void {
    let bdnumName: any;
    let relationship: any;
    let substanceId: string;

    this.applications.forEach((element, index) => {

      element.applicationProductList.forEach((elementProd, indexProd) => {

        elementProd.applicationIngredientList.forEach((elementIngred, indexIngred) => {

          // Get Substance Details such as Name, Substance Id, unii
          if (elementIngred.bdnum != null) {

            this.applicationService.getSubstanceDetailsByBdnum(elementIngred.bdnum).subscribe(response => {
              bdnumName = response;
              if (bdnumName != null) {
                if (bdnumName.name != null) {
                  elementIngred.ingredientName = bdnumName.name;

                  if (bdnumName.substanceId != null) {
                    substanceId = bdnumName.substanceId;
                    elementIngred.substanceId = substanceId;

                    // Get Active Moiety - Relationship
                    this.applicationService.getSubstanceRelationship(substanceId).subscribe(responseRel => {
                      relationship = responseRel;
                      relationship.forEach((elementRel, indexRel) => {
                        if (elementRel.relationshipName != null) {
                          elementIngred.activeMoietyName = elementRel.relationshipName;
                          elementIngred.activeMoietyUnii = elementRel.relationshipUnii;
                        }
                      });

                    });

                  }
                }
              }
            });

          }
        });

      });

    });

  }

  exportBrowseApplicationsUrl() {
    // this.exportUrl = this.applicationService.exportBrowseApplicationsUrl();
  }

  get updateApplicationUrl(): string {
    return this.applicationService.getUpdateApplicationUrl();
  }

  // appType: string, appNumber: string
  /*
  getClinicalTrialApplication() {
    let clinicalTrial: Array<any> = [];
    let app: any;

    console.log('clinical');
    this.applications.forEach((element, index) => {
      //app = element;
      this.applicationService.getClinicalTrialApplication(element.appType, element.appNumber).subscribe(response => {
        clinicalTrial = response;
        //element.clinicalTrialList = response;

        clinicalTrial.forEach(element1 => {
          if (element1.nctn != null) {
            element.clinicalTrialList[0].nctNumber = element1.nctn;
          }

          console.log("NCT length: " + clinicalTrial.length);
        });


        });

      });
    }
*/
}
