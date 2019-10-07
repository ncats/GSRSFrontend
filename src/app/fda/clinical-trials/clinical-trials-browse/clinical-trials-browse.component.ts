import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ClinicalTrialService } from '../clinical-trial/clinical-trial.service';
import { ClinicalTrial } from '../clinical-trial/clinical-trial.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
import * as _ from 'lodash';
import { Facet } from '@gsrs-core/utils';
import { LoadingService } from '@gsrs-core/loading';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { AppNotification, NotificationType } from '@gsrs-core/main-notification';
import { PageEvent, MatPaginatorIntl } from '@angular/material';
import { MatTableModule } from '@angular/material/table';
import {AuthService} from '@gsrs-core/auth/auth.service';
import { Location, LocationStrategy } from '@angular/common';

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
  jumpToValue: String;
  totalClinicalTrials: number;
  isLoading = true;
  isError = false;
  isAdmin: boolean;
  displayedColumns: string[];
  dataSource = [];

  constructor(
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private router: Router,
    private clinicalTrialService: ClinicalTrialService,
    private sanitizer: DomSanitizer,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {

    this.authService.hasRolesAsync('admin').subscribe(response => {
      this.isAdmin = response;
      console.log('clinical-trial-edit isAdmin: ' + this.isAdmin);
      if (this.isAdmin) {
        this.displayedColumns = ['edit', 'nctNumber', 'title', 'lastUpdated', 'delete'];
       } else {
         this.displayedColumns = ['edit', 'nctNumber', 'title', 'lastUpdated'];
       }
    });
    this.pageSize = 10;
    this.pageIndex = 0;
    this.activatedRoute.queryParamMap.subscribe(params => {
      if (params.get('pageSize')) {
        this.pageSize = parseInt(params.get('pageSize'), null);
      }
      if (params.get('pageIndex')) {
        this.pageIndex = parseInt(params.get('pageIndex'), null);
      }
      this.searchClinicalTrials();
    });
  }

  changePage(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.searchClinicalTrials();
  }
  myAlert(s) {
    // console.log("S "+s);
  }

  mytest()  {
    let x = null;
    this.clinicalTrialService.getSubstanceDetailsFromName('OXYTOCIN')
    .subscribe(detailsResponse => {
      x = detailsResponse.uuid;
      console.log('Getting details');
    }, error => {
      x = 'ERROR';
      console.log('There was an error getting details');
     }, () => {
      x = 'I am here.';
      console.log('Getting details I am here');
    });
    return x;
  }

  jumpToClinicalTrial() {
    if (this.jumpToValue === null) {
      alert('Undefined NCT Number.');
      return;
    }
    this.jumpToValue = this.jumpToValue.trim();
    if (!(this.jumpToValue.match('^NCT\\d+'))) {
      alert('Bad NCT Number.');
      return;
    }
    this.router.navigate(['/edit-clinical-trial', this.jumpToValue]);
  }

  deleteClinicalTrial(id) {
    this.loadingService.setLoading(true);
    this.clinicalTrialService.deleteClinicalTrial(id)
      .subscribe(result => {
        this.isError = false;
        let i = 0;
        this.dataSource.forEach(element => {
            if (element.nctNumber === id) {
                this.dataSource.splice(i, 1);

                console.log('clinical-trials-browse ui found item to delete.');
              }
              i++;
        });
        const notification: AppNotification = {
          message: 'You deleted the clinical trial record for:' + id,
          type: NotificationType.success,
          milisecondsToShow: 6000
        };
        this.isError = false;
        this.isLoading = false;
        this.loadingService.setLoading(this.isLoading);
        this.notificationService.setNotification(notification);
        this.searchClinicalTrials();

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
    this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    // let y = this.mytest2();
    // console.log("printing");
    // console.log(y);


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
      this.populateUrlQueryParameters();
  }

  populateUrlQueryParameters(): void {
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    const catArr = [];
    let facetString = '';
    facetString = catArr.join(',');
    navigationExtras.queryParams['pageSize'] = this.pageSize;
    navigationExtras.queryParams['pageIndex'] = this.pageIndex;
    navigationExtras.queryParams['facets'] = facetString;
    navigationExtras.queryParams['skip'] = this.pageIndex * this.pageSize;
    this.location.replaceState(
      this.router.createUrlTree(
        [this.locationStrategy.path().split('?')[0]],
        navigationExtras
      ).toString()
    );
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
