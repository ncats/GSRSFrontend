
import { Component, OnInit, AfterViewInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import {SubstanceDetail} from '../../substance/substance.model';
import {DomSanitizer, SafeUrl} from '@angular/platform-browser';
import {UtilsService} from '../../utils/utils.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import {AuthService} from '@gsrs-core/auth/auth.service';
import {SubstanceService} from '@gsrs-core/substance/substance.service';
import {FormControl, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {formSections} from '@gsrs-core/substance-form/form-sections.constant';
import {Subject, take as rxjsTake, Subscription, } from 'rxjs';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';
import { SubstanceClassPipe } from '../../utils/substance-class.pipe';
import {ConfigService, DownloadList} from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceHistoryDialogComponent } from '@gsrs-core/substance-history-dialog/substance-history-dialog.component';

@Component({
    selector: 'app-substance-overview',
    templateUrl: './substance-overview.component.html',
    styleUrls: ['./substance-overview.component.scss'],
    standalone: false
})
export class SubstanceOverviewComponent extends SubstanceCardBase implements OnInit, AfterViewInit, OnDestroy {
  references: string[] = [];
  showDef = false;
  downloadJsonHref: any;
  downloadJsonEuSmsFhirHref: any;
  defIcon = 'drop_down';
  latestVersion: number;
  defAccess: Array<string>;
  versionControl = new FormControl('', Validators.required);
  versions: string[] = [];

  substanceUpdated = new Subject<SubstanceDetail>();
  oldUrl: string;
  baseDomain: string;
  defaultCodeSystem = 'BDNUM';
  defaultCodes: string;
  clasicBaseHref: string;
  primaryCode = "Validated (UNII)";
  approvalCode: string;
  private overlayContainer: HTMLElement;
  private subscriptions: Array<Subscription> = [];
  showlinks = false;
  @Output() downloadPDF: EventEmitter<any> = new EventEmitter();
  enablePDFDownloadOption = false;
  pdfDownloadBtnName = "Download PDF";
  downloadList: DownloadList;

  constructor(
    private sanitizer: DomSanitizer,
    private utilsService: UtilsService,
    public gaService: GoogleAnalyticsService,
    private substanceService: SubstanceService,
    private router: Router,
    private authService: AuthService,
    private cvService: ControlledVocabularyService,
    private configService: ConfigService,
    public loadingService: LoadingService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog
  ) {
    super();
    this.baseDomain = this.configService.configData.apiUrlDomain;
    this.clasicBaseHref = this.configService.environment.clasicBaseHref;
  }

  // Getters, not fields, so template reads always reflect the current privilege signal.
  get canEdit(): boolean {
    return this.authService.hasPrivilege('Edit');
  }

  get canRestoreVersions(): boolean {
    return this.authService.hasPrivilege('Restore Previous Versions');
  }

  // Derived purely from canEdit + already-loaded substance data, no side effects, so a live getter is safe here too.
  get isEditable(): boolean {
    return this.canEdit
      && this.substance.substanceClass != null
      && (formSections[this.substance.substanceClass.toLowerCase()] != null || formSections[this.substance.substanceClass] != null);
  }

  ngOnInit() {
    // Seed versionControl synchronously here, before getVersion()'s async response, or the View button flashes visible until checkVersion() returns.
    if (this.substance?.version) {
      this.versionControl.setValue(this.substance.version.toString());
    }
    this.getSubtypeRefs(this.substance);

    const theJSON = JSON.stringify(this.substance);
    const uri = this.sanitizer.bypassSecurityTrustUrl('data:text/json;charset=UTF-8,' + encodeURIComponent(theJSON));
    this.downloadJsonHref = uri;
    this.getVersion();
    this.getClassFromCv();
    this.oldUrl = this.substanceService.oldSiteRedirect('details', this.substance.uuid);
    if (this.configService.configData.defaultCodeSystem != null
      && this.configService.configData.defaultCodeSystem !== '') {
        this.defaultCodeSystem = this.configService.configData.defaultCodeSystem;
      } 
       if (this.configService.configData.approvalCodeName != null
        && this.configService.configData.approvalCodeName !== '') {
          this.approvalCode = this.configService.configData.approvalCodeName;
          this.substance.codes.forEach(code => {
            if (code.codeSystem == this.approvalCode ) {
              this.substance._approvalIDDisplay = code.code;
            }
          });
        }

      if (this.configService.configData.primaryCode 
        && this.configService.configData.primaryCode !== '') {
          this.primaryCode = 'Validated (' + this.configService.configData.primaryCode + ')';
        }

    if (this.configService.configData && this.configService.configData.showOldLinks) {
      this.showlinks = true;
    }
    this.getDefAccess();
    if (this.substance.codes != null && this.substance.codes.length > 0) {
      const defaultCodes = [];
      this.substance.codes.forEach(code => {
        if (code.codeSystem === this.defaultCodeSystem) {
          defaultCodes.push(code.code);
        }
      });

      this.defaultCodes = defaultCodes.join(', ');
    }
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    if(this.configService.configData && this.configService.configData.enablePDFDownload ){
      this.enablePDFDownloadOption = this.configService.configData.enablePDFDownload.enablePDFDownload;
      this.pdfDownloadBtnName = this.configService.configData.enablePDFDownload.buttonName
    }

    if(this.configService.configData && this.configService.configData.downloadList ){
      this.downloadList = this.configService.configData.downloadList      
    }
  }


getDownloadButtonName(type: string): string {    
    if (type === undefined || type.trim() === "") {
 return ""; 
}
    const _default: string = type;
    const root = this.downloadList;
    if (root === undefined ) {
 return _default 
}
    if (!root.downloads ) {
 return _default; 
}
    const d = root.downloads[type];
    if (d && d.buttonName) {
 return d.buttonName; 
}
    return _default;   
}

getDownloadTitle(type: string): string {    
    if (type === undefined || type.trim() === "") {
 return ""; 
}
    const _default: string = type;
    const root = this.downloadList;
    if (root === undefined ) {
 return _default 
}
    if (!root.downloads ) {
 return _default; 
}
    const d = root.downloads[type];
    if (d && d.title) {
 return d.title; 
}
    return _default;   
}



  allowDownload(type: string): boolean {
    if (type === undefined || type.trim() === "") {
 return false; 
}
    const root = this.downloadList;
    if (root === undefined ) {
 return false; 
}
    if (root.disableAll === true) {
 return false; 
}
    if (!root.downloads ) {
 return false; 
}
    const d = root.downloads[type];
    // console.log("download object for type: " + type + " is: " + JSON.stringify(d));
    if (d && d.enabled === true) {
 return true; 
}
    return false;   
  }


  ngOnDestroy() {
      this.subscriptions.forEach(subscription => {
        subscription.unsubscribe();
      });
  }

  ngAfterViewInit() {
    const subSubscription =  this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      this.getVersion();
    });
    this.subscriptions.push(subSubscription);
  }

    downloadEmaSmsFhirRecordAction1(id: string, endpointFunction: string, filename: string): void {
      this.downloadEmaSmsFhirRecordAction2(endpointFunction, id, filename); 
    };

    downloadEmaSmsFhirRecordAction2(id: string, endpointFunction: string, filename: string): void {
      this.substanceService.getSubstanceEmaSmsFhirRecord(id, endpointFunction)
      .pipe(rxjsTake(1)).subscribe(response => {
        const dataType = 'JSON';
        const downloadLink = document.createElement('a');
        const blob = new Blob([JSON.stringify(response.body)], { type: dataType });
        downloadLink.href = window.URL.createObjectURL(
          blob  
        );
        downloadLink.setAttribute('download', filename);
        document.body.appendChild(downloadLink);
        downloadLink.click();
      });
  }

  
  getDefAccess() {
    if (this.substance.structurallyDiverse) {
     this.defAccess =  this.substance.structurallyDiverse.access;
    } else if (this.substance.protein) {
      this.defAccess =  this.substance.protein.access;
    } else if (this.substance.structure) {
      this.defAccess =  this.substance.structure.access;
    } else if (this.substance.mixture) {
      this.defAccess = this.substance.mixture.access;
    } else if (this.substance.polymer) {
      this.defAccess = this.substance.polymer.access;
    } else if (this.substance.nucleicAcid) {
      this.defAccess = this.substance.nucleicAcid.access;
    } else if (this.substance.specifiedSubstance) {
      this.defAccess = this.substance.specifiedSubstance.access;
    }

  }

  getSubtypeRefs(substance: SubstanceDetail): void  {
    if (substance.mixture) {
      this.references = substance.mixture.references;
    } else if (substance.protein) {
      this.references = substance.protein.references;
    } else if (substance.nucleicAcid) {
      this.references = substance.nucleicAcid.references;
    } else if (substance.polymer) {
      this.references = substance.polymer.references;
    } else if (substance.structure) {
      this.references = substance.structure.references;
    } else if (substance.structurallyDiverse) {
      this.references = substance.structurallyDiverse.references;
    } else if (substance.specifiedSubstance) {
      this.references = substance.specifiedSubstance.references;
    }

  }

  getVersion() {
    this.substanceService.checkVersion(this.substance.uuid).subscribe((result: number) => {
      this.versions = [];
      this.latestVersion = result;
      this.setVersionList();
      
      let currentVersion: number;
      if (this.substance.version) {
        currentVersion = Number(this.substance.version);
      } else {
        currentVersion = result;
      }
      this.versionControl.setValue(currentVersion.toString());
    }, error => {
      console.log(error);
    });
  }

  changeVersion() {
    const version = this.versionControl.value.toString();
    this.router.navigate(['/substances/' + this.substance.uuid + '/v/' + version]);
  }

  setVersionList() {
    for (let i = 1; i <= this.latestVersion; i++) {
      this.versions.push(i.toString());
    }
  }

  toggleReferences() {

    const value = this.showDef ? 0 : 1;
    this.gaService.sendEvent(this.analyticsEventCategory, 'link-toggle', 'references', value);
    this.showDef = !this.showDef;
    if (!this.showDef) {
      this.defIcon = 'drop_down';
    } else {
      this.defIcon = 'drop_up';
    }
  }

  getClassFromCv(): void {
    this.cvService.getDomainVocabulary('SUBSTANCE_CLASS').subscribe(response => {
      const classes = response['SUBSTANCE_CLASS'].list;
      classes.forEach( c => {
        if (c.value === this.substance.substanceClass) {
          this.substance.substanceClass = c.display;
        }
      });
    });
  }

  restoreVersion() {
    const dialogRef = this.dialog.open(SubstanceHistoryDialogComponent, {
      data: {'substance': this.substance, 'version': String(this.substance.version), 'latest': String(this.latestVersion)},
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

  downloadPDFSummary(){
    this.downloadPDF.emit();
  }

}
