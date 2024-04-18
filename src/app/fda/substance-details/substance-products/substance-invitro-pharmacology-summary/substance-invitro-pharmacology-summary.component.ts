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
  selector: 'app-substance-invitro-pharmacology-summary',
  templateUrl: './substance-invitro-pharmacology-summary.component.html',
  styleUrls: ['./substance-invitro-pharmacology-summary.component.scss']
})
export class SubstanceInvitroPharmacologySummaryComponent extends SubstanceDetailsBaseTableDisplay implements OnInit, OnDestroy {

  @Input() substance: any;
  @Input() substanceUuid: string;
  @Input() substanceUnii: string;
  @Input() substanceName: string;
  @Output() countInvitroPharmSummaryOut: EventEmitter<number> = new EventEmitter<number>();

  assayScreening: any;
  id: string;
  assayTargetSubId = '';
  testCompoundSubId = '';
  ligandSubId = '';
  controlSubId = '';
  loadingStatus = '';
  assayTargetSubNameMatch = false;
  testCompoundSubNameMatch = false;
  ligandSubNameMatch = false;
  controlSubNameMatch = false;
  showSpinner = false;
  privateExport = false;
  disableExport = false;

  // Search variables
  public privateSearchBase = 'root_invitroAssayScreenings_invitroAssayResultInformation_invitroTestAgent_testAgentSubstanceUuid:';
  public privateSearch?: string;
  public privateSearchTerm?: string;
  private privateFacetParams: FacetParam;
  public sortValues = invitroPharmacologySearchSortValues;
  invitroPharmTotalRecords = 0;
  pageIndex = 0;
  pageSize = 5;
  order = '$root_modifiedDate';
  ascDescDir = 'desc';
  etag = '';

  private subscriptions: Array<Subscription> = [];

  testAgentSummaryColumns: string[] = [
    'viewDetails',
    'referenceSource',
    'testAgent',
    'assayTargetName',
    'bioassayType',
    'resultValue',
    'resultType',
    'relationshipType',
    'interactionType'
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
      this.privateSearch = this.privateSearchBase + '\"' + this.substanceUuid + '\"';
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

  getInvitroPharm(pageEvent?: PageEvent, searchType?: string) {
    this.setPageEvent(pageEvent);
    this.showSpinner = true;  // Start progress spinner
    const skip = this.page * this.pageSize;

    const subscription = this.invitroPharmService.getInvitroPharmacology(
      this.order,
      skip,
      this.pageSize,
      this.privateSearch,
      this.privateFacetParams)
      .subscribe(pagingResponse => {
        //  if (searchType && searchType === 'initial') {
        //    this.etagAllExport = pagingResponse.etag;
        //  } else {
        if (pagingResponse.total > 0) {

          this.assayScreening = pagingResponse.content;
          this.invitroPharmTotalRecords = pagingResponse.total;
          this.countInvitroPharmSummaryOut.emit(pagingResponse.total);

          this.etag = pagingResponse.etag;

          let screeningList: Array<any> = [];

          this.assayScreening.forEach(assay => {
            if (assay) {

              const assayObj: any = {};
              assayObj.id = assay.id;
              assayObj.targetName = assay.targetName;
              assayObj.targetNameSubstanceUuid = assay.targetNameSubstanceUuid;
              assayObj.bioassayType = assay.bioassayType;
              assayObj.studyType = assay.studyType;

              assay.invitroAssayScreenings.forEach(screening => {
                if (screening.invitroAssayResultInformation) {

                  if (screening.invitroAssayResultInformation.invitroTestAgent) {
                    console.log(screening.invitroAssayResultInformation.invitroTestAgent.testAgent)
                    console.log(screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid)

                    // if Test Agent Substance UUID matching with this substance, display screening data
                    if ((screening.invitroAssayResultInformation.invitroTestAgent.testAgent) &&
                      (screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid == this.substanceUuid)) {

                      assayObj.testAgent = screening.invitroAssayResultInformation.invitroTestAgent.testAgent;

                      /* Invitro Reference Object exists */
                      if (screening.invitroAssayResultInformation.invitroReference) {
                        let referenceSourceTypeNumber = '';
                        let referenceSourceType = '';
                        let referenceSource = '';
                        if (screening.invitroAssayResultInformation.invitroReference.referenceSourceType) {
                          referenceSourceType = screening.invitroAssayResultInformation.invitroReference.referenceSourceType;
                        }
                        if (screening.invitroAssayResultInformation.invitroReference.referenceSource) {
                          referenceSource = screening.invitroAssayResultInformation.invitroReference.referenceSource;
                        }

                        referenceSourceTypeNumber = referenceSourceType + ' ' + referenceSource;
                        assayObj.referenceSourceTypeNumber = referenceSourceTypeNumber;
                      } // if invitroReference exists


                      /* Invitro Assay Result Object exists */
                      if (screening.invitroAssayResult) {
                        assayObj.testAgentConcentration = screening.invitroAssayResult.testAgentConcentration;
                        assayObj.testAgentConcentrationUnits = screening.invitroAssayResult.testAgentConcentrationUnits;

                        assayObj.resultValue = screening.invitroAssayResult.resultValue;
                        assayObj.resultValueUnits = screening.invitroAssayResult.resultValueUnits;

                        // Calculate IC50 Value
                        assayObj.calculateIC50Value = this.calculate1C50Value(screening.invitroAssayResult.testAgentConcentration, screening.invitroAssayResult.resultValue);
                      } // Result exists

                      /* Invitro Assay Control exists */
                      if (screening.invitroControls.length > 0) {
                        assayObj.controls = screening.invitroControls;
                      }

                      /* Invitro Assay Summary exists */
                      let summaryList: Array<any> = [];
                      let summaryObj: any = null;;

                      if (screening.invitroSummary) {

                        summaryObj = {};

                        if (screening.invitroAssayResultInformation) {
                          if (screening.invitroAssayResultInformation.invitroTestAgent) {
                            summaryObj.testAgent = screening.invitroAssayResultInformation.invitroTestAgent.testAgent;
                            summaryObj.testAgentSubstanceUuid = screening.invitroAssayResultInformation.invitroTestAgent.testAgentSubstanceUuid;
                          }
                        }

                        assayObj.summaryResultValueAvg = screening.invitroSummary.resultValueAverage;
                        assayObj.summaryResultValueLow = screening.invitroSummary.resultValueLow;
                        assayObj.summaryResultValueHigh = screening.invitroSummary.resultValueHigh;
                        assayObj.summaryResultValueUnits = screening.invitroSummary.resultValueUnits;

                        assayObj.resultType = screening.invitroSummary.resultType;
                        assayObj.relationshipType = screening.invitroSummary.relationshipType;
                        assayObj.interactionType = screening.invitroSummary.interactionType;

                       // assayObj.summary = summaryObj;

                      //  assayObj.summaries = [];
                      //  assayObj.summaries.push(summaryObj);

                     //   summaryList.push(summaryObj);
                      }

                      screeningList.push(assayObj);

                    } // testAgentSubstanceUuid is same as this substance

                  } // if invitroTestAgent object exists
                }
              });
            }
          });

          this.setResultData(screeningList);


          /*
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
          */
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

  /*
  getInvitroPharm(pageEvent?: PageEvent) {
    this.showSpinner = true;  // Start progress spinner

    this.setPageEvent(pageEvent);
    const skip = this.page * this.pageSize;

    const subscription = this.invitroPharmService.getInvitroPharmacology(this.substanceUnii).subscribe(results => {
      if (results.length > 0) {
        this.paged = results;
        this.assayScreening = results;
        this.invitroPharmTotalRecords = results.length;
        this.countInvitroPharmOut.emit(results.length);

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

      }
    }, error => {
      this.showSpinner = false;  // Stop progress spinner when error occurs
      console.log('error');
    }, () => {
      this.showSpinner = false;  // Stop progress spinner after done
      subscription.unsubscribe();
    });
  }
  */

  calculate1C50Value(testAgentConcentration: number, resultValue: number): string {
    let resultType = 'IC50';
    let calculateIC50Value = '';
    // resultType = IC50
    // if percentInhibition/resultValue < 30, then IC50 > Test Agent Concentration
    // if percentInhibition/resultValue between 30 and 60, then IC50 approx. = Test Agent Concentration
    // if percentInhibition/resultValue above 60, then IC50 < Test Agent Concentration
    if (resultValue) {
      if (resultValue < 30) {
        calculateIC50Value = resultType + ' > ' + testAgentConcentration;
      } else if (resultValue >= 30 && resultValue <= 60) {
        calculateIC50Value = resultType + ' approx. = ' + testAgentConcentration;
      } else if (resultValue > 60) {
        calculateIC50Value = resultType + ' < ' + testAgentConcentration;
      }
    }

    return calculateIC50Value;
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
