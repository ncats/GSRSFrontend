import { Component, OnInit, AfterViewInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { DynamicComponentLoaderModule } from '../../dynamic-component-loader/dynamic-component-loader.module';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {ReferencesManagerModule} from '../../references-manager/references-manager.module';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {MatIconModule} from '@angular/material/icon';
import {SubstanceCardBase} from '@gsrs-core/substance-details/substance-card-base';
import {SubstanceDetail, SubstanceEdit, SubstanceName, SubstanceDiff} from '@gsrs-core/substance/substance.model';
import {SubstanceService} from '@gsrs-core/substance/substance.service';
import {LoadingService} from '@gsrs-core/loading/loading.service';
import {MainNotificationService} from '@gsrs-core/main-notification/main-notification.service';
import {Router} from '@angular/router';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics/google-analytics.service';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-details/substance-card-base-filtered-list';
import {Subject, Subscription} from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceHistoryDialogComponent } from '@gsrs-core/substance-history-dialog/substance-history-dialog.component';
import {DataDictionary} from '@gsrs-core/utils/data-dictionary';
import * as jsonpath from 'jsonpath';

@Component({
  selector: 'app-substance-history',
  templateUrl: './substance-history.component.html',
  styleUrls: ['./substance-history.component.scss']
})
export class SubstanceHistoryComponent extends SubstanceCardBase implements OnInit , AfterViewInit {
  versions: Array<SubstanceEdit>;
  displayedColumns: string[] = ['view', 'version', 'versionComments', 'editor', 'changeDate', 'restore','showDiff'];
  substanceUpdated = new Subject<SubstanceDetail>();
  latest: any;
  private overlayContainer: HTMLElement;
  subsatnacedifference : Array<SubstanceDiff>;
  showdiffTitle : string = "";
  diffDisplayedColumns: string[] = ['op', 'path', 'oldValue','value'];
  private dataDictionary: any = DataDictionary;
  substanceOldValue: any;



  constructor(
    private substanceService: SubstanceService,
    private router: Router,
    public loadingService: LoadingService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
    public gaService: GoogleAnalyticsService

  ) {
    super();
  }
  ngOnInit() {
   this.substanceService.getEdits(this.substance.uuid).subscribe( response => {
     this.versions = response;
   }, error => {} );
   this.substanceService.checkVersion(this.substance.uuid).subscribe((result: number) => {
    this.latest = result;
  });
  this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  ngAfterViewInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
    });
  }

  switchVersion(version): void {
    this.router.navigate(['/substances/' + this.substance.uuid + '/v/' + version]);
  }

  restoreVersion(version: any) {
      const dialogRef = this.dialog.open(SubstanceHistoryDialogComponent, {
        data: {'substance': this.substance, 'version': version, 'latest': this.latest},
        width: '650px',
        autoFocus: false,
        disableClose: true
      });
       this.overlayContainer.style.zIndex = '1002';
      const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
        this.overlayContainer.style.zIndex = null;

        if (response && response === 'success' ) {
          this.router.onSameUrlNavigation = 'reload';
          this.router.navigate(['/substances/' + this.substance.uuid + '/']);
        }
      });

  }


openModal(templateRef, version: SubstanceEdit) {
  var ver : number = +version.version + 1;
  this.substanceService.GetSubstanceDiff(version.diff).subscribe(response => {
    this.subsatnacedifference = response;
    this.substanceService.GetSubstanceOldValue(version.oldValue).subscribe(result =>{
      this.substanceOldValue = result;
    })
    this.gaService.sendEvent(this.analyticsEventCategory, 'button', 'substance difference view');
    this.showdiffTitle = "Changes from version "+version.version+" to version "+ ver;
    const dialogRef = this.dialog.open(templateRef, {
      minWidth: '40%',
      maxWidth: '90%'
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }, error => {
    this.gaService.sendException('getSubstanceDifferenceDetails: error from API call');
  });

}
close() {
  this.dialog.closeAll();
}

getDisplayValue(diff: SubstanceDiff, val: any, old?: string) {
  if (old === '' || old === undefined) {
    if (diff.value != undefined) {
      val = diff.value;
    } else {
      return val = '';
    }
  }
  var datepattern = new RegExp('(\/created\\b|\/lastEdited\\b|\/documentDate\\b)');
  var datetime = datepattern.test(diff.path)
  if (datetime) {

    val = new Date(val) + ''
  }
  if (val.constructor.name === 'Object') {
    let readableObj = '';
    Object.keys(val).forEach(key => {
      var datePattern2: RegExp = /\b(?:created|lastEdited|documentDate)\b/;
      var datefieldCheck = datePattern2.test(key);
      if (datefieldCheck) {
        readableObj = readableObj + key + ' = ' + new Date(val[key]) + '</br>'
      } else {
        readableObj = readableObj + key + ' = ' + val[key] + '</br>'
      }
    });
    val = readableObj;
  }
  return val;
}


getPathDisplayName(pathVal){
  let result = pathVal;
  let feildVal = pathVal.replace(/[0-9]/g, "?");
  Object.keys(this.dataDictionary).forEach(key => {
    const cv = this.dataDictionary[key]['fieldPath'];
    if(cv === feildVal){
      result = this.dataDictionary[key]['displayName'] + ' ('+pathVal+')';
    }
  });

  return result;
}


getOldValue(diff: SubstanceDiff) {
  let result = ' ';
  if (diff.op != 'add') {
    let path = diff.path.replace(/\//g, ".")
    path = path.replace(/\.(\d+)(?=[^0-9])/g, '[$1]')
    result = jsonpath.query(this.substanceOldValue, '$' + path);
    if (result.length > 0) {
      result = this.getDisplayValue(diff, result[0]);
    }
  } else {
    result = 'Not Applicable'
  }
  return result;
}

}