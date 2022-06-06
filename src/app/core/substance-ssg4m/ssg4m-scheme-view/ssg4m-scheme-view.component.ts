import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { Environment } from 'src/environments/environment.model';
import { ConfigService, LoadedComponents } from '@gsrs-core/config';
import { StructureImageModalComponent, StructureService } from '@gsrs-core/structure';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SubstanceFormSsg4mProcessService } from '../ssg4m-process/substance-form-ssg4m-process.service';
import { SubstanceDetail, SpecifiedSubstanceG4mProcess } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-ssg4m-scheme-view',
  templateUrl: './ssg4m-scheme-view.component.html',
  styleUrls: ['./ssg4m-scheme-view.component.scss']
})
export class Ssg4mSchemeViewComponent implements OnInit, OnDestroy {
  @Output() tabSelectedIndexOut = new EventEmitter<number>();

  showSubstanceRole = true;
  showCriticalParameter = false;
  imageLoc: any;
  environment: Environment;
  substance: SubstanceDetail;
  processList: Array<SpecifiedSubstanceG4mProcess>;
  subscriptions: Array<Subscription> = [];
  private overlayContainer: HTMLElement;

  constructor(
    private configService: ConfigService,
    private substanceFormSsg4mProcessService: SubstanceFormSsg4mProcessService,
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
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
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

    this.overlayContainer.style.zIndex = '1002';

    const subscription = dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    }, () => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    });
  }

  displayAmount(amt, propertyName: string): string {
    return this.displayAmountCompose(amt, propertyName);
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
          /* const atype = formatValue(amt.type); */
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