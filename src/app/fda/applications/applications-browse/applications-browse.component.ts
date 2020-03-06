import { Component, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApplicationService } from '../service/application.service';
import { ApplicationSrs } from '../model/application.model';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
import * as _ from 'lodash';
import { Facet } from '@gsrs-core/utils';
import { LoadingService } from '@gsrs-core/loading';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { PageEvent } from '@angular/material';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { Location, LocationStrategy } from '@angular/common';
import { GoogleAnalyticsService } from '../../../../app/core/google-analytics/google-analytics.service';
import { SubstanceFacetParam } from '../../../core/substance/substance-facet-param.model';
import { Environment } from '@environment';
import { Subscription, Observable, Subject } from 'rxjs';
import { take, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';


@Component({
  selector: 'app-applications-browse',
  templateUrl: './applications-browse.component.html',
  styleUrls: ['./applications-browse.component.scss']
})
export class ApplicationsBrowseComponent implements OnInit, AfterViewInit {
  private privateSearchTerm?: string;
  public _searchTerm?: string;
  public applications: Array<ApplicationSrs>;
  public facets: Array<Facet> = [];
  private privateFacetParams: SubstanceFacetParam;
  private _facetParams: { [facetName: string]: { [facetValueLabel: string]: boolean } } = {};
  // view = 'cards';
  hasBackdrop = false;
  facetString: string;
  pageIndex: number;
  pageSize: number;
  jumpToValue: string;
  totalApplications: number;
  isLoading = true;
  isError = false;
  isAdmin: boolean;
  displayedColumns: string[];
  dataSource = [];
  public facetBuilder: SubstanceFacetParam;
  appType: string;
  appNumber: string;
  clinicalTrialApplication: Array<any>;
  environment: Environment;

  //  public order: string;
  // public sortValues = searchSortValues;
  // showAudit: boolean;
  // public facetBuilder: SubstanceFacetParam;
  searchText: { [faceName: string]: { value: string, isLoading: boolean } } = {};
  // private overlayContainer: HTMLElement;
  private facetSearchChanged = new Subject<{ index: number, query: any}>();
  private activeSearchedFaced: Facet;

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
  ) {
    this.privateFacetParams = {};
    this.facetBuilder = {};
  }

  ngOnInit() {
    this.environment = this.configService.environment;
    this.gaService.sendPageView('Browse Applications');
    this.pageSize = 10;
    this.pageIndex = 0;
    this._searchTerm = '';
    /*this.facets = [];*/

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['searchTerm'] = this.activatedRoute.snapshot.queryParams['searchTerm'] || '';
    navigationExtras.queryParams['order'] = this.activatedRoute.snapshot.queryParams['order'] || '';
    navigationExtras.queryParams['pageSize'] = this.activatedRoute.snapshot.queryParams['pageSize'] || '10';
    navigationExtras.queryParams['pageIndex'] = this.activatedRoute.snapshot.queryParams['pageIndex'] || '0';
    navigationExtras.queryParams['facets'] = this.activatedRoute.snapshot.queryParams['facets'] || '';
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
      this.facetString = params.get('facets') || '';
      this.facetsFromParams();

      this.searchApplications();
    });

    this.isAdmin = this.authService.hasAnyRoles('Admin', 'Updater', 'SuperUpdater');

    this.facetSearchChanged.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(event => {
        const facet = this.facets[event.index];
        if (event.query.length > 0) {
          const processed = facet.name.replace(' ', '+');
          return this.applicationService.filterFacets(event.query, processed).pipe(take(1));
        } else {
          return this.applicationService.retrieveFacetValues(facet).pipe(take(1));
        }
      })
    ).subscribe(response => {
      this.activeSearchedFaced.values = this.activeSearchedFaced.values.filter(value => {
        let removeFacet = true;

        let isInSearhResults = false;

        for (let i = 0; i < response.content.length; i++) {
          if (response.content[i].label === value.label) {
            isInSearhResults = true;
            break;
          }
        }

        if (!isInSearhResults
          && this.facetParams[this.activeSearchedFaced.name] != null
          && (this.facetParams[this.activeSearchedFaced.name].params[value.label] === true
            || this.facetParams[this.activeSearchedFaced.name].params[value.label] === false)) {
              removeFacet = false;
            }

        return !removeFacet;
      });
      this.activeSearchedFaced.values = this.activeSearchedFaced.values.concat(response.content);
      this.searchText[this.activeSearchedFaced.name].isLoading = false;
    }, error => {
      this.searchText[this.activeSearchedFaced.name].isLoading = false;
    });
  }

  ngAfterViewInit() {
  }

  facetsFromParams() {
    if (this.facetString !== '') {
      const categoryArray = this.facetString.split(',');
      for (let i = 0; i < (categoryArray.length); i++) {
        const categorySplit = categoryArray[i].split('*');
        const category = categorySplit[0];
        const fieldsArr = categorySplit[1].split('+');
        const params: { [facetValueLabel: string]: boolean } = {};
        let hasSelections = false;
        for (let j = 0; j < fieldsArr.length; j++) {
          const field = fieldsArr[j].split('.');
          if (field[1] === 'true') {
            params[field[0]] = true;
            hasSelections = true;
          } else if (field[1] === 'false') {
            params[field[0]] = false;
            hasSelections = true;
          }
        }
        if (hasSelections === true) {
          this.facetBuilder[category] = { 'params': params, hasSelections: true, isAllMatch: false };
        }
      }
      this.privateFacetParams = this.facetBuilder;
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
        this.facets = [];

        this.getSubstanceDetailsByBdnum();

        // this.applicationService.getClinicalTrialApplication(this.applications);
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.populateFacets(pagingResponse.facets);
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

  updateFacetSelection(
    event: MatCheckboxChange,
    facetName: string,
    facetValueLabel: string,
    include: boolean
  ): void {

    const eventLabel = this.environment.isAnalyticsPrivate ? 'facet' : `${facetName} > ${facetValueLabel}`;
    const eventValue = event.checked ? 1 : 0;
    const eventAction = include ? 'include' : 'exclude';
    this.gaService.sendEvent('substancesFiltering', `check:facet-${eventAction}`, eventLabel, eventValue);

    if (this.privateFacetParams[facetName] == null) {
      this.privateFacetParams[facetName] = {
        params: {},
        isAllMatch: false
      };
    }

    if (include) {
      this.privateFacetParams[facetName].params[facetValueLabel] = event.checked || null;
    } else {
      this.privateFacetParams[facetName].params[facetValueLabel] = event.checked === true ? false : null;
    }

    let hasSelections = false;
    let hasExcludeOption = false;
    let includeOptionsLength = 0;

    const facetValueKeys = Object.keys(this.privateFacetParams[facetName].params);
    for (let i = 0; i < facetValueKeys.length; i++) {
      if (this.privateFacetParams[facetName].params[facetValueKeys[i]] != null) {
        hasSelections = true;
        if (this.privateFacetParams[facetName].params[facetValueKeys[i]] === false) {
          hasExcludeOption = true;
        } else {
          includeOptionsLength++;
        }
      }
    }

    this.privateFacetParams[facetName].hasSelections = hasSelections;

    if (!hasExcludeOption && includeOptionsLength > 1) {
      this.privateFacetParams[facetName].showAllMatchOption = true;
    } else {
      this.privateFacetParams[facetName].showAllMatchOption = false;
      this.privateFacetParams[facetName].isAllMatch = false;
    }

    this.pageIndex = 0;
  }


  clearFacetSelection(
    facetName?: string
  ) {

    const eventLabel = this.environment.isAnalyticsPrivate ? 'facet' : `facet: ${facetName}`;
    let eventValue = 0;

    const facetKeys = facetName != null ? [facetName] : Object.keys(this.privateFacetParams);

    if (facetKeys != null && facetKeys.length) {
      facetKeys.forEach(facetKey => {
        if (this.privateFacetParams[facetKey] != null && this.privateFacetParams[facetKey].params != null) {
          const facetValueKeys = Object.keys(this.privateFacetParams[facetKey].params);
          facetValueKeys.forEach(facetParam => {
            eventValue++;
            this.privateFacetParams[facetKey].params[facetParam] = null;
          });

          this.privateFacetParams[facetKey].isAllMatch = false;
          this.privateFacetParams[facetKey].showAllMatchOption = false;
          this.privateFacetParams[facetKey].hasSelections = false;
        }
      });
    }

    this.gaService.sendEvent('substancesFiltering2', 'button:clear-facet', eventLabel, eventValue);
  }

  populateUrlQueryParameters(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    const catArr = [];
    let facetString = '';
    for (const key of Object.keys(this.privateFacetParams)) {
      if (this.privateFacetParams[key].hasSelections === true) {
        const cat = this.privateFacetParams[key];
        const valArr = [];
        for (const subkey of Object.keys(cat.params)) {
          if (typeof cat.params[subkey] === 'boolean') {
            valArr.push(subkey + '.' + cat.params[subkey]);
          }
        }
        catArr.push(key + '*' + valArr.join('+'));
      }
    }
    facetString = catArr.join(',');
    navigationExtras.queryParams['searchTerm'] = this.privateSearchTerm;
    navigationExtras.queryParams['pageSize'] = this.pageSize;
    navigationExtras.queryParams['pageIndex'] = this.pageIndex;
    navigationExtras.queryParams['facets'] = facetString;
    navigationExtras.queryParams['skip'] = this.pageIndex * this.pageSize;

    this.router.navigate(
      [],
      navigationExtras
    );
  }

  private populateFacets(facets: Array<Facet>): void {
    if (this.configService.configData.facets != null) {
      if (this.configService.configData.facets.default != null && this.configService.configData.facets.default.length) {
        this.configService.configData.facets.default.forEach(facet => {
          for (let facetIndex = 0; facetIndex < facets.length; facetIndex++) {
            if (facet === facets[facetIndex].name) {
              if (facets[facetIndex].values != null && facets[facetIndex].values.length) {
                let hasValues = false;
                for (let valueIndex = 0; valueIndex < facets[facetIndex].values.length; valueIndex++) {
                  if (facets[facetIndex].values[valueIndex].count) {
                    hasValues = true;
                    break;
                  }
                }
                this.searchText[facets[facetIndex].name] = { value: '', isLoading: false};
                // Commenting the following lines at this moment.  These lines are causing not to display
                // Application Type and Application Status facets in Browse Application page. It is causing conflict
                // between Browse Substance facets in config file.
                /*
                if (hasValues) {
                  const facetToAdd = facets.splice(facetIndex, 1);
                  facetIndex--;
                  this.facets.push(facetToAdd[0]);
                }
                */
              }
              break;
            }
          }
        });
      }
    }

    // Remove ix.Class from facet
    for (let facetIndex = 0; facetIndex < facets.length; facetIndex++) {
      if (facets[facetIndex].name === 'ix.Class') {
        if (facetIndex !== -1) {
          facets.splice(facetIndex, 1);
        }
      }
    }

    this.facets = facets;
  }

  applyFacetsFilter(facetName: string) {
    const eventLabel = this.environment.isAnalyticsPrivate ? 'facet' : `${facetName}`;
    let eventValue = 0;
    Object.keys(this.privateFacetParams).forEach(key => {
      if (this.privateFacetParams[key].params) {
        eventValue = eventValue + Object.keys(this.privateFacetParams[key].params).length || 0;
      }
    });
    this.gaService.sendEvent('substancesFiltering', 'button:apply-facet', eventLabel, eventValue);
    this.populateUrlQueryParameters();
  }

  sendFacetsEvent(event: MatCheckboxChange, facetName: string): void {
    const eventLabel = this.environment.isAnalyticsPrivate ? 'facet' : `${facetName}`;
    const eventValue = event.checked ? 1 : 0;
    this.gaService.sendEvent('substancesFiltering', 'check:match-all', eventLabel, eventValue);
  }

  moreFacets(index: number, facet: Facet) {
    const subscription = this.applicationService.retrieveNextFacetValues(this.facets[index]).subscribe( resp => {
        this.facets[index].$next = resp.$next;
        this.facets[index].values = this.facets[index].values.concat(resp.content);
        this.facets[index].$fetched = this.facets[index].values;
        this.facets[index].$total = resp.ftotal;
        subscription.unsubscribe();
      }, error => {
        subscription.unsubscribe();
      });
  }

  lessFacets(index: number) {
    const subscription = this.applicationService.retrieveFacetValues(this.facets[index]).subscribe( response => {
       this.facets[index].values = response.content;
       this.facets[index].$fetched = response.content;
       this.facets[index].$next = response.$next;
       subscription.unsubscribe();
     }, error => {
      subscription.unsubscribe();
    });
  }

  filterFacets(index: number, event: any, faceName: string): void {
    this.searchText[faceName].isLoading = true;
    this.activeSearchedFaced = this.facets[index];
    this.facetSearchChanged.next({index: index, query: event});
  }

  clearFacetSearch(index: number, facetName: string): void {
    this.searchText[facetName].value = '';
    this.filterFacets(index, '', facetName);
  }

  get searchTerm(): string {
    return this.privateSearchTerm;
  }

  // get facetParams(): { [facetName: string]: { [facetValueLabel: string]: boolean } } {
  //   return this._facetParams;
  //  }

  get facetParams(): SubstanceFacetParam | { showAllMatchOption?: boolean } {
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
