import { Component, OnInit, ViewChild, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail } from '../substance/substance.model';
import { ConfigService } from '../config/config.service';
import * as _ from 'lodash';
import { Facet } from '../utils/facet.model';
import { LoadingService } from '../loading/loading.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import {MatDialog, PageEvent} from '@angular/material';
import { UtilsService } from '../utils/utils.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SafeUrl } from '@angular/platform-browser';
import { SubstanceFacetParam } from '../substance/substance-facet-param.model';
import { TopSearchService } from '../top-search/top-search.service';
import {StructureImportComponent} from '../structure/structure-import/structure-import.component';
import {StructureImageModalComponent} from '../structure/structure-image-modal/structure-image-modal.component';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-substances-browse',
  templateUrl: './substances-browse.component.html',
  styleUrls: ['./substances-browse.component.scss']
})
export class SubstancesBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  private privateSearchTerm?: string;
  private privateStructureSearchTerm?: string;
  private privateSequenceSearchTerm?: string;
  private privateSearchType?: string;
  private privateSearchCutoff?: number;
  private privateSearchSeqType?: string;
  public substances: Array<SubstanceDetail>;
  public facets: Array<Facet>;
  private privateFacetParams: SubstanceFacetParam;
  pageIndex: number;
  pageSize: number;
  totalSubstances: number;
  isLoading = true;
  isError = false;
  @ViewChild('matSideNavInstance') matSideNav: MatSidenav;
  hasBackdrop = false;
  view = 'cards';
  displayedColumns: string[] = ['name', 'approvalID', 'names', 'codes'];
  public smiles: string;
  private argsHash?: number;

  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    public utilsService: UtilsService,
    private router: Router,
    private dialog: MatDialog,
    private topSearchService: TopSearchService,
    public gaService: GoogleAnalyticsService
  ) {
    this.privateFacetParams = {};
  }

  ngOnInit() {
    this.gaService.sendPageView('Browse Substances', 'start');
    this.pageSize = 10;
    this.pageIndex = 0;
    this.facets = [];
    this.activatedRoute
      .queryParamMap
      .subscribe(params => {
        this.privateSearchTerm = params.get('search') || '';
        this.privateStructureSearchTerm = params.get('structure_search') || '';
        this.privateSequenceSearchTerm = params.get('sequence_search') || '';
        this.privateSearchType = params.get('type') || '';
        this.privateSearchCutoff = Number(params.get('cutoff')) || 0;
        this.privateSearchSeqType = params.get('seq_type') || '';
        this.smiles = params.get('smiles') || '';
        this.searchSubstances();
      });
  }

  ngAfterViewInit() {
    this.matSideNav.openedStart.subscribe(() => {
      this.utilsService.handleMatSidenavOpen(1100);
    });
    this.matSideNav.closedStart.subscribe(() => {
      this.utilsService.handleMatSidenavClose();
    });
  }

  ngOnDestroy() {
    this.gaService.sendPageView('Browse Substances', 'end');
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

    this.gaService.sendEvent('substancesContent', eventAction, 'pager', eventValue);

    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.searchSubstances();
  }

  searchSubstances() {

    const newArgsHash = this.utilsService.hashCode(
      this.privateSearchTerm,
      this.privateStructureSearchTerm,
      this.privateSequenceSearchTerm,
      this.privateSearchCutoff,
      this.privateSearchType,
      this.privateSearchSeqType,
      this.pageSize,
      this.privateFacetParams,
      (this.pageIndex * this.pageSize),
    );
    if (this.argsHash == null || this.argsHash !== newArgsHash) {
      this.isLoading = true;
      this.loadingService.setLoading(true);
      this.argsHash = newArgsHash;
      const skip = this.pageIndex * this.pageSize;
      this.substanceService.getSubtanceDetails({
        searchTerm: this.privateSearchTerm,
        structureSearchTerm: this.privateStructureSearchTerm,
        sequenceSearchTerm: this.privateSequenceSearchTerm,
        cutoff: this.privateSearchCutoff,
        type: this.privateSearchType,
        seqType: this.privateSearchSeqType,
        pageSize: this.pageSize,
        facets: this.privateFacetParams,
        skip: skip
      })
        .subscribe(pagingResponse => {
          this.isError = false;
          this.substances = pagingResponse.content;
          this.totalSubstances = pagingResponse.total;
          if (pagingResponse.facets && pagingResponse.facets.length > 0) {
            this.facets = [];
            this.populateFacets(pagingResponse.facets);
          }

          if (this.facets.length > 0) {
            this.processResponsiveness();
          } else {
            this.matSideNav.close();
          }

          this.substances.forEach((substance: SubstanceDetail) => {
            if (substance.codes && substance.codes.length > 0) {
              substance.codeSystemNames = [];
              substance.codeSystems = {};
              _.forEach(substance.codes, code => {
                if (substance.codeSystems[code.codeSystem]) {
                  substance.codeSystems[code.codeSystem].push(code);
                } else {
                  substance.codeSystems[code.codeSystem] = [code];
                  substance.codeSystemNames.push(code.codeSystem);
                }
              });
            }
          });
          this.cleanFacets();
        }, error => {
          const notification: AppNotification = {
            message: 'There was an error trying to retrieve substances. Please refresh and try again.',
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

                if (hasValues) {
                  const facetToAdd = facets.splice(facetIndex, 1);
                  facetIndex--;
                  this.facets.push(facetToAdd[0]);
                }
              }
              break;
            }
          }
        });
      }
    }

    if (this.facets.length < 15) {

      const numFillFacets = 15 - this.facets.length;

      let sortedFacets = _.orderBy(facets, facet => {
        let valuesTotal = 0;
        facet.values.forEach(value => {
          valuesTotal += value.count;
        });
        return valuesTotal;
      }, 'desc');
      const additionalFacets = _.take(sortedFacets, numFillFacets);
      this.facets = this.facets.concat(additionalFacets);
      sortedFacets = null;
    }
  }

  applyFacetsFilter(facetName: string) {
    const eventLabel = environment.isAnalyticsPrivate ? 'facet' : `${facetName}`;
    let eventValue = 0;
    Object.keys(this.privateFacetParams).forEach(key => {
      if (this.privateFacetParams[key].params) {
        eventValue = eventValue + Object.keys(this.privateFacetParams[key].params).length || 0;
      }
    });
    this.gaService.sendEvent('substancesFiltering', 'button:apply-facet', eventLabel, eventValue);
    this.searchSubstances();
  }

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size);
  }


  updateFacetSelection(
    event: MatCheckboxChange,
    facetName: string,
    facetValueLabel: string,
    include: boolean
  ): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'facet' : `${facetName} > ${facetValueLabel}`;
    const eventValue = event.checked ? 1 : 0;
    const eventAction = include ? 'include' : 'exclude';
    this.gaService.sendEvent('substancesFiltering', `check:facet-${eventAction}`, eventLabel, eventValue);

    if (this.privateFacetParams[facetName] == null) {
      this.privateFacetParams[facetName] = {
        params: {}
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

    const eventLabel = environment.isAnalyticsPrivate ? 'facet' : `facet: ${facetName}`;
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

    this.gaService.sendEvent('substancesFiltering', 'button:clear-facet', eventLabel, eventValue);
  }

  cleanFacets(): void {
    if (this.privateFacetParams != null) {
      const facetParamsKeys = Object.keys(this.privateFacetParams);
      if (facetParamsKeys && facetParamsKeys.length > 0) {
        facetParamsKeys.forEach(key => {
          if (this.privateFacetParams[key] && !this.privateFacetParams[key].hasSelections) {
            this.privateFacetParams[key] = undefined;
          }
        });
      }
    }
  }

  editStructureSearh(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'structure search term' :
      `${this.privateStructureSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-structure-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['structure'] = this.privateStructureSearchTerm || null;
    navigationExtras.queryParams['type'] = this.privateSearchType || null;

    if (this.privateSearchType === 'similarity') {
      navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff || 0;
    }

    this.router.navigate(['/structure-search'], navigationExtras);
  }

  clearStructureSearch(): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'structure search term' :
      `${this.privateStructureSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-structure-search', eventLabel);

    // automatically calls searchSubstances() because of subscription to route changes
    // route query params change in order to clear search query param
    this.privateStructureSearchTerm = '';
    this.privateSearchType = '';
    this.privateSearchCutoff = 0;
    this.smiles = '';
    this.pageIndex = 0;
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          'structure_search': null,
          'type': null,
          'cutoff': null,
          'smiles': null
        },
        queryParamsHandling: 'merge'
      }
    );
  }

  editSequenceSearh(): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'sequence search term' :
      `${this.privateSequenceSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}-${this.privateSearchSeqType}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:edit-sequence-search', eventLabel);

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['sequence'] = this.privateSequenceSearchTerm || null;
    navigationExtras.queryParams['type'] = this.privateSearchType || null;
    navigationExtras.queryParams['cutoff'] = this.privateSearchCutoff || 0;
    navigationExtras.queryParams['seq_type'] = this.privateSearchSeqType || null;

    this.router.navigate(['/sequence-search'], navigationExtras);
  }

  clearSequenceSearch(): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'sequence search term' :
      `${this.privateSequenceSearchTerm}-${this.privateSearchType}-${this.privateSearchCutoff}-${this.privateSearchSeqType}`;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-sequence-search', eventLabel);

    // automatically calls searchSubstances() because of subscription to route changes
    // route query params change in order to clear search query param
    this.privateSequenceSearchTerm = '';
    this.privateSearchType = '';
    this.privateSearchCutoff = 0;
    this.privateSearchSeqType = '';
    this.pageIndex = 0;
    this.router.navigate(
      [],
      {
        relativeTo: this.activatedRoute,
        queryParams: {
          'sequence_search': null,
          'type': null,
          'cutoff': null,
          'seq_type': null
        },
        queryParamsHandling: 'merge'
      }
    );
  }

  clearSearch(): void {

    const eventLabel = environment.isAnalyticsPrivate ? 'search term' : this.privateSearchTerm;
    this.gaService.sendEvent('substancesFiltering', 'icon-button:clear-search', eventLabel);

    // automatically calls searchSubstances() because of subscription to route changes
    // route query params change in order to clear search query param
    this.privateSearchTerm = '';
    this.pageIndex = 0;
    this.topSearchService.clearSearch();
  }

  clearFilters(): void {
    this.clearFacetSelection();
    if (this.privateStructureSearchTerm != null && this.privateStructureSearchTerm !== '') {
      this.clearStructureSearch();
    } else if (this.privateSequenceSearchTerm != null && this.privateSequenceSearchTerm !== '') {
      this.clearSequenceSearch();
    } else {
      this.clearSearch();
    }
  }

  get searchTerm(): string {
    return this.privateSearchTerm;
  }

  get structureSearchTerm(): string {
    return this.privateStructureSearchTerm;
  }

  get sequenceSearchTerm(): string {
    return this.privateSequenceSearchTerm;
  }

  get searchType(): string {
    return this.privateSearchType;
  }

  get searchCutoff(): number {
    return this.privateSearchCutoff;
  }

  get searchSeqType(): string {
    return this.privateSearchSeqType;
  }

  get facetParams(): SubstanceFacetParam | { showAllMatchOption?: boolean } {
    return this.privateFacetParams;
  }

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

  openSideNav() {
    this.gaService.sendEvent('substancesFiltering', 'button:sidenav', 'open');
    this.matSideNav.open();
  }

  updateView(event): void {
    this.gaService.sendEvent('substancesContent', 'button:view-update', event.value);
    this.view = event.value;
  }

  getSequenceDisplay(sequence: string): string {
    if (sequence.length < 16) {
      return sequence;
    } else {
      return `${sequence.substr(0, 15)}...`;
    }
  }

  openImageModal(substance: SubstanceDetail): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'substance' : substance._name;

    this.gaService.sendEvent('substancesContent', 'link:structure-zoom', eventLabel);

    if (substance.substanceClass === 'chemical') {
      this.dialog.open(StructureImageModalComponent, {
        height: 'auto',
        width: '650px',
        data: {
          structure: substance.structure.id,
          smiles: substance.structure.smiles,
          uuid: substance.uuid,
          names: substance.names
        }
      });
    } else {
      this.dialog.open(StructureImageModalComponent, {
        height: 'auto',
        width: '650px',
        data: {
          structure: substance.polymer.displayStructure.id,
          names: substance.names
        }
      });
    }
  }

  sendFacetsEvent(event: MatCheckboxChange, facetName: string): void {
    const eventLabel = environment.isAnalyticsPrivate ? 'facet' : `${facetName}`;
    const eventValue = event.checked ? 1 : 0;
    this.gaService.sendEvent('substancesFiltering', 'check:match-all', eventLabel, eventValue);
  }

}
