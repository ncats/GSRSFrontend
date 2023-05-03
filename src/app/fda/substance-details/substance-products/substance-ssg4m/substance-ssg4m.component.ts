import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { AuthService } from '@gsrs-core/auth';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ImpuritiesService } from '../../../impurities/service/impurities.service';
import { GeneralService } from '../../../service/general.service';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { SubstanceDetailsBaseTableDisplay } from '../substance-details-base-table-display';
import { Impurities, ImpuritiesTesting, ImpuritiesDetails, IdentityCriteria } from '../../../impurities/model/impurities.model';
import { Facet } from '@gsrs-core/facets-manager';
import { FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { SubstanceSsg4mService } from '@gsrs-core/substance-ssg4m/substance-ssg4m-form.service';

@Component({
  selector: 'app-substance-ssg4m',
  templateUrl: './substance-ssg4m.component.html',
  styleUrls: ['./substance-ssg4m.component.scss']
})
export class SubstanceSsg4mComponent extends SubstanceDetailsBaseTableDisplay implements OnInit, OnDestroy {

  @Input() substanceUuid: string;
  @Input() substanceName: string;
  @Output() countSsg4mOut: EventEmitter<number> = new EventEmitter<number>();
  private subscriptions: Array<Subscription> = [];
  parentSubstance: string;
  parentSubstanceUuid: string;
  showSpinner = false;
  impurities: Array<Impurities>;
  totalImpurities = 0;
  impuritiesCount = 0;
  impuritiesTestTotal = 0;
  pageIndex = 0;
  pageSize = 5;
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  privateExport = false;
  disableExport = false;
  etag = '';
  order = '$root_productSubstanceName';
  ascDescDir = 'desc';
  displayedColumns: string[] = [
    'substanceName',
    'substanceRole'
  ];

  constructor(
    private router: Router,
    public gaService: GoogleAnalyticsService,
    private ssg4mService: SubstanceSsg4mService,
    private generalService: GeneralService,
    private authService: AuthService,
    private loadingService: LoadingService,
    private dialog: MatDialog
  ) {
    super(gaService, ssg4mService);
  }

  ngOnInit() {
    const rolesSubscription = this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
      this.isAdmin = response;
    });
    this.subscriptions.push(rolesSubscription);

    if (this.substanceUuid) {
      this.getSsg4mBySubstanceUuid();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  getSsg4mBySubstanceUuid(pageEvent?: PageEvent) {
    this.showSpinner = true;  // Start progress spinner

    this.setPageEvent(pageEvent);
    const skip = this.page * this.pageSize;

    this.ssg4mService.getSyntheticPathwayIndexBySubUuid(this.substanceUuid).subscribe(results => {
        this.totalRecords = results.;
        this.setResultData(pagingResponse.content);
        this.productCount = pagingResponse.total;
        this.etag = pagingResponse.etag;
      }
    }, error => {
      this.showSpinner = false;  // Stop progress spinner
      console.log('error');
    }, () => {
      this.showSpinner = false;  // Stop progress spinner
      subscription.unsubscribe();
    });
    this.loadingStatus = '';
    // this.showSpinner = false;  // Stop progress spinner
  }



    });
    /*
    // , this.page, this.pageSize
    this.impuritiesService.getImpuritiesBySubstanceUuid(
      this.order,
      skip,
      this.pageSize,
      this.substanceUuid,
      this.privateFacetParams).subscribe(results => {
        this.impuritiesService.totalRecords = results.total;
        this.impurities = results.content;

        // Load Impurities Test Details by Substance Uuid
       // this.loadImpuritiesTestDetails();

        this.setResultData(this.impurities);

        this.totalImpurities = results.total;

        this.etag = results.etag;
        this.countImpuritiesOut.emit(this.totalImpurities);
      });
    */
    this.showSpinner = false;  // Stop progress spinner
  }

}
