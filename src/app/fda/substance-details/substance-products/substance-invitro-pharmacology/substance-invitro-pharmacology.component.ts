import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Sort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

/* GSRS Core Imports */
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { Facet, FacetParam, FacetHttpParams, FacetQueryResponse } from '@gsrs-core/facets-manager';
import { SubstanceDetailsBaseTableDisplay } from '../substance-details-base-table-display';
import { SubstanceCardBaseFilteredList } from '@gsrs-core/substance-details';

/* GSRS Invitro Pharmacology Imports */
import { InvitroPharmacologyService } from '../../../invitro-pharmacology/service/invitro-pharmacology.service';
import { GeneralService } from '../../../service/general.service';

@Component({
  selector: 'app-substance-invitro-pharmacology',
  templateUrl: './substance-invitro-pharmacology.component.html',
  styleUrls: ['./substance-invitro-pharmacology.component.scss']
})
export class SubstanceInvitroPharmacologyComponent extends SubstanceDetailsBaseTableDisplay implements OnInit, OnDestroy {

  @Input() substance: any;
  @Input() substanceUuid: string;
  @Input() substanceUnii: string;
  @Input() substanceName: string;
  @Output() countInvitroPharmOut: EventEmitter<number> = new EventEmitter<number>();

  assayScreening: any;
  id: string;
  assayTargetSubId = '';
  testCompoundSubId = '';
  ligandSubId = '';
  controlSubId = '';
  assayTargetSubNameMatch = false;
  testCompoundSubNameMatch = false;
  ligandSubNameMatch = false;
  controlSubNameMatch = false;
  invitroPharmTotalRecords = 0;

  showSpinner = false;
  pageIndex = 0;
  pageSize = 5;
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  privateExport = false;
  disableExport = false;
  etag = '';
  ascDescDir = 'desc';
  private subscriptions: Array<Subscription> = [];
  displayedColumns: string[] = [
    'view',
    'studyType',
    'assayTarget',
    'testCompound',
    'ligand',
    'control',
    'screeningConcentration'
  ]

  constructor(
    private router: Router,
    private authService: AuthService,
    public gaService: GoogleAnalyticsService,
    private loadingService: LoadingService,
    private invitroPharmService: InvitroPharmacologyService,
    private generalService: GeneralService,
    private dialog: MatDialog
  ) {
    super(gaService, invitroPharmService);
  }

  ngOnInit() {
    const rolesSubscription = this.authService.hasAnyRolesAsync('Admin', 'Updater', 'SuperUpdater').subscribe(response => {
      this.isAdmin = response;
    });
    this.subscriptions.push(rolesSubscription);

    if (this.substanceUuid) {
      this.getInvitroPharm();
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  }

  getInvitroPharm(pageEvent?: PageEvent) {
    this.showSpinner = true;  // Start progress spinner

    this.setPageEvent(pageEvent);
    const skip = this.page * this.pageSize;

    const subscription = this.invitroPharmService.getByAssayTargetUnii(this.substanceUnii).subscribe(results => {
      if (results.length > 0) {
        this.paged = results;
        this.assayScreening = results;
        this.invitroPharmTotalRecords = results.length;
        this.countInvitroPharmOut.emit(results.length);

        this.assayScreening.forEach(elementAssay => {
          if (elementAssay) {
            if (this.substance.approvalID === elementAssay.assayTargetUnii) {
              this.assayTargetSubNameMatch = true;
            }
            if (this.substance.approvalID === elementAssay.testCompoundUnii) {
              this.testCompoundSubNameMatch = true;
            }
            if (this.substance.approvalID === elementAssay.ligandSubstrateUnii) {
              this.ligandSubNameMatch = true;
            }
            if (this.substance.approvalID === elementAssay.controlUnii) {
              this.controlSubNameMatch = true;
            }
          }
        });

        /*
        // Get Substance Id for Test Compound
        if (this.assayScreening) {
          if (this.assayScreening.testCompoundUnii) {
            const testCompoundSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(this.assayScreening.testCompoundUnii).subscribe
              (substance => {
                if (substance) {
                  this.testCompoundSubId = substance.uuid;
                }
              });
            this.subscriptions.push(testCompoundSubIdSubscription);
          }
        }

        // Get Substance Id for Ligand/Substrate
        if (this.assayScreening.ligandSubstrateUnii) {
          const ligandSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(this.assayScreening.ligandSubstrateUnii).subscribe
            (substance => {
              if (substance) {
                this.ligandSubId = substance.uuid;
              }
            });
          this.subscriptions.push(ligandSubIdSubscription);
        }

        // Get Substance Id for control
        if (this.assayScreening.controlUnii) {
          const controlSubIdSubscription = this.generalService.getSubstanceBySubstanceUuid(this.assayScreening.controlUnii).subscribe
            (substance => {
              if (substance) {
                this.controlSubId = substance.uuid;
              }
            });
          this.subscriptions.push(controlSubIdSubscription);
        }
        */


      }
    }, error => {
      this.showSpinner = false;  // Stop progress spinner when error occurs
      console.log('error');
    }, () => {
      this.showSpinner = false;  // Stop progress spinner after done
      subscription.unsubscribe();
    });
  }

  getSubstanceNames(localName: string):boolean {
    this.substance.names.forEach(element => {
      if (element) {
        if (element.name) {
          if (element.name === localName) {
            return true;
          } else {
            return false;
          }
        }
      }
    });
    return false;
  }

  /*
  getSsg4mBySubstanceUuid(pageEvent?: PageEvent) {
    this.showSpinner = true;  // Start progress spinner

    this.setPageEvent(pageEvent);
    const skip = this.page * this.pageSize;

    const subscription = this.ssg4mService.getSyntheticPathwayIndexBySubUuid(this.substanceUuid).subscribe(results => {
      let synthResultsOrganized: Array<any> = [];

      if (results.length > 0) {
        // Loop through the results and organize the data to display in the table.
        results.forEach(rec => {
          if (rec.synthPathwaySkey) {
            let found = false;
            synthResultsOrganized.forEach(synthOrg => {
              // If found the key, append Reaction in the same record, or else create a new record
              if (synthOrg['synthPathwaySkey'] === rec.synthPathwaySkey) {
                synthOrg.synthDetails.push({'sbstncReactnSectNm': rec.sbstncReactnSectNm, 'sbstncRoleNm': rec.sbstncRoleNm});
               // alert("FOUND: " + synthOrg['synthPathwaySkey']  + '    ' + rec.synthPathwaySkey);
                found = true;
              }
            });

            //  else { // a new record
            if (found === false) {
                const newSynth: any = {synthDetails: []};
                newSynth.synthPathwaySkey = rec.synthPathwaySkey;
                newSynth.synthDetails.push({'sbstncReactnSectNm': rec.sbstncReactnSectNm, 'sbstncRoleNm': rec.sbstncRoleNm});
                synthResultsOrganized.push(newSynth);
            }
          }
        });
      }
      this.ssg4mTotalRecords = synthResultsOrganized.length;
      this.paged = synthResultsOrganized;
      this.countSsg4mOut.emit(synthResultsOrganized.length);
    }, error => {
      this.showSpinner = false;  // Stop progress spinner
      console.log('error');
    }, () => {
      this.showSpinner = false;  // Stop progress spinner
      subscription.unsubscribe();
    });
    // this.loadingStatus = '';
    // this.showSpinner = false;  // Stop progress spinner
  }
  */

}
