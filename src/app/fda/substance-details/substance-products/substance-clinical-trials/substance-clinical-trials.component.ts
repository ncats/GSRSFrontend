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


@Component({
  selector: 'app-substance-clinical-trials',
  templateUrl: './substance-clinical-trials.component.html',
  styleUrls: ['./substance-clinical-trials.component.scss']
})

export class SubstanceClinicalTrialsComponent extends SubstanceDetailsBaseTableDisplay implements OnInit {

  private privateFacetParams: FacetParam;
  clinicalTrialCount = 0;
  showSpinner = false;
  private subscriptions: Array<Subscription> = [];

  privateExport = false;
  disableExport = false;
  etag = '';
  etagAllExport = '';
  loadedComponents: LoadedComponents;
  loadingStatus = '';


  @Input() substanceUuid: string;
  @Output() countClinicalTrialOut: EventEmitter<number> = new EventEmitter<number>();

  displayedColumns: string[] = [
    'nctNumber',
    'title',
    'sponsorName',
    'conditions',
    'outcomemeasures'
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

//  ngOnInit() {
//    if (this.substanceUuid) {
//      this.getSubstanceClinicalTrials();
//      this.clinicalTrialListExportUrl();
//    }
//  }

  ngOnInit() {
    this.loadedComponents = this.configService.configData.loadedComponents || null;
    this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').pipe(take(1)).subscribe(response => {
      this.isAdmin = response;
    });
    if (this.substanceUuid) {
      // this.getSubstanceKey();


      // this.privateSearch = 'root_productIngredientAllList_substanceUuid:\"' + this.substance.uuid + '"';
      this.getSubstanceClinicalTrials(null, 'initial');
      //  this.productListExportUrl();
    }
  }



  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getSubstanceClinicalTrials(pageEvent?: PageEvent, searchType?: string): void {
    this.setPageEvent(pageEvent);
    const skip = this.page * this.pageSize;
    this.showSpinner = true;  // Start progress spinner
    const subscriptionClinical = this.clinicalTrialService.getClinicalTrials({
      searchTerm: this.substanceUuid,
      cutoff: null,
      type: "substanceKey",
      order: '$trialNumber',
      pageSize: this.pageSize,
      facets: this.privateFacetParams,
      skip: skip
    })
      .subscribe(pagingResponse => {
        if (searchType && searchType === 'initial') {
          this.etagAllExport = pagingResponse.etag;
        } 
        // else {
          // this.etagAllExport = pagingResponse.etag;
          console.log("this.etagAllExport: "+ this.etagAllExport);
          this.clinicalTrialService.totalRecords = pagingResponse.total;
          console.log("totalRecords: "+ this.clinicalTrialService.totalRecords);

          this.setResultData(pagingResponse.content);
          this.clinicalTrialCount = pagingResponse.total;
          this.etag = pagingResponse.etag;
          console.log("this.etag" + this.etag);
        // }    

        this.countClinicalTrialOut.emit(this.clinicalTrialCount);
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
    console.log("---- Exporting clincial trials 1");
    if (this.etagAllExport) {
      // const extension = 'xlsx';
      const extension = 'ctxlsx';
      
      console.log("---- Exporting clincial trials 2");
      console.log(this.etagAllExport);
      const url = this.getApiExportUrl(this.etagAllExport, extension);
      console.log("---- Exporting clincial trials 3");
      console.log(url);

      console.log('----' + this.authService.getUser());
      if (this.authService.getUser() !== '') {
        console.log("---- user found");

        const dialogReference = this.dialog.open(ExportDialogComponent, {
          height: '215x',
          width: '550px',
          data: { 'extension': extension, 'type': 'substanceClinicalTrialUS' }
        });
        // this.overlayContainer.style.zIndex = '1002';
        dialogReference.afterClosed().subscribe(name => {
          console.log("---- Dialog clincial trials");
          // this.overlayContainer.style.zIndex = null;
          if (name && name !== '') {
            this.loadingService.setLoading(true);
            const fullname = name + '.' + extension;
            this.authService.startUserDownload(url, this.privateExport, fullname).subscribe(response => {
              this.loadingService.setLoading(false);
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  totalSub: this.clinicalTrialCount
                }
              };
              console.log("---- After auth clincial trials");
              const params = { 'total': this.clinicalTrialCount };
              this.router.navigate(['/user-downloads/', response.id]);
            }, error => this.loadingService.setLoading(false));
          }
        });
      }
    }
  }

  getApiExportUrl(etag: string, extension: string): string {
    return this.clinicalTrialService.getApiExportUrl(etag, extension);
  }



  clinicalTrialListExportUrl() {
    if (this.bdnum != null) {
      this.exportUrl = this.clinicalTrialService.getClinicalTrialListExportUrl(this.bdnum);
    }
  }

  /*
  // copied from poducuts but has no effect.
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

    }
  }
*/

}
