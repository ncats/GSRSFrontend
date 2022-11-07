import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ClinicalTrialService } from '../../../clinical-trials/clinical-trial/clinical-trial.service';
import { SubstanceDetailsBaseTableDisplay } from '../../substance-products/substance-details-base-table-display';
import { PageEvent } from '@angular/material/paginator';
import { FacetParam } from '@gsrs-core/facets-manager';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { Subscription, Observable, Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { ConfigService, LoadedComponents } from '@gsrs-core/config';
import { ExportDialogComponent } from '@gsrs-core/substances-browse/export-dialog/export-dialog.component';
import { take } from 'rxjs/operators';
import * as _ from 'lodash';

@Component({
  selector: 'app-substance-clinical-trials-eu',
  templateUrl: './substance-clinical-trials-eu.component.html',
  styleUrls: ['./substance-clinical-trials-eu.component.scss']
})

export class SubstanceClinicalTrialsEuropeComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {
  private privateFacetParams: FacetParam;
  clinicalTrialEuCount = 0;
  showSpinner = false;
  private subscriptions: Array<Subscription> = [];

  privateExport = false;
  disableExport = false;
  etag = '';
  etagAllExport = '';
  loadedComponents: LoadedComponents;
  loadingStatus = '';

  @Input() substanceUuid: string;
  @Output() countClinicalTrialEuOut: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = [
    'trialNumber',
    'title',
    'sponsorName',
    'conditions'
  ];

  constructor(
    public gaService: GoogleAnalyticsService,
    private clinicalTrialService: ClinicalTrialService,
    private configService: ConfigService,
    public authService: AuthService,
    private loadingService: LoadingService,
    private router: Router,
    private dialog: MatDialog
  ) {
    super(gaService, clinicalTrialService);
  }

  ngOnInit() {
    this.loadedComponents = this.configService.configData.loadedComponents || null;
    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').pipe(take(1)).subscribe(response => {
      this.isAdmin = response;
    });
    if (this.substanceUuid) {
     this.getSubstanceClinicalTrialsEurope(null, 'initial');
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getSubstanceClinicalTrialsEurope(pageEvent?: PageEvent, searchType?: string): void {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    const subscriptionClinical = this.clinicalTrialService.getSubstanceClinicalTrialsEurope(
      this.substanceUuid, this.page, this.pageSize
    )
      .subscribe(pagingResponse => {
        if (searchType && searchType === 'initial') {
          this.etagAllExport = pagingResponse['etag'];
        }
        this.setResultData(pagingResponse['content']);
        this.clinicalTrialEuCount = pagingResponse['total'];
        this.countClinicalTrialEuOut.emit(this.clinicalTrialEuCount);
        this.showSpinner = false;  // Stop progress spinner
      });
    /*
        this.searchControl.valueChanges.subscribe(value => {
          this.filterList(value, this.clinicaltrials, this.analyticsEventCategory);
        }, error => {
          console.log(error);
        });
        this.countUpdate.emit(clinicaltrials.length);
      });
      */
     this.subscriptions.push(subscriptionClinical);
  }


  export() {
    if (this.etagAllExport) {
      const extension = 'cteu.xlsx';
      const url = this.getApiExportUrl(this.etagAllExport, extension);
      if (this.authService.getUser() !== '') {
        const dialogReference = this.dialog.open(ExportDialogComponent, {
        //  height: '215x',
          width: '700px',
          data: { 'extension': extension, 'type': 'substanceClinicalTrialEU', 'hideOptionButtons': true }
        });
        // this.overlayContainer.style.zIndex = '1002';
        dialogReference.afterClosed().subscribe(response => {
          // this.overlayContainer.style.zIndex = null;
          const name = response.name;
          if (name && name !== '') {
            this.loadingService.setLoading(true);
            const fullname = name + '.' + extension;
            this.authService.startUserDownload(url, this.privateExport, fullname).subscribe(response => {
              this.loadingService.setLoading(false);
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  totalSub: this.clinicalTrialEuCount
                }
              };
              const params = { 'total': this.clinicalTrialEuCount };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.clinicalTrialService.getApiEuropeExportUrl(etag, extension);
  }


// delete this?
//  clinicalTrialListExportUrl() {
//    if (this.substanceUuid != null) {
//      this.exportUrl = this.clinicalTrialService.getClinicalTrialEuropeListExportUrl(this.substanceUuid);
//    }
//  }

  /*
  // copied from products but has no effect. Make approaoch uniform in future.
  tabSelected($event) {
    if ($event) {
      console.log("EVENT");
      const evt: any = $event.tab;
      const textLabel: string = evt.textLabel;
      if (textLabel != null) {
        this.loadingStatus = 'Loading data...';
        this.paged = [];
        this.getSubstanceClinicalTrials();
      }

  */
  joinMeddraTerms(cteu: any) {
    if(cteu) {
      // const a =[{"meddraTerm": "meddraTerm1"}, {"meddraTerm": "meddraTerm2"},{"meddraTerm": "meddraTerm3"},{"meddraTerm": "meddraTerm4"}];
      return _.map(cteu.clinicalTrialEuropeMeddraList, 'meddraTerm').join("|");
    }
  }
}