import { Component, OnInit, Input, Output, EventEmitter, ComponentFactoryResolver, Inject, ViewChild, TemplateRef } from '@angular/core';
import {
  SubstanceDetail,
  SubstanceName,
  SubstanceSummary,
  SubstanceCode,
  SubstanceRelationship,
  Subunit
} from '../../../substance/substance.model';
import { DYNAMIC_COMPONENT_MANIFESTS, DynamicComponentManifest } from '@gsrs-core/dynamic-component-loader';
import { SafeUrl } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { StructureService } from '@gsrs-core/structure';
import {Router} from '@angular/router';
import {Alignment, UtilsService} from '@gsrs-core/utils';
import { take } from 'rxjs/operators';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from '@gsrs-core/config';
import { Vocabulary } from '@gsrs-core/controlled-vocabulary';
import * as lodash from 'lodash';
import { CardDynamicSectionDirective } from '@gsrs-core/substances-browse/card-dynamic-section/card-dynamic-section.directive';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { LoadingService } from '@gsrs-core/loading';
import { MergeActionDialogComponent } from '@gsrs-core/admin/import-browse/merge-action-dialog/merge-action-dialog.component';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-import-summary',
  templateUrl: './import-summary.component.html',
  styleUrls: ['./import-summary.component.scss']
})
export class ImportSummaryComponent implements OnInit {
  private privateSubstance: any;
  @Output() openImage = new EventEmitter<SubstanceSummary>();
  @Output() doneAction = new EventEmitter< any >();
  @Output() bulkSelect = new EventEmitter < any > ();
  privateDummyID: string;
  showAudit = false;
  isAdmin = false;  //this shouldn't be called "isAdmin", it's typically used to mean "canUpdate". Should fix for future devs.
  canCreate = false; //meant to allow creating new records
  subunits?: Array<Subunit>;
  @ViewChild(CardDynamicSectionDirective, {static: true}) dynamicContentContainer: CardDynamicSectionDirective;
 codeSystemNames?: Array<string> = [];
  @Input() codeSystemVocab?: Vocabulary;
  @Input() searchStrategy?: string = '';
  @Input() recordID: string = null;
  private codes: Array <any >;
  bulkChecked = false;
  displayAction: string;
  privateBulkAction: any;
  pageSize = 5;
  pageIndex = 0;
  deleted = false;

  
//  @Input() codeSystems?: { [codeSystem: string]: Array<SubstanceCode> };
  alignments?: Array<Alignment>;
  inxightLink = false;
  inxightUrl: string;
  overlayContainer: any;
  rounding = '1.0-2';
  showAll = [];
  privateCodeSystems?: { [codeSystem: string]: Array<SubstanceCode> };
  privateCodeSystemNames = [];
  allPrimary = [];
  showLessNames = true;
  showLessCodes = true;
  privateNames?: Array<SubstanceName>;
  nameLoading = true;
  _ = lodash;
  codeSystems = [];
  displayedColumns = ['name', 'source', 'keys', 'merge'];
  displayedColumns2 = ['type', 'message'];
  message = "";
  private privateMatches: any;

  disabled = false;
  performedAction: string;
  @ViewChild('infoDialog', { static: true }) infoDialog: TemplateRef<any>;
  dialogRef: MatDialogRef<any>;


  constructor(
    public utilsService: UtilsService,
    public gaService: GoogleAnalyticsService,
    public authService: AuthService,
    private substanceService: SubstanceService,
    private structureService: StructureService,
    private router: Router,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
    private adminService: AdminService,
    private configService: ConfigService,
    private loadingService: LoadingService,
    @Inject(DYNAMIC_COMPONENT_MANIFESTS) private dynamicContentItems: DynamicComponentManifest<any>[]
  ) { }


  ngOnInit() {
    this.getMatchSummary();

    this.overlayContainer = this.overlayContainerService.getContainerElement();

    this.authService.hasAnyRolesAsync('Updater', 'SuperUpdater', 'Approver', 'admin').pipe(take(1)).subscribe(response => {
      if (response) {
        this.isAdmin = response;
      }
    });
    this.authService.hasAnyRolesAsync('DataEntry', 'SuperDataEntry', 'admin').pipe(take(1)).subscribe(response => {
      if (response) {
        this.canCreate = response;
      }
    });
    if (this.substance.protein) {
      this.subunits = this.substance.protein.subunits;
      this.getAlignments();
    }
    if (this.substance.nucleicAcid) {
      this.subunits = this.substance.nucleicAcid.subunits;
      this.getAlignments();
    }

    if (this.substance.structure && this.substance.structure.formula) {
      this.substance.structure.formula = this.structureService.formatFormula(this.substance.structure);
    }

    this.matchFieldsToCount(this.substance.matchedRecords);
    if (this.configService.configData && this.configService.configData.molWeightRounding) {
      this.rounding = '1.0-' + this.configService.configData.molWeightRounding;
    }
  //  this.privateMatches = JSON.parse(JSON.stringify(this.substance.matchedRecords)).slice(0, 5);
  }


  matchFieldsToCount(matches: any) {
    matches.forEach(match => {
      let newArr: Array<any> = [];
      match.records.forEach(record => {
        let found = false;
        newArr.forEach(val => {
          if (val.field && val.field === record) {
            val.count++;
            found = true;
          }
        });
        if (!found) {
          let temp = {'field': record, 'count': 1};
          newArr.push(temp);
        }
      });
      match.recordArr = newArr;
    });
  }


  @Input()

  set names(name: any) {
    if (typeof(name) != "undefined") {
      this.privateNames = name;
      this.nameLoading = false;
    }
    
  }

  get names(): any {
    return this.privateNames;
  }

  @Input()

  set bulkAction(action: boolean){
    this.privateBulkAction = action;
    this.bulkChecked = action;
  }

  get bulkAction() {
    return this.privateBulkAction;
  }

  getMatchSummary() {
    this.substance.matchedRecords.forEach(record => {
      if (record.source && record.source === 'Staging Area'){
        this.adminService.GetStagedRecord(record.ID).subscribe(response => {
          record._name = response._name;
          this.privateMatches = JSON.parse(JSON.stringify(this.substance.matchedRecords)).slice(0, 5);
        }, error => {
          console.log(error);
        })
      } else {
        this.substanceService.getSubstanceSummary(record.ID).subscribe(response => {
          record.uuid = response.uuid;
          record._name = response._name;
          this.privateMatches = JSON.parse(JSON.stringify(this.substance.matchedRecords)).slice(0, 5);
        }, error => {
          console.log(error);
        });
      }
      
    });
    
  }

  addtoBulkList() {
    this.bulkChecked = !this.bulkChecked;
    const toEmit = {"checked": this.bulkChecked,
                    "substance": this.privateSubstance};
    this.bulkSelect.emit(toEmit);
  }


  getApprovalID() {
    if (!this.substance.approvalID) {
      if (this.substance._approvalIDDisplay &&
         this.substance._approvalIDDisplay.length === 10 &&
        this.substance._approvalIDDisplay.indexOf(' ') < 0) {
          this.substance.approvalID = this.substance._approvalIDDisplay;
      }
    }
  }

  @Input()
  set substance(substance: any) {
    if (substance != null) {
      this.privateSubstance = substance;
      this.codeSystems = substance.codes;
     // console.log(substance);
      this.codes = substance.codes;
    //  this.getStructureID();
    if (substance._metadata.importStatus.toUpperCase() === 'MERGED' || substance._metadata.importStatus.toUpperCase() === 'IMPORTED') {
      this.disabled = true;
    } else {
    }

      this.setCodeSystems();
      this.processValidation();
    }
  }

  get substance(): any {
    return this.privateSubstance;
  }

  getStructureID() {
    if(this.privateSubstance && this.privateSubstance.structure && this.privateSubstance.structure.molfile) {
        this.structureService.interpretStructure(this.privateSubstance.structure.molfile).subscribe(response => {
          this.privateSubstance.structureID = response.structure.id;
          this.substance.structureID = response.structure.id;
        });
      }
  }
  processValidation() {
    let validation = {warnings: 0, errors: 0, validations: []};
    
    if(this.privateSubstance._metadata && this.privateSubstance._metadata.validations){
      this.privateSubstance._metadata.validations.forEach (entry => {
        if(entry.validationType === 'error') {
          validation.errors++;
        } else if (entry.validationType === 'warning') {
          validation.warnings++;
        }
        validation.validations.push(entry);
      });
      
    }
    this.privateSubstance.validations = validation;
  }

  editRecord() {

  }

  deleteRecord() {
    this.adminService.deleteStagedRecord([this.privateSubstance._metadata.recordId]).subscribe(response => {
      this.message = "Successfully deleted staging area record data";
      this.deleted = true;
    }, error => {
      this.message = "There was a problem deleting staging area record data";

    })
  }

  doAction(action: string, mergeID?: string) {
 
    this.displayAction = action;
    this.loadingService.setLoading(true);
    this.adminService.stagedRecordSingleAction(this.privateSubstance._metadata.recordId, action).subscribe(result => {
      if (result.jobStatus === 'completed') {
        this.loadingService.setLoading(false);
        this.doneAction.emit(this.privateSubstance.uuid);
        this.message = "Record " + action + "  successful";
        if (result) {
          this.disabled = true;
          this.performedAction = action;
        }
  
        this.deleted = false;
        this.dialogRef =  this.dialog.open(this.infoDialog,
          {data: {'message': 'Record successfuly Created', 'action': action},
        width: '600px'});
         const dialogSubscription = this.dialogRef.afterClosed().subscribe(response => {
          this.router.navigate(['/admin/staging-area/'], {queryParamsHandling: "preserve"});
         });

      } else {
        setTimeout(() => {
          this.processingstatus(result.id, action, result);
        }, 200);
      }
     
    }, error => {
      this.message = "Error: failed to " + action + " record";
      this.loadingService.setLoading(false);
      this.dialogRef =  this.dialog.open(this.infoDialog,
        {data: {'message': 'Error: failed to', 'action': action},
      width: '600px'});
       const dialogSubscription = this.dialogRef.afterClosed().subscribe(response => {

       });
    });
  }

  processingstatus(id: string, action?: any, result?: any): void {
    this.adminService.processingstatus(id).subscribe(response => {
      if (response.jobStatus === 'completed') {
             this.loadingService.setLoading(false);
              this.doneAction.emit(this.privateSubstance.uuid);
      this.message = "Record " + action + "  successful";
      if (result) {
        this.disabled = true;
        this.performedAction = action;
      }

      this.deleted = false;
      this.dialogRef =  this.dialog.open(this.infoDialog,
        {data: {'message': 'Record successfuly Created', 'action': action},
      width: '600px'});
       const dialogSubscription = this.dialogRef.afterClosed().subscribe(response => {
        this.router.navigate(['/admin/staging-area/'], {queryParamsHandling: "preserve"});
       });
      } else {
        setTimeout(() => {
          this.processingstatus(id);
        }, 200);
      }
     

    });
  }

  setCodeSystems() {
    if (this.codes && this.codes.length > 0) {
      const substanceId = this.substance.uuid;
      
      this.codes.forEach(code => {
        if (this.codeSystems[code.codeSystem]) {
          this.codeSystems[code.codeSystem].push(code);
        } else {
          this.codeSystems[code.codeSystem] = [code];
          this.codeSystemNames.push(code.codeSystem);
        }
      });
      this.codeSystemNames = this.sortCodeSystems(this.codeSystemNames);
      this.codeSystemNames.forEach(sysName => {
        this.codeSystems[sysName] = this.codeSystems[sysName].sort((a, b) => {
          let test = 0;
          if (a.type === 'PRIMARY' && b.type !== 'PRIMARY') {
            test = 1;
          } else if (a.type !== 'PRIMARY' && b.type === 'PRIMARY') {
            test = -1;
          } else {
            test = 0;
          }
          return test;
        });
      });
  
    }
  }

  sortCodeSystems(codes: Array<string>): Array<string> {
    if (this.configService.configData && this.configService.configData.codeSystemOrder &&
      this.configService.configData.codeSystemOrder.length > 0) {
      const order = this.configService.configData.codeSystemOrder;
      for (let i = order.length - 1; i >= 0; i--) {
        for (let j = 0; j <= codes.length; j++) {
          if (order[i] === codes[j]) {
            const a = codes.splice(j, 1);   // removes the item
            codes.unshift(a[0]);         // adds it back to the beginning
            break;
          }
        }
      }
    }
    return codes;
  }

  formatCodeSystems() {
    // sort() function in substance-browse isn't working... pushing this as alternative to get all primary codes first
    this.codeSystemNames.forEach(sysName => {
      const testing = [];
      this.allPrimary[sysName] = 'true';
      this.codeSystems[sysName].forEach(code => {
          if (code.type === 'PRIMARY') {
            testing.unshift(code);
          } else {
            this.allPrimary[sysName] = 'false';
            testing.push(code);
          }
      });
      this.codeSystems[sysName] = testing;
      });
  }

  openImageModal(): void {
    this.substance.names = this.privateNames;
    this.openImage.emit(this.substance);
  }

  editForm(): void {
    this.router.navigate(['/substances/' + this.substance.uuid + '/edit']);
  }
  getFasta(id: string, filename: string): void {
    this.substanceService.getFasta(id).subscribe(response => {
      this.downloadFile(response, filename);
    });
  }

  getMol(id: string, filename: string): void {
    this.structureService.downloadMolfile(id).subscribe(response => {
      this.downloadFile(response, filename);
    });
  }

  downloadFile(response: any, filename: string): void {
    const dataType = response.type;
    const binaryData = [];
    binaryData.push(response);
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

  downloadJson() {
    this.substanceService.getSubstanceDetails(this.substance.uuid).pipe(take(1)).subscribe(response => {
        this.downloadFile(JSON.stringify(response), this.substance.uuid + '.json');
    });
  }

  getAlignments(): void {
    if (this.substance._matchContext) {
      if (this.substance._matchContext.alignments) {
        this.alignments = this.substance._matchContext.alignments;
        this.alignments.forEach(alignment => {
          this.subunits.forEach(subunit => {
            if (subunit.uuid === alignment.id) {
              alignment.subunitIndex = subunit.subunitIndex;
            }
          });
        });
      }
    }
  }

  openMergeModal(selected?: any) {

    let temp = {uuid: this.substance.uuid, recordId: this.substance._metadata.recordId, matches: this.substance.matchedRecords}
    if (selected) {
      temp['mergeRecord'] = selected;
    }
    const dialogRef = this.dialog.open(MergeActionDialogComponent, {
      minWidth: '40%',
      maxWidth: '90%',
      height: '70%',
      data: temp
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  moreThanNumberCount(names, number) {
    if(names && names.length < number) {
      return false;
    } else {
      return true;
    }
  }

  showMoreLessNames() {
    this.showLessNames = !this.showLessNames;
  }

  showMoreLessCodes() {
    this.showLessCodes = !this.showLessCodes;
  }

  changePage(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    const skip = event.pageSize * event.pageIndex;
      this.privateMatches = JSON.parse(JSON.stringify(this.substance.matchedRecords)).slice(skip, (this.pageSize + skip));
     
  }


}
