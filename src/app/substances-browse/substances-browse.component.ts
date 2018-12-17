import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceDetail } from '../substance/substance.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../config/config.service';
import * as _ from 'lodash';
import { Facet } from '../utils/facet.model';
import { LoadingService } from '../loading/loading.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MainNotificationService } from '../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../main-notification/notification.model';
import { PageEvent } from '@angular/material';

@Component({
  selector: 'app-substances-browse',
  templateUrl: './substances-browse.component.html',
  styleUrls: ['./substances-browse.component.scss']
})
export class SubstancesBrowseComponent implements OnInit {
  private _searchTerm?: string;
  private _structureSearchTerm?: string;
  private _structureSearchType?: string;
  private _structureSearchCutoff?: number;
  public substances: Array<SubstanceDetail>;
  public facets: Array<Facet>;
  private _facetParams: { [facetName: string]: { [facetValueLabel: string]: boolean } } = {};
  pageIndex: number;
  pageSize: number;
  totalSubstances: number;
  // paginator: MatPaginator;
  // // pageSizeOptions: [5, 10, 50, 100];
  // @ViewChild(MatPaginator) set appBacon(paginator: MatPaginator) {
  //   this.paginator = paginator;
  // }
  isLoading = true;
  isError = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    private sanitizer: DomSanitizer,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService
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
      if (pagingResponse.facets && pagingResponse.facets.length > 0) {
        let sortedFacets = _.orderBy(pagingResponse.facets, facet => {
          let valuesTotal = 0;
          facet.values.forEach(value => {
            valuesTotal += value.count;
          });
          return valuesTotal;
        }, 'desc');
        this.facets = _.take(sortedFacets, 10);
        sortedFacets = null;
      } else {
        this.facets = [];
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

  getSafeStructureImgUrl(structureId: string): SafeUrl {

    const imgUrl = `${this.configService.configData.apiBaseUrl}img/${structureId}.svg?size=150`;

    return this.sanitizer.bypassSecurityTrustUrl(imgUrl);
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

}
