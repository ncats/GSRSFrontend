import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { Environment } from 'src/environments/environment.model';
import { ConfigService, LoadedComponents } from '@gsrs-core/config';
import { UtilsService } from '@gsrs-core/utils';
import { StructureImageModalComponent, StructureService } from '@gsrs-core/structure';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SubstanceFormSsg4mProcessService } from '../ssg4m-process/substance-form-ssg4m-process.service';
import { SubstanceDetail, SpecifiedSubstanceG4mProcess, SubstanceAmount } from '@gsrs-core/substance/substance.model';
import { SubstanceSsg4mService } from '../substance-ssg4m-form.service';

@Component({
  selector: 'app-ssg4m-scheme-view',
  templateUrl: './ssg4m-scheme-view.component.html',
  styleUrls: ['./ssg4m-scheme-view.component.scss']
})
export class Ssg4mSchemeViewComponent implements OnInit, OnDestroy {
  @Output() tabSelectedIndexOut = new EventEmitter<number>();
  @Input() showProcessIndex = -1;  // -1 Show all records
  @Input() showSiteIndex = -1;  // -1 Show all records
  @Input() showStageIndex = -1;  // -1 Show all records
  showSubstanceRole = true;
  showCriticalParameter = false;
  showAmountValues = false;
  imageLoc: any;
  environment: Environment;
  substance: SubstanceDetail;
  gsrsHomeBaseUrl: string;
  processList: Array<SpecifiedSubstanceG4mProcess>;
  subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;

  constructor(
    private configService: ConfigService,
    private substanceFormSsg4mProcessService: SubstanceFormSsg4mProcessService,
    private substanceSsg4mService: SubstanceSsg4mService,
    private utilsService: UtilsService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    const processSubscription = this.substanceFormSsg4mProcessService.specifiedSubstanceG4mProcess.subscribe(process => {
      this.processList = process;
    });
    // const subscription = this.substanceFormService.substance.subscribe(substance => {
    //  this.substance = JSON.stringify(substance);
    //   this.process = JSON.stringify(this.substance);
    //   alert("JSON: " + JSON.stringify(this.substance));
    //  });
    this.subscriptions.push(processSubscription);
    this.environment = this.configService.environment;
    this.imageLoc = `${this.environment.baseHref || ''}assets/images/home/arrow.png`;
    this.overlayContainer = this.overlayContainerService.getContainerElement();

    // Get Configuration values
    this.getConfigSettings();

    // Get GSRS Frontend URL fron config
    this.getHomepageUrl();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getConfigSettings(): void {
    // Get SSG4 Config Settings from config.json file to show and hide fields in the form
    let configSsg4Form: any;
    configSsg4Form = this.configService.configData && this.configService.configData.ssg4Form || null;
    // *** IMPORTANT: get the correct value. Get 'stepView.showAmountValues' json values from config
    let confStepView = null;
    if (configSsg4Form) {
      confStepView = configSsg4Form.settingsDisplay.stepView;
      if (confStepView) {
        this.showAmountValues = configSsg4Form.settingsDisplay.stepView.showAmountValues;
      }
    }

    alert(this.showAmountValues);
  }

  openImageModal(subUuid: string, approvalID: string, displayName: string): void {
    // const eventLabel = environment.isAnalyticsPrivate ? 'substance' : substance._name;

    //  this.gaService.sendEvent('substancesContent', 'link:structure-zoom', eventLabel);

    let data: any;
    // if (substance.substanceClass === 'chemical') {
    data = {
      structure: subUuid,
      uuid: subUuid,
      approvalID: approvalID,
      displayName: displayName
    };
    // }

    const dialogRef = this.dialog.open(StructureImageModalComponent, {
      height: '96%',
      width: '650px',
      panelClass: 'structure-image-panel',
      data: data
    });

    this.overlayContainer.style.zIndex = '1001';

    const subscription = dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = '1001';
      subscription.unsubscribe();
    }, () => {
      this.overlayContainer.style.zIndex = '1001';
      subscription.unsubscribe();
    });
  }

  editInForm() {
    this.tabSelectedIndexOut.emit(0);
  }

  updateShowSubstanceRole(event) {
    this.showSubstanceRole = event.checked;
  }

  updateShowCriticalParameter(event) {
    this.showCriticalParameter = event.checked;
  }

  getHomepageUrl() {
    // Get GSRS Frontend URL fron config
    this.gsrsHomeBaseUrl = this.configService.configData && this.configService.configData.gsrsHomeBaseUrl || '';
  }

  displayAmount(amt: SubstanceAmount): string {
    return this.utilsService.displayAmount(amt);
  }

  displayAmountCompose(amt, propertyType: string): string {
    function formatValue(v) {
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

    let ret = '';
    if (amt) {
      if (typeof amt === 'object') {
        if (amt) {
          let addedunits = false;
          let unittext = formatValue(amt.units);
          if (!unittext) {
            unittext = '';
          }
          // const atype = formatValue(amt.type);
          const atype = formatValue(propertyType);
          if (atype) {
            ret += atype + ':' + '\n';
          }
          if (amt.average || amt.high || amt.low) {
            if (amt.average) {
              ret += amt.average;
              if (amt.units) {
                ret += ' ' + unittext;
                addedunits = true;
              }
            }
            if (amt.high || amt.low) {
              ret += ' [';
              if (amt.high && !amt.low) {
                ret += '<' + amt.high;
              } else if (!amt.high && amt.low) {
                ret += '>' + amt.low;
              } else if (amt.high && amt.low) {
                ret += amt.low + ' to ' + amt.high;
              }
              ret += '] ';
              if (!addedunits) {
                if (amt.units) {
                  ret += ' ' + unittext;
                  addedunits = true;
                }
              }
            }
            ret += ' (average) ';
          }
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
        }
        if (amt.nonNumericValue) {
          ret += ' ' + amt.nonNumericValue;
        }
      }
    }
    return ret;
  }

}
