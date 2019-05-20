import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ClinicalTrialService } from '../clinical-trial/clinical-trial.service';
import { ClinicalTrial } from '../clinical-trial/clinical-trial.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '../../config/config.service';
import * as _ from 'lodash';
import { Facet } from '../../utils/facet.model';
import { LoadingService } from '../../loading/loading.service';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MainNotificationService } from '../../main-notification/main-notification.service';
import { AppNotification, NotificationType } from '../../main-notification/notification.model';
import { PageEvent, MatPaginatorIntl } from '@angular/material';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-clinical-trials-browse',
  templateUrl: './clinical-trials-browse.component.html',
  styleUrls: ['./clinical-trials-browse.component.scss']
})
export class ClinicalTrialsBrowseComponent implements OnInit {
  private _searchTerm?: string;
  public clinicalTrials: Array<ClinicalTrial>;
  public facets: Array<Facet> = [];
  private _facetParams: { [facetName: string]: { [facetValueLabel: string]: boolean } } = {};
  pageIndex: number;
  pageSize: number;
  totalClinicalTrials: number;
  isLoading = true;
  isError = false;

  displayedColumns: string[] = ['edit', 'nctNumber', 'title', 'lastUpdated'];
  dataSource = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private clinicalTrialService: ClinicalTrialService,
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
        this.searchClinicalTrials();
      });

  }

  changePage(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.searchClinicalTrials();
  }
  myAlert(s) {
    console.log("S "+s);
  }
  searchClinicalTrials() {
    this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    this.clinicalTrialService.getClinicalTrials(
      skip,
      this.pageSize
    )
      .subscribe(pagingResponse => {
        this.isError = false;
        this.clinicalTrials = pagingResponse.content;
        // didn't work unless I did it like this instead of
        // below export statement
        this.dataSource = this.clinicalTrials;
        console.log(JSON.stringify(this.clinicalTrials));
        this.totalClinicalTrials = pagingResponse.total;
        this.facets = [];
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          // this.populateFacets(pagingResponse.facets);
        }

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
    this.searchClinicalTrials();

  }

  get searchTerm(): string {
    return this._searchTerm;
  }

  get facetParams(): { [facetName: string]: { [facetValueLabel: string]: boolean } } {
    return this._facetParams;
  }

}
