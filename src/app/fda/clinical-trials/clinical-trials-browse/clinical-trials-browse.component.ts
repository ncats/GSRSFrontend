import { Component, OnInit, ViewChild, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ClinicalTrialService } from '../clinical-trial/clinical-trial.service';
import { ClinicalTrial } from '../clinical-trial/clinical-trial.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
import * as _ from 'lodash';
import { Facet } from '@gsrs-core/utils';
import { ClinicalTrialFacetParam } from '../misc/clinical-trial-facet-param.model';
import { LoadingService } from '@gsrs-core/loading';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { PageEvent, MatPaginatorIntl } from '@angular/material';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import {AuthService} from '@gsrs-core/auth/auth.service';
import { Auth } from '@gsrs-core/auth/auth.model';
import { Location, LocationStrategy } from '@angular/common';
import { UtilsService } from '../../../core/utils/utils.service';
import { MatSidenav } from '@angular/material/sidenav';
// import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatExpansionModule } from '@angular/material/expansion';
import { FacetDisplayPipe } from '../../utils/facet-display.pipe';
import { FacetFilterPipe } from '../../utils/facet-filter.pipe';

@Component({
  selector: 'app-clinical-trials-browse',
  templateUrl: './clinical-trials-browse.component.html',
  styleUrls: ['./clinical-trials-browse.component.scss']
})

export class ClinicalTrialsBrowseComponent implements OnInit, AfterViewInit  {
  public privateSearchTerm = '';
  private privateSearchType = 'all';
  private privateSearchCutoff?: number;
  public clinicalTrials: Array<ClinicalTrial>;
  public facets: Array<Facet> = [];
  public displayFacets: Array<DisplayFacet> = [];
  private privateFacetParams: ClinicalTrialFacetParam;
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
  facetString: string;
  displayedColumns: string[];
  public smiles: string;
  private argsHash?: number;
  public auth?: Auth;
  showAudit: boolean;
  public order: string;
  // public sortValues = searchSortValues;
  public facetBuilder: ClinicalTrialFacetParam;
  searchText: string[] = [];
  private overlayContainer: HTMLElement;
  toggle: Array<boolean> = [];
  dataSource = new MatTableDataSource<ClinicalTrial>([]);
  isAdmin: boolean;
  jumpToValue: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    private clinicalTrialService: ClinicalTrialService,
    // private sanitizer: DomSanitizer,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    public utilsService: UtilsService,
    private router: Router,
    // private dialog: MatDialog,
    private authService: AuthService,
    // private overlayContainerService: OverlayContainer,
    private location: Location,
    private locationStrategy: LocationStrategy
  ) {
    this.privateFacetParams = {};
    this.facetBuilder = {};
  }


  ngAfterViewInit() {
    this.matSideNav.openedStart.subscribe(() => {
      this.utilsService.handleMatSidenavOpen(1100);
    });
    this.matSideNav.closedStart.subscribe(() => {
      this.utilsService.handleMatSidenavClose();
    });
  }

  // see substances code
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
          this.facetBuilder[category] = { params: params, hasSelections: true, isAllMatch: false };
          const paramsString = JSON.stringify(params);
          const newHash = this.utilsService.hashCode(paramsString, this.facetBuilder[category].isAllMatch.toString());
          this.facetBuilder[category].currentStateHash = newHash;
        }
      }
      this.privateFacetParams = this.facetBuilder;
    }

  }


  ngOnInit() {

    this.pageSize = 10;
    this.pageIndex = 0;
    this.facets = [];
    this.privateSearchTerm = this.activatedRoute.snapshot.queryParams['searchTerm'] || '';
    this.privateSearchType = this.activatedRoute.snapshot.queryParams['type'] || 'all';
    this.privateSearchCutoff = Number(this.activatedRoute.snapshot.queryParams['cutoff']) || 0;
    this.order = this.activatedRoute.snapshot.queryParams['order'] || '';
    this.pageSize = parseInt(this.activatedRoute.snapshot.queryParams['pageSize'], null) || 10;
    this.pageIndex = parseInt(this.activatedRoute.snapshot.queryParams['pageIndex'], null) || 0;
    this.facetString = this.activatedRoute.snapshot.queryParams['facets'] || '';
    this.facetsFromParams();
    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
    this.isAdmin = response;
      if (this.isAdmin) {
        this.displayedColumns = ['edit', 'nctNumber', 'title', 'lastUpdated', 'delete'];
       } else {
         this.displayedColumns = ['edit', 'nctNumber', 'title', 'lastUpdated'];
       }
    });
    this.searchTypes = [
      {'title': 'All', 'value': 'all'},
      {'title': 'Title', 'value': 'title'},
      {'title': 'NCT Number', 'value': 'nctNumber'}
      // , {'title': 'UUID', 'value': 'substanceUuid'}
    ];
    this.searchClinicalTrials();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.processResponsiveness();
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

  setSearchTermValue() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.privateSearchTerm = this.privateSearchTerm.trim();
    this.populateUrlQueryParameters();
    this.searchClinicalTrials();
  }

  deleteClinicalTrial(index: number) {
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

  searchClinicalTrials() {
    const newArgsHash = this.utilsService.hashCode(
      this.privateSearchTerm,
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
    this.clinicalTrialService.getClinicalTrials(
      {
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
        this.clinicalTrials = pagingResponse.content;
        this.dataSource.data = this.clinicalTrials;

        this.totalClinicalTrials = pagingResponse.total;
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          this.populateFacets(pagingResponse.facets);
        }
      }, error => {
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
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
      });
    }
  }

  // see substances code
  populateUrlQueryParameters(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    const catArr = [];
    let facetString = '';
    for (const key of Object.keys(this.privateFacetParams)) {
      if (this.privateFacetParams[key] !== undefined && this.privateFacetParams[key].hasSelections === true) {
        const cat = this.privateFacetParams[key];
        const valArr = [];
        for (const subkey of Object.keys(cat.params)) {
          if (typeof cat.params[subkey] === 'boolean') {
            valArr.push(subkey + '.' + cat.params[subkey]);
          }
        }
        catArr.push(key + '*' + valArr.join('+'));
        const paramsString = JSON.stringify(this.privateFacetParams[key].params);
        const newHash = this.utilsService.hashCode(paramsString, this.privateFacetParams[key].isAllMatch.toString());
        this.privateFacetParams[key].currentStateHash = newHash;
        this.privateFacetParams[key].isUpdated = false;
      }
    }
    facetString = catArr.join(',');
    navigationExtras.queryParams['searchTerm'] = this.privateSearchTerm;
    navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff;
    navigationExtras.queryParams['type'] = this.privateSearchType;
    navigationExtras.queryParams['order'] = this.order;
    navigationExtras.queryParams['pageSize'] = this.pageSize;
    navigationExtras.queryParams['pageIndex'] = this.pageIndex;
    navigationExtras.queryParams['facets'] = facetString;
    navigationExtras.queryParams['skip'] = this.pageIndex * this.pageSize;

    const urlTree = this.router.createUrlTree([], {
      queryParams: navigationExtras.queryParams,
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.location.go(urlTree.toString());
  }


  // see substances code
  private populateFacets(facets: Array<Facet>): void {
    const subscription = this.authService.getAuth().subscribe(auth => {

      let newFacets = [];
      this.auth = auth;
      this.showAudit = this.authService.hasRoles('admin');
      if (this.configService.configData.facets != null) {

        const facetKeys = Object.keys(this.configService.configData.facets) || [];

        facetKeys.forEach(facetKey => {
          if (this.configService.configData.facets[facetKey].length
            && (facetKey === 'ctclinicaltrial' || this.authService.hasRoles(facetKey))) {
            this.configService.configData.facets[facetKey].forEach(facet => {
              for (let facetIndex = 0; facetIndex < facets.length; facetIndex++) {
                this.toggle[facetIndex] = true;
                if (facet === facets[facetIndex].name) {
                  if (facets[facetIndex].values != null && facets[facetIndex].values.length) {
                    let hasValues = false;
                    for (let valueIndex = 0; valueIndex < facets[facetIndex].values.length; valueIndex++) {
                      if (facets[facetIndex].values[valueIndex].count) {
                        hasValues = true;
                        break;
                      }
                    }

                    if (hasValues) {
                      const facetToAdd = facets.splice(facetIndex, 1);
                      facetIndex--;
                      newFacets.push(facetToAdd[0]);
                      this.searchText.push(facetToAdd[0].name);
                    }
                  }
                  break;
                }
              }
            });
          }

        });

      }
      // leaving out for now; produces unexpected results in my case.
      if (0 && newFacets.length < 15) {

        const numFillFacets = 15 - newFacets.length;

        let sortedFacets = _.orderBy(facets, facet => {
          let valuesTotal = 0;
          facet.values.forEach(value => {
            valuesTotal += value.count;
          });
          return valuesTotal;
        }, 'desc');
        const additionalFacets = _.take(sortedFacets, numFillFacets);
        newFacets = newFacets.concat(additionalFacets);
        sortedFacets = null;
      }

      if (newFacets.length > 0) {
        this.processResponsiveness();
      } else {
        this.matSideNav.close();
      }
      this.facets = newFacets;
      this.cleanFacets();
    });
  }

  // see substances code
  applyFacetsFilter(facetName: string) {
    // const eventLabel = environment.isAnalyticsPrivate ? 'facet' : `${facetName}`;
    let eventValue = 0;
    Object.keys(this.privateFacetParams).forEach(key => {
      if (this.privateFacetParams[key] && this.privateFacetParams[key].params) {
        eventValue = eventValue + Object.keys(this.privateFacetParams[key].params).length || 0;
      }
    });
    // this.gaService.sendEvent('substancesFiltering', 'button:apply-facet', eventLabel, eventValue);
    this.populateUrlQueryParameters();
    this.searchClinicalTrials();
    this.getLabelFacets();
  }

  // see substances code
  removeFacet(facet: any): void {
    const mockEvent = {'checked': false};
    this.updateFacetSelection(mockEvent, facet.type, facet.val, facet.bool);

    setTimeout(() => {
      this.applyFacetsFilter(facet.type);
    });
  }

  // see substances code
  getLabelFacets() {
    this.displayFacets = [];
    Object.keys(this.privateFacetParams).forEach(key => {
      if (this.privateFacetParams[key] && this.privateFacetParams[key].params) {
        Object.keys(this.privateFacetParams[key].params).forEach(sub => {
          if (this.privateFacetParams[key].params[sub] !== undefined) {
            const facet = {
              'type': key,
              'val' : sub,
              'bool': this.privateFacetParams[key].params[sub]
            };
            this.displayFacets.push(facet);
          }
        });
      }
      });
  }

  // see substances code
  updateFacetSelection(
    event: any,
    facetName: string,
    facetValueLabel: string,
    include: boolean
  ): void {

    // const eventLabel = environment.isAnalyticsPrivate ? 'facet' : `${facetName} > ${facetValueLabel}`;
    const eventValue = event.checked ? 1 : 0;
    const eventAction = include ? 'include' : 'exclude';
    // this.gaService.sendEvent('substancesFiltering', `check:facet-${eventAction}`, eventLabel, eventValue);

    let paramsString: string;
    let isAllMatchString: string;

    if (this.privateFacetParams[facetName] == null) {
      this.privateFacetParams[facetName] = {
        params: {},
        isAllMatch: false
      };
      paramsString = JSON.stringify(this.privateFacetParams[facetName].params);
      isAllMatchString = this.privateFacetParams[facetName].isAllMatch.toString();
      const stateHash = this.utilsService.hashCode(paramsString, isAllMatchString);
      this.privateFacetParams[facetName].currentStateHash = stateHash;
    }

    if (include) {
      this.privateFacetParams[facetName].params[facetValueLabel] = event.checked || undefined;
    } else {
      this.privateFacetParams[facetName].params[facetValueLabel] = event.checked === true ? false : undefined;
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

    paramsString = JSON.stringify(this.privateFacetParams[facetName].params);
    isAllMatchString = this.privateFacetParams[facetName].isAllMatch.toString();
    const newHash = this.utilsService.hashCode(paramsString, isAllMatchString);
    this.privateFacetParams[facetName].isUpdated = newHash !== this.privateFacetParams[facetName].currentStateHash;
    this.pageIndex = 0;
  }

  // see substances code
  clearFacetSelection(
    facetName?: string
  ) {

    // const eventLabel = environment.isAnalyticsPrivate ? 'facet' : `facet: ${facetName}`;
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
          const paramsString = JSON.stringify(this.privateFacetParams[facetName].params);
          const isAllMatchString = this.privateFacetParams[facetName].isAllMatch.toString();
          const newHash = this.utilsService.hashCode(paramsString, isAllMatchString);
          this.privateFacetParams[facetName].isUpdated = newHash !== this.privateFacetParams[facetName].currentStateHash;
        }
      });
    }

    // this.gaService.sendEvent('substancesFiltering', 'button:clear-facet', eventLabel, eventValue);
  }

  // see substances code
  cleanFacets(): void {
    if (this.privateFacetParams != null) {
      const facetParamsKeys = Object.keys(this.privateFacetParams);
      if (facetParamsKeys && facetParamsKeys.length > 0) {
        facetParamsKeys.forEach(key => {
          if (this.privateFacetParams[key]) {
            if ((Object.keys(this.privateFacetParams[key].params).length < 1) || (this.privateFacetParams[key].hasSelections === false)) {
              this.privateFacetParams[key] = undefined;
            }
          }
        });
      }
      this.getLabelFacets();
    }
  }

  // see substances code
  get facetParams(): ClinicalTrialFacetParam | { showAllMatchOption?: boolean } {
    return this.privateFacetParams;
  }

  // see substances code
  private processResponsiveness = () => {
    if (window) {
      if (window.innerWidth < 1100) {
        this.matSideNav.close();
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

  // see substances code
  sendFacetsEvent(event: MatCheckboxChange, facetName: string): void {
//    const eventLabel = environment.isAnalyticsPrivate ? 'facet' : `${facetName}`;
    const eventValue = event.checked ? 1 : 0;
//    this.gaService.sendEvent('substancesFiltering', 'check:match-all', eventLabel, eventValue);
  }

  clearFilters(): void {
      this.clearSearch();
  }

  clearSearch(): void {
    // const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;
    // this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-search', eventLabel);
    this.privateSearchTerm = '';
    this.pageIndex = 0;
    // automatically calls searchSubstances() because of subscription to route changes
    this.populateUrlQueryParameters();
  }

  set searchTerm(s: string) {
    this.privateSearchTerm = s;
  }

  get searchTerm(): string {
    return this.privateSearchTerm;
  }

  set searchType(s: string) {
    this.privateSearchType = s;
  }

  get searchType(): string {
    return this.privateSearchType;
  }

  toggleShowHelp() {
    this.showHelp = !this.showHelp;
  }

}

interface DisplayFacet {
  type: string;
  bool: boolean;
  val: string;
}
