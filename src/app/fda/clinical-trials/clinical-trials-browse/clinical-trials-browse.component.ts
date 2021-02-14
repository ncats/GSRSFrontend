import { Component, OnInit, ViewChild, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ClinicalTrialService } from '../clinical-trial/clinical-trial.service';
import { ClinicalTrial } from '../clinical-trial/clinical-trial.model';
import { ConfigService } from '@gsrs-core/config';
import * as _ from 'lodash';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { PageEvent } from '@angular/material';
import { UtilsService } from '@gsrs-core//utils/utils.service';
import { MatSidenav } from '@angular/material/sidenav';
import {AuthService} from '@gsrs-core/auth/auth.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { Location } from '@angular/common';
import { Subscription, Observable, Subject } from 'rxjs';
import { take } from 'rxjs/operators';

import { FacetParam } from '@gsrs-core/facets-manager';
import { Facet, FacetUpdateEvent } from '@gsrs-core/facets-manager/facet.model';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { DisplayFacet } from '@gsrs-core/facets-manager/display-facet';

import { MatCheckboxChange } from '@angular/material/checkbox';
import { Auth } from '@gsrs-core/auth/auth.model';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';


@Component({
  selector: 'app-clinical-trials-browse',
  templateUrl: './clinical-trials-browse.component.html',
  styleUrls: ['./clinical-trials-browse.component.scss']
})

export class ClinicalTrialsBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  public lodash = _;
  public privateSearchTerm = '';
  private privateSearchType = 'all';
  private privateSearchCutoff?: number;
  public clinicalTrials: Array<ClinicalTrial>;
  showHelp = false;
  pageIndex: number;
  pageSize: number;
  totalClinicalTrials: number;
  isLoading = true;
  isError = false;
  searchTypes = [];
  @ViewChild('matSideNavInstance', { static: true }) matSideNav: MatSidenav;
  hasBackdrop = false;
  // view = 'cards';
  displayedColumns: string[];
  public smiles: string;
  private argsHash?: number;
  public auth?: Auth;
  showAudit: boolean;
  public order: string;
  // public sortValues = searchSortValues;
  searchText: string[] = [];
  private overlayContainer: HTMLElement;
  toggle: Array<boolean> = [];
  private subscriptions: Array<Subscription> = [];
  dataSource = new MatTableDataSource<ClinicalTrial>([]);
  isAdmin: boolean;
  showExactMatches = false;
  private isComponentInit = false;

  // needed for facets
  private privateFacetParams: FacetParam;
  rawFacets: Array<Facet>;
  public displayFacets: Array<DisplayFacet> = [];
  private isFacetsParamsInit = false;
  public isCollapsed = true;



  constructor(
    private activatedRoute: ActivatedRoute,
    private clinicalTrialService: ClinicalTrialService,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    public utilsService: UtilsService,
    private router: Router,
    // private dialog: MatDialog,
    private authService: AuthService,
    private overlayContainerService: OverlayContainer,
    private location: Location,
    private facetManagerService: FacetsManagerService
  ) {}

  ngOnInit() {
    this.facetManagerService.registerGetFacetsHandler(this.clinicalTrialService.getClinicalTrialsFacets);
    this.pageSize = 10;
    this.pageIndex = 0;
    this.privateSearchTerm = this.activatedRoute.snapshot.queryParams['searchTerm'] || '';
    this.privateSearchType = this.activatedRoute.snapshot.queryParams['type'] || 'all';
    this.privateSearchCutoff = Number(this.activatedRoute.snapshot.queryParams['cutoff']) || 0;
    this.order = this.activatedRoute.snapshot.queryParams['order'] || '';
    this.pageSize = parseInt(this.activatedRoute.snapshot.queryParams['pageSize'], null) || 10;
    this.pageIndex = parseInt(this.activatedRoute.snapshot.queryParams['pageIndex'], null) || 0;
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    const authSubscription = this.authService.getAuth().subscribe(auth => {
      this.isAdmin = this.authService.hasAnyRoles('Updater', 'SuperUpdater');
      // this.showAudit = this.authService.hasRoles('admin');
       if (this.isAdmin) {
        this.displayedColumns = ['edit', 'nctNumber', 'title', 'lastUpdated', 'delete'];
       } else {
         this.displayedColumns = ['edit', 'nctNumber', 'title', 'lastUpdated'];
       }
    });
    this.searchTypes = [
      {'title': 'All', 'value': 'all'},
      {'title': 'Title', 'value': 'title'},
      {'title': 'NCT Number', 'value': 'nctNumber'},
      {'title': 'Substance UUID', 'value': 'substanceUuid'}
    ];
    this.isComponentInit = true;
    this.loadComponent();
  }

  ngAfterViewInit() {
    const openSubscription = this.matSideNav.openedStart.subscribe(() => {
      this.utilsService.handleMatSidenavOpen(1100);
    });
    this.subscriptions.push(openSubscription);
    const closeSubscription = this.matSideNav.closedStart.subscribe(() => {
      this.utilsService.handleMatSidenavClose();
    });
    this.subscriptions.push(closeSubscription);
    // this.isAdmin = this.authService.hasAnyRoles('Updater', 'SuperUpdater');
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.facetManagerService.unregisterFacetSearchHandler();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.processResponsiveness();
  }

  private loadComponent(): void {
    if (this.isFacetsParamsInit && this.isComponentInit) {
      this.searchClinicalTrials();
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

    // this.gaService.sendEvent('substancesContent', eventAction, 'pager', eventValue);

    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.populateUrlQueryParameters();
    this.searchClinicalTrials();
  }

  // for facets
  facetsParamsUpdated(facetsUpdateEvent: FacetUpdateEvent): void {
    this.pageIndex = 0;
    this.privateFacetParams = facetsUpdateEvent.facetParam;
    this.privateFacetParams = facetsUpdateEvent.facetParam;
    if (!this.isFacetsParamsInit) {
      this.isFacetsParamsInit = true;
      this.loadComponent();
    } else {
      this.searchClinicalTrials();
    }
  }

  // for facets
  facetsLoaded(numFacetsLoaded: number) {
    if (numFacetsLoaded > 0) {
      this.processResponsiveness();
    } else {
      this.matSideNav.close();
    }
  }

  searchClinicalTrials() {
    const newArgsHash = this.utilsService.hashCode(
      this.privateSearchTerm,
      this.privateSearchCutoff,
      this.privateSearchType,
      this.pageSize,
      this.order,
      this.privateFacetParams,
      (this.pageIndex * this.pageSize),
    );
    if (this.argsHash == null || this.argsHash !== newArgsHash) {
      this.isLoading = true;
      this.loadingService.setLoading(true);
      this.argsHash = newArgsHash;
      const skip = this.pageIndex * this.pageSize;
      const subscription = this.clinicalTrialService.getClinicalTrials({
        searchTerm: this.privateSearchTerm,
        cutoff: this.privateSearchCutoff,
        type: this.privateSearchType,
        order: this.order,
        pageSize: this.pageSize,
        facets: this.privateFacetParams,
        skip: skip
      })
        .subscribe(pagingResponse => {
          this.isError = false;
/*
          if (pagingResponse.exactMatches && pagingResponse.exactMatches.length > 0
            && pagingResponse.skip === 0
            && (!pagingResponse.sideway || pagingResponse.sideway.length < 2)
          ) {
            this.exactMatchSubstances = pagingResponse.exactMatches;
            this.showExactMatches = true;
          }
*/
          this.clinicalTrials = pagingResponse.content;
          this.totalClinicalTrials = pagingResponse.total;
          this.dataSource.data = this.clinicalTrials;
          if (pagingResponse.facets && pagingResponse.facets.length > 0) {
            this.rawFacets = pagingResponse.facets;
          }
/*
          this.narrowSearchSuggestions = {};
          this.matchTypes = [];
          this.narrowSearchSuggestionsCount = 0;
          if (pagingResponse.narrowSearchSuggestions && pagingResponse.narrowSearchSuggestions.length) {
            pagingResponse.narrowSearchSuggestions.forEach(suggestion => {
              if (this.narrowSearchSuggestions[suggestion.matchType] == null) {
                this.narrowSearchSuggestions[suggestion.matchType] = [];
                if (suggestion.matchType === 'WORD') {
                  this.matchTypes.unshift(suggestion.matchType);
                } else {
                  this.matchTypes.push(suggestion.matchType);
                }
              }
              this.narrowSearchSuggestions[suggestion.matchType].push(suggestion);
              this.narrowSearchSuggestionsCount++;
            });
          }
*/
        }, error => {
          // this.gaService.sendException('getSubstancesDetails: error from API cal');
          const notification: AppNotification = {
            message: 'There was an error trying to retrieve ClinicalTrials. Please refresh and try again.',
            type: NotificationType.error,
            milisecondsToShow: 6000
          };
          this.isError = true;
          this.isLoading = false;
          this.loadingService.setLoading(this.isLoading);
          this.notificationService.setNotification(notification);
        }, () => {
          subscription.unsubscribe();
          /*
          if (this.exactMatchSubstances && this.exactMatchSubstances.length > 0) {
            this.exactMatchSubstances.forEach(substance => {
              this.setSubstanceNames(substance.uuid);
              this.setSubstanceCodes(substance.uuid);
            });

          }
          this.substances.forEach(substance => {
            this.setSubstanceNames(substance.uuid);
            this.setSubstanceCodes(substance.uuid);
          });
          */
          this.isLoading = false;
          this.loadingService.setLoading(this.isLoading);
        });
    }
  }

  setSearchTermValue() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.privateSearchTerm = this.privateSearchTerm.trim();
    this.populateUrlQueryParameters();
    this.searchClinicalTrials();
  }

  deleteClinicalTrial(index: number) {
    if (typeof this.clinicalTrials[index] === 'undefined' || ! _.has(this.clinicalTrials[index], 'nctNumber')) {
        alert('A trial number is required.');
        return;
    }
    if (!confirm('Are you sure to delete ' + this.clinicalTrials[index].nctNumber + '?')) {
      return;
    }
    this.loadingService.setLoading(true);
    this.clinicalTrialService.deleteClinicalTrial(this.clinicalTrials[index].nctNumber)
      .subscribe(result => {
        this.isError = false;
        const deletedClinicalTrials = this.clinicalTrials.splice(index, 1);
        this.dataSource.data = this.clinicalTrials;
        const notification: AppNotification = {
          message: 'You deleted the clinical trial record for:' + deletedClinicalTrials[0].nctNumber,
          type: NotificationType.success,
          milisecondsToShow: 6000
        };
        this.isError = false;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
      }, error => {
        const notification: AppNotification = {
          message: 'There was an error trying to delete a clinical trial.',
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
  }

  // see substances code
  populateUrlQueryParameters(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['searchTerm'] = this.privateSearchTerm;
    navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff;
    navigationExtras.queryParams['type'] = this.privateSearchType;
    navigationExtras.queryParams['order'] = this.order;
    navigationExtras.queryParams['pageSize'] = this.pageSize;
    navigationExtras.queryParams['pageIndex'] = this.pageIndex;
    navigationExtras.queryParams['skip'] = this.pageIndex * this.pageSize;

    const urlTree = this.router.createUrlTree([], {
      queryParams: navigationExtras.queryParams,
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.location.go(urlTree.toString());
  }

  // see substances code
  clearSearch(): void {
    // const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;
    // this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-search', eventLabel);
    this.privateSearchTerm = '';
    this.pageIndex = 0;

    this.populateUrlQueryParameters();
    this.searchClinicalTrials();
  }

  // see substance code
  clearFilters(): void {
    this.facetManagerService.clearSelections();
    this.clearSearch();
  }

  get searchTerm(): string {
    return this.privateSearchTerm;
  }

  set searchTerm(s: string) {
    this.privateSearchTerm = s;
  }

  get searchType(): string {
    return this.privateSearchType;
  }

  set searchType(s: string) {
    this.privateSearchType = s;
  }

  // see substances code
  private processResponsiveness = () => {
    if (window) {
      if (window.innerWidth < 1100) {
        this.matSideNav.close();
        this.isCollapsed = true;
        this.hasBackdrop = true;
      } else {
        this.matSideNav.open();
        this.hasBackdrop = false;
      }
    }
  }

  // see substances code
  openSideNav() {
    // this.gaService.sendEvent('substancesFiltering', 'button:sidenav', 'open');
    this.matSideNav.open();
  }


  showAllRecords(): void {
    this.showExactMatches = false;
    this.processResponsiveness();
  }

  increaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = '1002';
  }

  decreaseOverlayZindex(): void {
    this.overlayContainer.style.zIndex = null;
  }


  toggleShowHelp() {
    this.showHelp = !this.showHelp;
  }

}
