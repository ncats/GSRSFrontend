import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { ApplicationService } from '../service/application.service';
import { ApplicationSrs } from '../model/application.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
//import * as _ from 'lodash';
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
  selector: 'app-applications-browse',
  templateUrl: './applications-browse.component.html',
  styleUrls: ['./applications-browse.component.scss']
})
export class ApplicationsBrowseComponent implements OnInit {
  public _searchTerm?: string;
  public applications: Array<ApplicationSrs>;
  public facets: Array<Facet> = [];
  private _facetParams: { [facetName: string]: { [facetValueLabel: string]: boolean } } = {};
  pageIndex: number;
  pageSize: number;
  jumpToValue: string;
  totalApplications: number;
  isLoading = true;
  isError = false;
  isAdmin: boolean;
  displayedColumns: string[];
  dataSource = [];

  constructor(
    private applicationService: ApplicationService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private locationStrategy: LocationStrategy,
    private router: Router,
    private sanitizer: DomSanitizer,
    public configService: ConfigService,
    private loadingService: LoadingService,
    private notificationService: MainNotificationService,
    private authService: AuthService
  ) {
  }

  ngOnInit() {

    //this.applicationService.getApplications();
    
    /*
    this.authService.hasRolesAsync('admin').subscribe(response => {
      this.isAdmin = response;
      // console.log('clinical-trial-edit isAdmin: ' + this.isAdmin);
      if (this.isAdmin) {
        this.displayedColumns = ['edit', 'nctNumber', 'title', 'lastUpdated', 'delete'];
       } else {
         this.displayedColumns = ['edit', 'nctNumber', 'title', 'lastUpdated'];
       }
    });
    */

    this.pageSize = 10;
    this.pageIndex = 0;
    this._searchTerm = '';

    this.activatedRoute.queryParamMap.subscribe(params => {
      if (params.get('pageSize')) {
        this.pageSize = parseInt(params.get('pageSize'), null);
      }
      if (params.get('pageIndex')) {
        this.pageIndex = parseInt(params.get('pageIndex'), null);
      }
      this.searchApplications();
    });
    
  } 

  searchApplications() {
    this.loadingService.setLoading(true);
    const skip = this.pageIndex * this.pageSize;
    this.applicationService.getApplications(
      skip,
      this.pageSize,
      this._searchTerm
    )
      .subscribe(pagingResponse => {
        this.isError = false;
        this.applications = pagingResponse.content;
        // didn't work unless I did it like this instead of
        // below export statement
        this.dataSource = this.applications;
        this.totalApplications = pagingResponse.total;
        this.facets = [];
        if (pagingResponse.facets && pagingResponse.facets.length > 0) {
          // this.populateFacets(pagingResponse.facets);
        }
      }, error => {
        const notification: AppNotification = {
          message: 'There was an error trying to retrieve Applicationss. Please refresh and try again.',
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
      this.populateUrlQueryParameters()
  }


  changePage(pageEvent: PageEvent) {
    this.pageSize = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    //this.searchClinicalTrials();
  }

  setSearchTermValue() {
    this.pageSize = 10;
    this.pageIndex = 0;
    this._searchTerm = this._searchTerm.trim();
    this.searchApplications();
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
    //this.searchClinicalTrials();

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
  navigationExtras.queryParams['searchTerm'] = this._searchTerm;

  this.location.replaceState(
    this.router.createUrlTree(
      [this.locationStrategy.path().split('?')[0].replace(this.configService.environment.baseHref, '')],
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

  get searchTerm(): string {
    return this._searchTerm;
  }

  get facetParams(): { [facetName: string]: { [facetValueLabel: string]: boolean } } {
    return this._facetParams;
  }


}
