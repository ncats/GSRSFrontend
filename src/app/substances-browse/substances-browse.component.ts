import { Component, OnInit, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail } from '../substance/substance.model';
import { ConfigService } from '../config/config.service';
import * as _ from 'lodash';
import { Facet } from '../utils/facet.model';
import { LoadingService } from '../loading/loading.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import { PageEvent } from '@angular/material';
import { UtilsService } from '../utils/utils.service';
import { MatSidenav } from '@angular/material/sidenav';
import { SafeUrl } from '@angular/platform-browser';
import { SubstanceFacetParam } from '../substance/substance-facet-param.model';

@Component({
  selector: 'app-substances-browse',
  templateUrl: './substances-browse.component.html',
  styleUrls: ['./substances-browse.component.scss']
})
export class SubstancesBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  private privateSearchTerm?: string;
  private privateStructureSearchTerm?: string;
  private privateStructureSearchType?: string;
  private privateStructureSearchCutoff?: number;
  public substances: Array<SubstanceDetail>;
  public facets: Array<Facet> = [];
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

  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    private utilsService: UtilsService
  ) {
    this.privateFacetParams = {};
  }

  ngOnInit() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.activatedRoute
      .queryParamMap
      .subscribe(params => {
        this.privateSearchTerm = params.get('search_term') || '';
        this.privateStructureSearchTerm = params.get('structure_search_term') || '';
        this.privateStructureSearchType = params.get('structure_search_type') || '';
        this.privateStructureSearchCutoff = Number(params.get('structure_search_cutoff')) || 0;
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
    window.addEventListener('resize', this.processResponsiveness);
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.processResponsiveness);
  }

  changePage(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.searchSubstances();
  }

  searchSubstances() {
    this.isLoading = true;
    this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    this.substanceService.getSubtanceDetails(
      this.privateSearchTerm,
      this.privateStructureSearchTerm,
      this.privateStructureSearchType,
      this.privateStructureSearchCutoff,
      true,
      this.pageSize,
      this.privateFacetParams,
      skip,
    )
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

      const numFillFacets = 20 - this.facets.length;

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
    facetName: string
  ) {
    if (this.privateFacetParams[facetName] != null && this.privateFacetParams[facetName].params != null) {
      const facetValueKeys = Object.keys(this.privateFacetParams[facetName].params);
      facetValueKeys.forEach(facetParam => {
        this.privateFacetParams[facetName].params[facetParam] = null;
      });

      this.privateFacetParams[facetName].isAllMatch = false;
      this.privateFacetParams[facetName].showAllMatchOption = false;
      this.privateFacetParams[facetName].hasSelections = false;
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

  get searchTerm(): string {
    return this.privateSearchTerm;
  }

  get structureSearchTerm(): string {
    return this.privateStructureSearchTerm;
  }

  get structureSearchType(): string {
    return this.privateStructureSearchType;
  }

  get structureSearchCutoff(): number {
    return this.privateStructureSearchCutoff;
  }

  get facetParams(): SubstanceFacetParam | { showAllMatchOption?: boolean } {
    return this.privateFacetParams;
  }

  private processResponsiveness = () => {
    if (window.innerWidth < 1100) {
      this.matSideNav.close();
      this.hasBackdrop = true;
    } else {
      this.matSideNav.open();
      this.hasBackdrop = false;
    }
  }

  openSideNav() {
    this.matSideNav.open();
  }

  updateView(event): void {
    this.view = event.value;
  }

}
