import { Component, OnInit, ViewChild, AfterViewInit, HostListener } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-substances-browse',
  templateUrl: './substances-browse.component.html',
  styleUrls: ['./substances-browse.component.scss']
})
export class SubstancesBrowseComponent implements OnInit, AfterViewInit {
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
    private gaService: GoogleAnalyticsService
  ) {
    this.privateFacetParams = {};
  }

  ngOnInit() {
    this.gaService.setTitle('Browse Substances');
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

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.processResponsiveness();
  }

  changePage(pageEvent: PageEvent) {
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

  getSafeStructureImgUrl(structureId: string, size: number = 150): SafeUrl {
    return this.utilsService.getSafeStructureImgUrl(structureId, size);
  }


  updateFacetSelection(
    event: MatCheckboxChange,
    facetName: string,
    facetValueLabel: string,
    include: boolean
  ): void {

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

    const facetKeys = facetName != null ? [facetName] : Object.keys(this.privateFacetParams);

    if (facetKeys != null && facetKeys.length) {
      facetKeys.forEach(facetKey => {
        if (this.privateFacetParams[facetKey] != null && this.privateFacetParams[facetKey].params != null) {
          const facetValueKeys = Object.keys(this.privateFacetParams[facetKey].params);
          facetValueKeys.forEach(facetParam => {
            this.privateFacetParams[facetKey].params[facetParam] = null;
          });

          this.privateFacetParams[facetKey].isAllMatch = false;
          this.privateFacetParams[facetKey].showAllMatchOption = false;
          this.privateFacetParams[facetKey].hasSelections = false;
        }
      });
    }
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

  clearStructureSearch(): void {
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

  clearSequenceSearch(): void {
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
    this.matSideNav.open();
  }

  updateView(event): void {
    this.view = event.value;
  }

  getSequenceDisplay(sequence: string): string {
    if (sequence.length < 16) {
      return sequence;
    } else {
      return `${sequence.substr(0, 15)}...`;
    }
  }

  openImageModal(substance): void {
    if (substance.substanceClass === 'chemical') {
      const dialogRef = this.dialog.open(StructureImageModalComponent, {
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
      const dialogRef = this.dialog.open(StructureImageModalComponent, {
        height: 'auto',
        width: '650px',
        data: {
          structure: substance.polymer.displayStructure.id,
          names: substance.names
        }
      });
    }
  }

}
