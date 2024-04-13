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
import { invitroPharmacologySearchSortValues } from '../../../invitro-pharmacology/invitro-pharmacology-browse/invitro-pharmacology-search-sort-values';
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
  order: string;
  public sortValues = invitroPharmacologySearchSortValues;

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
  /*
  displayedColumns: string[] = [
    'view',
    'relationshipType',
    'studyType',
    'assayTarget',
    'testCompound',
    'ligand',
    'control',
    'screeningConcentration'
  ]
   */

  displayedColumns: string[] = [
    'viewDetails',
    'testAgent',
    'batchNumber',
    'screeningConcentration',
    'screeningInhibition',
    'assayTarget',
    'assayType'
  ];

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

  sortData(sort: Sort) {
    /*
    if (sort.active) {
      const orderIndex = this.displayedColumns.indexOf(sort.active).toString();
      this.ascDescDir = sort.direction;
      this.sortValues.forEach(sortValue => {
        if (sortValue.displayedColumns && sortValue.direction) {
          if (this.displayedColumns[orderIndex] === sortValue.displayedColumns && this.ascDescDir === sortValue.direction) {
            this.order = sortValue.value;
          }
        }
      });
      // Search In-vitro Pharmacology
      this.getInvitroPharm();
    }
    return; */
  }

  formatValue(v) {
    if (v) {
      if (typeof v === 'object') {
        if (v.display) {
          return v.display;
        } else if (v.value) {
          return v.value;
        } else {
          return null;
        }
      } else {
        return v;
      }
    }
    return null;
  }

  displayAmount(amt: any): string {
    let ret = '';
    if (amt) {
      //if (typeof assay === 'object') {
      //  if (amt) {

      let addedunits = false;
      let unittext = this.formatValue(amt.amountUnits);
      if (!unittext) {
        unittext = '';
      }
      const atype = this.formatValue(amt.amountType);
      if (atype) {
        ret += atype + '\n';
      }
      if (amt.amountAverage || amt.amountHigh || amt.amountLow) {
        if (amt.amountAverage) {
          ret += amt.amountAverage;
          if (amt.amountUnits) {
            ret += ' ' + unittext;
            addedunits = true;
          }
        }
        if (amt.amountHigh || amt.amountLow) {
          ret += ' [';
          if (amt.amountHigh && !amt.amountLow) {
            ret += '<' + amt.amountHigh;
          } else if (!amt.amountHigh && amt.amountLow) {
            ret += '>' + amt.amountLow;
          } else if (amt.amountHigh && amt.amountLow) {
            ret += amt.amountLow + ' to ' + amt.amountHigh;
          }
          ret += '] ';
          if (!addedunits) {
            if (amt.amountUnits) {
              ret += ' ' + unittext;
              addedunits = true;
            }
          }
        }
        ret += ' (average) ';
      }

      /*
      if (amt.highLimit || amt.lowLimit) {
        ret += '\n[';
      }
      if (amt.highLimit && !amt.lowLimit) {
        ret += '<' + amt.highLimit;
      } else if (!amt.highLimit && amt.lowLimit) {
        ret += '>' + amt.lowLimit;
      } else if (amt.highLimit && amt.lowLimit) {
        ret += amt.lowLimit + ' to ' + amt.highLimit;
      }
      if (amt.highLimit || amt.lowLimit) {
        ret += '] ';
        if (!addedunits) {
          if (amt.units) {
            ret += ' ' + unittext;
            addedunits = true;
          }
        }
        ret += ' (limits)';
      }
      */
      //     }
      //      }
    }
    return ret;
  }

}
