import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, AfterViewInit } from '@angular/core';
import { Facet, FacetUpdateEvent } from './facet.model';
import { FacetParam } from '@gsrs-core/facets-manager';
import { Subject, Subscription } from 'rxjs';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { UtilsService } from '@gsrs-core/utils';
import { debounceTime, distinctUntilChanged, switchMap, take } from 'rxjs/operators';
import { FacetsManagerService } from './facets-manager.service';
import { AuthService } from '@gsrs-core/auth';
import { ConfigService } from '@gsrs-core/config';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { Environment } from 'src/environments/environment.model';
import { Location } from '@angular/common';
import { DisplayFacet } from './display-facet';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-facets-manager',
  templateUrl: './facets-manager.component.html',
  styleUrls: ['./facets-manager.component.scss']
})
export class FacetsManagerComponent implements OnInit, OnDestroy, AfterViewInit {
  facetString: string;
  public facets: Array<Facet>;
  private privateRawFacets: Array<Facet>;
  public displayFacets: Array<DisplayFacet> = [];
  private privateFacetParams: FacetParam;
  public facetBuilder: FacetParam;
  searchText: { [faceName: string]: { value: string, isLoading: boolean } } = {};
  private facetSearchChanged = new Subject<{ index: number, query: any }>();
  private activeSearchedFaced: Facet;
  private facetsAuthSubscription: Subscription;
  private subscriptions: Array<Subscription> = [];
  @Output() facetsParamsUpdated = new EventEmitter<FacetUpdateEvent>();
  showAudit: boolean;
  private facetsConfig: { [permission: string]: Array<string> };
  toggle: Array<boolean> = [];
  @Output() facetsLoaded = new EventEmitter<number>();
  private environment: Environment;
  @Input() includeFacetSearch = false;
  showDeprecated = false;
  loggedIn = false;
  hideDeprecatedCheckbox = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    public utilsService: UtilsService,
    private facetsService: FacetsManagerService,
    private authService: AuthService,
    private configService: ConfigService,
    private gaService: GoogleAnalyticsService,
    private router: Router,
    private location: Location,
    private facetManagerService: FacetsManagerService
  ) {
    this.privateFacetParams = {};
    this.facetBuilder = {};
    this.facets = [];
    this.environment = configService.environment;
  }

  ngOnInit() {
    this.facetString = this.activatedRoute.snapshot.queryParams['facets'] || '';
    const show = this.activatedRoute.snapshot.queryParams['showDeprecated'] || 'false';
    if ( show === 'true') {
      this.showDeprecated = true;
    }
    this.facetsFromParams();
    this.setDisplayFacets();
    this.facetsParamsUpdated.emit({ facetParam: this.privateFacetParams,
      displayFacets: this.displayFacets,
      deprecated: this.showDeprecated });
    const deleteEventSubscription = this.facetManagerService.clearSelectionsEvent.subscribe(() => {
      this.clearFacetSelection();
    });
    this.subscriptions.push(deleteEventSubscription);

    this.authService.getAuth().pipe(take(1)).subscribe(auth => {
      if (auth) {
        this.loggedIn = true;
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  ngAfterViewInit() {
    if (this.includeFacetSearch) {
      const facetSearchSubscription = this.facetSearchChanged.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(event => {
          const facet = this.facets[event.index];
          return this.facetsService.getFacetsHandler(facet, event.query).pipe(take(1));
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
            && this.privateFacetParams[this.activeSearchedFaced.name] != null
            && (this.privateFacetParams[this.activeSearchedFaced.name].params[value.label] === true
              || this.privateFacetParams[this.activeSearchedFaced.name].params[value.label] === false)) {
            removeFacet = false;
          }

          return !removeFacet;
        });
        this.activeSearchedFaced.values = this.activeSearchedFaced.values.concat(response.content);
        this.searchText[this.activeSearchedFaced.name].isLoading = false;
      }, error => {
        this.searchText[this.activeSearchedFaced.name].isLoading = false;
      });
      this.subscriptions.push(facetSearchSubscription);
    }
  }

  @Input()
  set rawFacets(facets: Array<Facet>) {
    this.privateRawFacets = facets || [];
    this.populateFacets();
  }

  @Input()
  set configName(configName: string) {
    this.facetsConfig = this.configService.configData.facets && this.configService.configData.facets[configName] || {};
    if ( configName === 'applications' ||  configName === 'ctclinicaltrial') {
      this.hideDeprecatedCheckbox = true;
    } else {
      this.hideDeprecatedCheckbox = false;
    }
    this.populateFacets();
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
        let isAllMatch = false;
        let hasExcludeOption = false;
        let includeOptionsLength = 0;
        for (let j = 0; j < fieldsArr.length; j++) {
          const field = fieldsArr[j].split('.');
          field[0] = decodeURIComponent(field[0]);
          if (field[0] === 'is_all_match') {
            isAllMatch = true;
          } else {
            if (field[1] === 'true') {
              params[field[0]] = true;
              hasSelections = true;
              includeOptionsLength++;
            } else if (field[1] === 'false') {
              params[field[0]] = false;
              hasSelections = true;
              hasExcludeOption = true;
            }
          }
        }
        if (hasSelections === true) {
          this.facetBuilder[category] = { params: params, hasSelections: true, isAllMatch: isAllMatch };
          if (!hasExcludeOption && includeOptionsLength > 1) {
            this.facetBuilder[category].showAllMatchOption = true;
          }
          const paramsString = JSON.stringify(params);
          const newHash = this.utilsService.hashCode(paramsString,
            this.facetBuilder[category].isAllMatch.toString(),
            this.showDeprecated.toString());
          this.facetBuilder[category].currentStateHash = newHash;
        }
      }
      this.privateFacetParams = this.facetBuilder;
    }
  }

  toggleDeprecated(): void {
    this.showDeprecated = !this.showDeprecated;
    setTimeout(() => {
      this.populateUrlQueryParameters(this.showDeprecated);
          this.facetsParamsUpdated.emit({ facetParam: this.privateFacetParams, displayFacets: this.displayFacets,
            deprecated: this.showDeprecated });

    });
  }

  private populateFacets(): void {
    if (this.privateRawFacets && this.facetsConfig) {
      if (this.facetsAuthSubscription != null) {
        this.facetsAuthSubscription.unsubscribe();
        this.facetsAuthSubscription = null;
      }
      this.facetsAuthSubscription = this.authService.getAuth().subscribe(auth => {
        const facetsCopy = this.privateRawFacets.slice();
        const newFacets = [];
        this.showAudit = this.authService.hasRoles('admin');
        const facetKeys = Object.keys(this.facetsConfig) || [];

        facetKeys.forEach(facetKey => {
          if (this.facetsConfig[facetKey].length
            && (facetKey === 'default' || this.authService.hasRoles(facetKey))) {
            this.facetsConfig[facetKey].forEach(facet => {
              for (let facetIndex = 0; facetIndex < facetsCopy.length; facetIndex++) {
                this.toggle[facetIndex] = true;
                if (facet === facetsCopy[facetIndex].name) {
                  if (facetsCopy[facetIndex].values != null && facetsCopy[facetIndex].values.length) {
                    let hasValues = false;
                    for (let valueIndex = 0; valueIndex < facetsCopy[facetIndex].values.length; valueIndex++) {
                      if (facetsCopy[facetIndex].values[valueIndex].count) {
                        hasValues = true;
                        break;
                      }
                    }

                    if (hasValues) {
                      const facetToAdd = facetsCopy.splice(facetIndex, 1);
                      facetIndex--;
                      newFacets.push(facetToAdd[0]);
                      this.searchText[facetToAdd[0].name] = { value: '', isLoading: false };
                    }
                  }
                  break;
                }
              }
            });
          }

        });

        this.facets = newFacets;
        this.facetsLoaded.emit(this.facets.length);
        this.cleanFacets();
        this.setDisplayFacets();
      });
    }
  }

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
    }
  }

  setDisplayFacets() {
    if (this.privateFacetParams != null) {
      this.displayFacets = [];
      Object.keys(this.privateFacetParams).forEach(key => {
        if (this.privateFacetParams[key] && this.privateFacetParams[key].params) {
          Object.keys(this.privateFacetParams[key].params).forEach(sub => {
            if (this.privateFacetParams[key].params[sub] !== undefined) {
              const facet = new DisplayFacet(
                key,
                this.privateFacetParams[key].params[sub],
                sub,
                (type: string, bool: boolean, val: string) => {
                  this.removeFacet(type, bool, val);
                }
              );
              this.displayFacets.push(facet);
            }
          });
        }
      });
    }
  }

  populateUrlQueryParameters(deprecated?: boolean): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    const catArr = [];
    let facetString = '';
    for (const key of Object.keys(this.privateFacetParams)) {
      if (this.privateFacetParams[key] !== undefined &&
        this.privateFacetParams[key].hasSelections === true &&
        !(this.showDeprecated && key === 'Deprecated' && this.privateFacetParams[key] !== undefined &&
            this.privateFacetParams[key].params &&
            this.privateFacetParams[key].params['Deprecated'] === true)) {
        const cat = this.privateFacetParams[key];
        const valArr = [];
        for (const subkey of Object.keys(cat.params)) {
          if (typeof cat.params[subkey] === 'boolean') {
            valArr.push(subkey + '.' + cat.params[subkey]);
          }
        }
        if (cat.isAllMatch) {
          valArr.push('is_all_match.true');
        }
        catArr.push(key + '*' + valArr.join('+'));
        const paramsString = JSON.stringify(this.privateFacetParams[key].params);
        const newHash = this.utilsService.hashCode(paramsString, this.privateFacetParams[key].isAllMatch.toString());
        this.privateFacetParams[key].currentStateHash = newHash;
        this.privateFacetParams[key].isUpdated = false;
    }
  }
    facetString = catArr.join(',');
    if (facetString !== '') {
      navigationExtras.queryParams['facets'] = facetString;
    }
     if (this.showDeprecated) {
      navigationExtras.queryParams['showDeprecated'] = 'true';
    } else {
      navigationExtras.queryParams['showDeprecated'] = null;
    }

    const urlTree = this.router.createUrlTree([], {
      queryParams: navigationExtras.queryParams,
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.location.go(urlTree.toString());
  }

  applyFacetsFilter(facetName: string) {
    const eventLabel = this.environment.isAnalyticsPrivate ? 'facet' : `${facetName}`;
    let eventValue = 0;
    Object.keys(this.privateFacetParams).forEach(key => {
      if (this.privateFacetParams[key] && this.privateFacetParams[key].params) {
        eventValue = eventValue + Object.keys(this.privateFacetParams[key].params).length || 0;
      }
    });
    this.gaService.sendEvent('substancesFiltering', 'button:apply-facet', eventLabel, eventValue);
    this.populateUrlQueryParameters();
    this.setDisplayFacets();
    this.facetsParamsUpdated.emit({ facetParam: this.privateFacetParams,
       displayFacets: this.displayFacets,
        deprecated: this.showDeprecated});
  }

  removeFacet(type: string, bool: boolean, val: string): void {
    const mockEvent = { 'checked': false, source: null };
    this.updateFacetSelection(mockEvent, type, val, bool);

    setTimeout(() => {
      this.applyFacetsFilter(type);
    });
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
  }

  updateAllMatch(facetName: string): void {

    const eventLabel = this.environment.isAnalyticsPrivate ? 'facet' : `${facetName}`;
    const eventValue = this.privateFacetParams[facetName].isAllMatch ? 1 : 0;
    this.gaService.sendEvent('substancesFiltering', `check:facet-all_match`, eventLabel, eventValue);

    const paramsString = JSON.stringify(this.privateFacetParams[facetName].params);
    const isAllMatchString = this.privateFacetParams[facetName].isAllMatch.toString();
    const newHash = this.utilsService.hashCode(paramsString, isAllMatchString);
    this.privateFacetParams[facetName].isUpdated = newHash !== this.privateFacetParams[facetName].currentStateHash;
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
            this.privateFacetParams[facetKey].params[facetParam] = undefined;
          });

          this.privateFacetParams[facetKey].isAllMatch = false;
          this.privateFacetParams[facetKey].showAllMatchOption = false;
          this.privateFacetParams[facetKey].hasSelections = false;

          if (facetName != null) {
            const paramsString = JSON.stringify(this.privateFacetParams[facetName].params);
            const isAllMatchString = this.privateFacetParams[facetName].isAllMatch.toString();
            const newHash = this.utilsService.hashCode(paramsString, isAllMatchString);
            this.privateFacetParams[facetName].isUpdated = newHash !== this.privateFacetParams[facetName].currentStateHash;
          }
        }
      });
    }

    const navigationExtras: NavigationExtras = {
      queryParams: {
        facets: ''
      }
    };

    setTimeout(() => {
      const urlTree = this.router.createUrlTree([], {
        queryParams: navigationExtras.queryParams,
        queryParamsHandling: 'merge',
        preserveFragment: true
      });
      this.location.go(urlTree.toString());
    });

    this.gaService.sendEvent('substancesFiltering', 'button:clear-facet', eventLabel, eventValue);
  }

  moreFacets(index: number, facet: Facet) {
    this.facets[index].$isLoading = true;
    if (facet.$next == null) {
      facet.$next = facet._self.replace('fskip=0', 'fskip=10');
    }
    this.facetManagerService.getFacetsHandler(this.facets[index], '', facet.$next).pipe(take(1)).subscribe(resp => {
      this.facets[index].$next = resp.nextPageUri;
      this.facets[index].$previous = resp.previousPageUri;
      this.facets[index].values = this.facets[index].values.concat(resp.content);
      this.facets[index].$fetched = this.facets[index].values;
      this.facets[index].$total = resp.ftotal;
      this.facets[index].$isLoading = false;
    }, error => {
      this.facets[index].$isLoading = false;
    });
  }

  lessFacets(index: number) {
    this.facets[index].$isLoading = true;
    const nextUrl = this.facets[index].$next;
    this.facetManagerService.getFacetsHandler(this.facets[index], null, null).pipe(take(1)).subscribe(response => {
      this.facets[index].values = response.content;
      this.facets[index].$fetched = response.content;
      this.facets[index].$next = response.nextPageUri;
      this.facets[index].$previous = response.previousPageUri;
      this.facets[index].$isLoading = false;
    }, error => {
      this.facets[index].$isLoading = false;
    });
  }

  filterFacets(index: number, searchTerm: string, faceName: string): void {
    this.searchText[faceName].isLoading = true;
    this.activeSearchedFaced = this.facets[index];
    this.facetSearchChanged.next({ index: index, query: searchTerm });
  }

  clearFacetSearch(index: number, facetName: string): void {
    this.searchText[facetName].value = '';
    this.filterFacets(index, '', facetName);
  }

  get facetParams(): FacetParam | { showAllMatchOption?: boolean } {
    return this.privateFacetParams;
  }

}
