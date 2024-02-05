import { Component, OnInit, OnDestroy, EventEmitter, Input, Output, AfterViewInit, HostListener } from '@angular/core';
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
import { UserQueryListDialogComponent } from '@gsrs-core/bulk-search/user-query-list-dialog/user-query-list-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-facets-manager',
  templateUrl: './facets-manager.component.html',
  styleUrls: ['./facets-manager.component.scss']
})
export class FacetsManagerComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() facetsParamsUpdated = new EventEmitter<FacetUpdateEvent>();
  @Output() facetsLoaded = new EventEmitter<number>();
  @Input() includeFacetSearch = false;
  @Input() calledFrom = 'default';
  @Input() panelExpanded = false;
  facetString: string;
  public facets: Array<Facet>;
  public displayFacets: Array<DisplayFacet> = [];
  public facetBuilder: FacetParam;
  searchText: { [faceName: string]: { value: string; isLoading: boolean; } } = {};
  showAudit: boolean;
  toggle: Array<boolean> = [];
  showDeprecated = false;
  loggedIn = false;
  hideDeprecatedCheckbox = false;
  previousState: Array<string> = [];
  previousFacets: Array<any> = [];
  _facetDisplayType = 'default';
  _facetViewCategorySelected: string;
  _configName: string;
  _facetNameText: string;
  urlSearch: string;
  stagingFacets: any;
  private privateFacetParams: FacetParam;
  private privateRawFacets: Array<Facet>;
  private facetSearchChanged = new Subject<{ index: number; query: any; facets?: any; }>();
  private activeSearchedFaced: Facet;
  private facetsAuthSubscription: Subscription;
  private subscriptions: Array<Subscription> = [];
  private facetsConfig: { [permission: string]: Array<string> };
  private environment: Environment;

  constructor(
    private activatedRoute: ActivatedRoute,
    public utilsService: UtilsService,
    private facetsService: FacetsManagerService,
    private authService: AuthService,
    private configService: ConfigService,
    private gaService: GoogleAnalyticsService,
    private router: Router,
    private location: Location,
    private facetManagerService: FacetsManagerService,
    private dialog: MatDialog
  ) {
    this.privateFacetParams = {};
    this.facetBuilder = {};
    this.facets = [];
    this.environment = configService.environment;
  }

  /*@HostListener('window:popstate', ['$event'])
  onPopState(event) {
    setTimeout(() => {
      if(this.router.url === '/browse-substance') {
        this.privateFacetParams = {};
        this.ngOnInit();
      }
    }, 50);
  }*/

  @HostListener('window:popstate', ['$event'])
  onPopState(event) {
    setTimeout(() => {
      if (this.router.url === this.previousState[0]) {
        if (this.router.url === '/browse-substance') {
          this.privateFacetParams = {};
        } else {
          this.privateFacetParams = this.previousFacets[0];
          this.facetBuilder = {};
        }
        this.ngOnInit();
      }

    }, 50);
  }

  @Input()
  set rawFacets(facets: Array<Facet>) {
    this.privateRawFacets = facets || [];
    this.populateFacets();
  }

  @Input()
  set configName(configName: string) {
    this.facetsConfig = this.configService.configData.facets && this.configService.configData.facets[configName] || {};
    this._configName = configName;
    if (configName === 'applications' || configName === 'clinicaltrialsus' || configName === 'products'
    || configName === 'adverseeventpt' || configName === 'adverseeventdme' || configName === 'adverseeventcvm' || configName === 'staging') {
      this.hideDeprecatedCheckbox = true;
    } else {
      this.hideDeprecatedCheckbox = false;
    }
    if(this.calledFrom === 'staging') {
      this.hideDeprecatedCheckbox = true;
      this.stagingFacets = this.configService.configData.facets[configName];
    }
    this.populateFacets();
  }

  @Input()
  set facetDisplayType(facetDisplayType: string) {
    this._facetDisplayType = facetDisplayType;
    this.populateFacets();
  }

  @Input()
  set facetViewCategorySelected(facetViewCategorySelected: string) {
    this._facetViewCategorySelected = facetViewCategorySelected;
    this.populateFacets();
  }

  @Input()
  set facetNameText(facetNameText: string) {
    this._facetNameText = facetNameText;
    this.populateFacets();
  }

  ngOnInit() {
    this.facetString = this.activatedRoute.snapshot.queryParams['facets'] || '';
    const show = this.activatedRoute.snapshot.queryParams['showDeprecated'] || 'false';
    if (show === 'true') {
      this.showDeprecated = true;
    }
    this.facetsFromParams();
    this.setDisplayFacets();
    this.facetsParamsUpdated.emit({
      facetParam: this.privateFacetParams,
      displayFacets: this.displayFacets,
      deprecated: this.showDeprecated
    });
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
    this.urlSearch = this.activatedRoute.snapshot.queryParams['search'] || null;
    if (this.includeFacetSearch) {
      const facetSearchSubscription = this.facetSearchChanged.pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap(event => {
          const facet = this.facets[event.index];
          if (!facet._self) {
            facet._self = this.facetManagerService.generateSelfUrl('stagingArea', facet.name);
          }
          return this.facetsService.getFacetsHandler(facet, event.query, null, this.privateFacetParams, this.urlSearch).pipe(take(1));
        })
      ).subscribe(response => {
        this.activeSearchedFaced.values = this.activeSearchedFaced.values.filter(value => {
          let removeFacet = true;

          let isInSearhResults = false;

          for (const r of response.content) {
            if (r.label === value.label) {
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

  facetsFromParams() {
    if (this.facetString !== '') {
      const categoryArray = this.escapedSplit(this.facetString, ',');
      for (const c of categoryArray) {
        const categorySplit = this.escapedSplit(c, '*');
        const category = categorySplit[0];
        const fieldsArr = this.escapedSplit(categorySplit[1], '+');
        const params: { [facetValueLabel: string]: boolean } = {};
        let hasSelections = false;
        let isAllMatch = false;
        let hasExcludeOption = false;
        let includeOptionsLength = 0;
        for (const f of fieldsArr) {
          const field = this.escapedSplit(f, '.');
          field[0] = this.decodeValue(decodeURIComponent(field[0]));
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
      this.previousFacets.push(JSON.parse(JSON.stringify(this.privateFacetParams)));
    }
  }

  toggleDeprecated(): void {
    this.showDeprecated = !this.showDeprecated;
    setTimeout(() => {
      this.populateUrlQueryParameters(this.showDeprecated);
      this.facetsParamsUpdated.emit({
        facetParam: this.privateFacetParams, displayFacets: this.displayFacets,
        deprecated: this.showDeprecated
      });
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
        let facetKeys = Object.keys(this.facetsConfig) || [];
        if (this._facetDisplayType) {
          if (this._facetDisplayType === 'default' || this.calledFrom === 'staging') {
            facetKeys.forEach(facetKey => {
              if (this.facetsConfig[facetKey].length
                && (facetKey === 'default' || this.authService.hasRoles(facetKey) || (facetKey === 'staging' && this.calledFrom === 'staging'))) {
                this.facetsConfig[facetKey].forEach(facet => {
                  for (let facetIndex = 0; facetIndex < facetsCopy.length; facetIndex++) {
                    this.toggle[facetIndex] = true;
                    if (facet === facetsCopy[facetIndex].name) {

                      // Facet Name Search
                      let facetNameTextFound = true;
                      if ((this._facetNameText) && (this._facetNameText.length > 0)) {
                        facetNameTextFound = false;
                        if (facetsCopy[facetIndex].name.toLowerCase().indexOf(this._facetNameText.toLowerCase().trim()) > -1) {
                          facetNameTextFound = true;
                        }
                      }

                      if (facetNameTextFound === true) {
                        if (facetsCopy[facetIndex].values != null && facetsCopy[facetIndex].values.length) {
                          let hasValues = false;
                          for (let valueIndex = 0; valueIndex < facetsCopy[facetIndex].values.length; valueIndex++) {
                            if (facetsCopy[facetIndex].values[valueIndex].count) {
                              hasValues = true;
                              break;
                            }
                          }

                          if (hasValues) {
                            if (this.showDeprecated === false && facet === 'Deprecated') {
                            } else {
                              const facetToAdd = facetsCopy.splice(facetIndex, 1);
                              facetIndex--;
                              newFacets.push(facetToAdd[0]);
                              this.searchText[facetToAdd[0].name] = { value: '', isLoading: false };
                            }
                          }
                        }
                      }

                      break;
                    }
                  }
                });
              }
            });
          } else if (this._facetDisplayType === 'facetView' && this._facetViewCategorySelected !== 'All') {
            if (this._configName && this._configName === 'substances') {
              this.facetsConfig['facetView'].forEach(categoryRow => {
                const category = categoryRow['category'];
                const categoryFacets = categoryRow['facets'];
                if (category === this._facetViewCategorySelected) {
                  categoryFacets.forEach(facet => {
                    for (let facetIndex = 0; facetIndex < facetsCopy.length; facetIndex++) {
                      this.toggle[facetIndex] = true;
                      if (facet === facetsCopy[facetIndex].name) {
                        // Facet Name Search
                        let facetNameTextFound = true;
                        if ((this._facetNameText) && (this._facetNameText.length > 0)) {
                          facetNameTextFound = false;
                          if (facetsCopy[facetIndex].name.toLowerCase().indexOf(this._facetNameText.toLowerCase().trim()) > -1) {
                            facetNameTextFound = true;
                          }
                        }

                        if (facetNameTextFound === true) {
                          if (facetsCopy[facetIndex].values != null && facetsCopy[facetIndex].values.length) {
                            let hasValues = false;
                            for (let valueIndex = 0; valueIndex < facetsCopy[facetIndex].values.length; valueIndex++) {
                              if (facetsCopy[facetIndex].values[valueIndex].count) {
                                hasValues = true;
                                break;
                              }
                            }

                            if (hasValues) {
                              if (this.showDeprecated === false && facet === 'Deprecated') {
                              } else {
                                const facetToAdd = facetsCopy.splice(facetIndex, 1);
                                facetIndex--;
                                newFacets.push(facetToAdd[0]);
                                this.searchText[facetToAdd[0].name] = { value: '', isLoading: false };
                              }
                            }
                          }
                        }

                        break;
                      }
                    }
                  });
                }
              });
            }
          } else { // Show ALL Facets
            for (let facetIndex = 0; facetIndex < facetsCopy.length; facetIndex++) {
              this.searchText[facetsCopy[facetIndex].name] = { value: '', isLoading: false };
              newFacets.push(facetsCopy[facetIndex]);
            }
          }
        }

        // Set any facets being used to filter results to the top of the facet display
        Object.keys(this.privateFacetParams).forEach(key => {
          const position = newFacets.map(object => object.name).indexOf(key);
          if (position > 0 ) {
            newFacets.unshift(newFacets.splice(position, 1)[0]);
          }
        });
       // console.log(newFacets);
        this.facets = newFacets;
        this.setShowAdvancedFacetStates();
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

  setShowAdvancedFacetStates() {
    // When there is at least one facet param value that is false (aka red/negative)
    // set the advancedState to true. This is run so the user doesn't get confused 
    // by negative selections not showing on page reload. 

    this.facets.forEach( f => {
      if (this.privateFacetParams[f.name] && this.privateFacetParams[f.name].params) {
        Object.keys(this.privateFacetParams[f.name].params).every(sub => {
          if (this.privateFacetParams[f.name].params[sub] !== undefined 
            && this.privateFacetParams[f.name].params[sub] === false  
            ) {
              f.$showAdvanced = true;
              return false;
            }
            return true;
        });
      }
    });
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
            valArr.push(this.encodeValue(subkey) + '.' + cat.params[subkey]);
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

    this.previousState.push(this.router.url);
    const urlTree = this.router.createUrlTree([], {
      queryParams: navigationExtras.queryParams,
      queryParamsHandling: 'merge',
      preserveFragment: true
    });
    this.location.go(urlTree.toString());
  }


  private escapedSplit(value: string, delim: string) {
    return value.match(new RegExp('((.|^)*?([^!]|^))([' + delim + ']|$)', 'g'))
      .map(d => d.replace(new RegExp('[' + delim + ']$', 'g'), ''));
  }

  private encodeValue(facetValue: string) {
    let encFV = facetValue.replace('!', '!@');
    encFV = encFV.replace(/[.]/g, '!.');
    encFV = encFV.replace(/[\+]/g, '!+');
    encFV = encFV.replace(/[,]/g, '!,');
    encFV = encFV.replace(/[\*]/g, '!*');
    return encFV;
  }

  private decodeValue(encFV: string) {
    const decFV = encFV.replace(/!([^@])/g, '$1').replace(/[!][@]/g, '!');
    return decFV;
  }

  private applyFacetsFilter(facetName: string) {
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
    this.facetsParamsUpdated.emit({
      facetParam: this.privateFacetParams,
      displayFacets: this.displayFacets,
      deprecated: this.showDeprecated
    });
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

    // Pass which facet is selected when calling from Advanced Search.
    if (this.calledFrom && this.calledFrom === 'advancedsearch') {
      this.setDisplayFacets();
      this.facetsParamsUpdated.emit({
        facetParam: this.privateFacetParams,
        displayFacets: this.displayFacets,
        deprecated: this.showDeprecated
      });
    }
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
    // This check for _self should be temporary while it's incorporation in the staging area is complete.
    // If no meta fields exist, generate what they are expected to look like
    if (facet.$next == null) {
      if (!facet._self) {
          facet._self = this.facetManagerService.generateSelfUrl('stagingArea', facet.name);
      }
        facet.$next = facet._self.replace('fskip=0', 'fskip=10');
    }
    this.facetManagerService.getFacetsHandler(this.facets[index], '', facet.$next, this.privateFacetParams, this.urlSearch).pipe(take(1)).subscribe(resp => {
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
    this.facetManagerService.getFacetsHandler(this.facets[index], null, null, this.privateFacetParams, this.urlSearch).pipe(take(1)).subscribe(response => {
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
    this.facetSearchChanged.next({ index: index, query: searchTerm, facets: this.privateFacetParams });
  }

  clearFacetSearch(index: number, facetName: string): void {
    this.searchText[facetName].value = '';
    this.filterFacets(index, '', facetName);
  }

  get facetParams(): FacetParam | { showAllMatchOption?: boolean } {
    return this.privateFacetParams;
  }

  editList(list?: string): void {
    let data = {view: 'all'};
    if (list) {
      data.view = 'single';
      data['activeName'] = list.split(':')[1];
    }
   // console.log(data);
    const dialogRef = this.dialog.open(UserQueryListDialogComponent, {
      width: '850px',
      autoFocus: false,
            data: data

    });
   // this.overlayContainer.style.zIndex = '1002';

    const dialogSubscription = dialogRef.afterClosed().pipe(take(1)).subscribe(response => {
      if (response) {
       // this.overlayContainer.style.zIndex = null;
      }
    });
  }
}
