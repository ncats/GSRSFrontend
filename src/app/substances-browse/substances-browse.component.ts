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

@Component({
  selector: 'app-substances-browse',
  templateUrl: './substances-browse.component.html',
  styleUrls: ['./substances-browse.component.scss']
})
export class SubstancesBrowseComponent implements OnInit, AfterViewInit, OnDestroy {
  private _searchTerm?: string;
  private _structureSearchTerm?: string;
  private _structureSearchType?: string;
  private _structureSearchCutoff?: number;
  public substances: Array<SubstanceDetail>;
  public facets: Array<Facet> = [];
  private _facetParams: { [facetName: string]: { [facetValueLabel: string]: boolean } } = {};
  pageIndex: number;
  pageSize: number;
  totalSubstances: number;
  isLoading = true;
  isError = false;
  @ViewChild('matSideNavInstance') matSideNav: MatSidenav;
  hasBackdrop = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this.activatedRoute
      .queryParamMap
      .subscribe(params => {
        this._searchTerm = params.get('search_term') || '';
        this._structureSearchTerm = params.get('structure_search_term') || '';
        this._structureSearchType = params.get('structure_search_type') || '';
        this._structureSearchCutoff = Number(params.get('structure_search_cutoff')) || 0;
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
    this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    this.substanceService.getSubtanceDetails(
      this._searchTerm,
      this._structureSearchTerm,
      this._structureSearchType,
      this._structureSearchCutoff,
      true,
      this.pageSize,
      this._facetParams,
      skip,
    )
      .subscribe(pagingResponse => {
        this.isError = false;
        this.substances = pagingResponse.content;
        this.totalSubstances = pagingResponse.total;
        this.facets = [];
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
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


  updateFacetSelection(event: MatCheckboxChange, facetName: string, facetValueLabel: string): void {

    if (this._facetParams[facetName] == null) {
      this._facetParams[facetName] = {};
    }

    this._facetParams[facetName][facetValueLabel] = event.checked;

    let facetHasSelectedValue = false;

    const facetValueKeys = Object.keys(this._facetParams[facetName]);
    for (let i = 0; i < facetValueKeys.length; i++) {
      if (this._facetParams[facetName][facetValueKeys[i]]) {
        facetHasSelectedValue = true;
        break;
      }
    }

    if (!facetHasSelectedValue) {
      this._facetParams[facetName] = undefined;
    }
    this.pageIndex = 0;
    this.searchSubstances();

  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  get structureSearchTerm(): string {
    return this._structureSearchTerm;
  }

  get structureSearchType(): string {
    return this._structureSearchType;
  }

  get structureSearchCutoff(): number {
    return this._structureSearchCutoff;
  }

  get facetParams(): { [facetName: string]: { [facetValueLabel: string]: boolean } } {
    return this._facetParams;
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

}
