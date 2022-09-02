import { Component, OnInit, Input, Output, EventEmitter, ComponentFactoryResolver, Inject, ViewChild } from '@angular/core';
import {
  SubstanceDetail,
  SubstanceName,
  SubstanceSummary,
  SubstanceCode,
  SubstanceRelationship,
  Subunit
} from '../../substance/substance.model';
import { DYNAMIC_COMPONENT_MANIFESTS, DynamicComponentManifest } from '@gsrs-core/dynamic-component-loader';
import { CardDynamicSectionDirective } from '../card-dynamic-section/card-dynamic-section.directive';
import { UtilsService } from '../../utils/utils.service';
import { SafeUrl } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { StructureService } from '@gsrs-core/structure';
import { SubstanceSummaryDynamicContent } from './substance-summary-dynamic-content.component';
import {Router} from '@angular/router';
import {Alignment} from '@gsrs-core/utils';
import { take } from 'rxjs/operators';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { ShowMolfileDialogComponent } from '@gsrs-core/substances-browse/substance-summary-card/show-molfile-dialog/show-molfile-dialog.component';
import { ConfigService } from '@gsrs-core/config';
import { Vocabulary } from '@gsrs-core/controlled-vocabulary';

@Component({
  selector: 'app-substance-summary-card',
  templateUrl: './substance-summary-card.component.html',
  styleUrls: ['./substance-summary-card.component.scss']
})
export class SubstanceSummaryCardComponent implements OnInit {
  private privateSubstance: SubstanceSummary;
  @Output() openImage = new EventEmitter<SubstanceSummary>();
  @Input() showAudit: boolean;
  isAdmin = false;  //this shouldn't be called "isAdmin", it's typically used to mean "canUpdate". Should fix for future devs.
  canCreate = false; //meant to allow creating new records
  subunits?: Array<Subunit>;
  @ViewChild(CardDynamicSectionDirective, {static: true}) dynamicContentContainer: CardDynamicSectionDirective;
  @Input() names?: Array<SubstanceName>;
  @Input() codeSystemNames?: Array<string>;
  @Input() codeSystemVocab?: Vocabulary;
//  @Input() codeSystems?: { [codeSystem: string]: Array<SubstanceCode> };
  alignments?: Array<Alignment>;
  inxightLink = false;
  inxightUrl: string;
  overlayContainer: any;
  rounding = '1.0-2';
  showAll = [];
  privateCodeSystems?: { [codeSystem: string]: Array<SubstanceCode> };
  privateCodeSystemNames?:  Array<string>;
  allPrimary = [];
  showLessNames = true;
  showLessCodes = true;

  constructor(
    public utilsService: UtilsService,
    public gaService: GoogleAnalyticsService,
    public authService: AuthService,
    private substanceService: SubstanceService,
    private structureService: StructureService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
    private configService: ConfigService,
    @Inject(DYNAMIC_COMPONENT_MANIFESTS) private dynamicContentItems: DynamicComponentManifest<any>[]
  ) { }

  ngOnInit() {
    console.log(this.codeSystemVocab);
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
    if (this.substance.approvalID) {
      this.substanceService.hasInxightLink(this.substance.approvalID).subscribe(response => {
        if (response.total && response.total > 0) {
          this.inxightLink = true;
          this.inxightUrl = 'https://drugs.ncats.io/drug/' + this.substance.approvalID;
        }
      }, error => {});
    } else {
      this.getApprovalID();
    }

    if (this.configService.configData && this.configService.configData.molWeightRounding) {
      this.rounding = '1.0-' + this.configService.configData.molWeightRounding;
    }
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
  set substance(substance: SubstanceSummary) {
    if (substance != null) {
      this.privateSubstance = substance;

      this.loadDynamicContent();
    }
  }

  get substance(): SubstanceSummary {
    return this.privateSubstance;
  }

  @Input()
  set codeSystems(codeSystems: any) {
    if (codeSystems && this.codeSystemNames) {
      this.privateCodeSystems = codeSystems;
      this.formatCodeSystems();
    }
  }

  get codeSystems(): any {
    return this.privateCodeSystems;
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
    this.substance.names = this.names
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

  loadDynamicContent(): void {
    const viewContainerRef = this.dynamicContentContainer.viewContainerRef;
    viewContainerRef.clear();
    if (this.configService.configData && this.configService.configData.loadedComponents){
      const dynamicContentItemsFlat =  this.dynamicContentItems.reduce((acc, val) => acc.concat(val), [])
      .filter(item => item.componentType === 'summary');
      dynamicContentItemsFlat.forEach(dynamicContentItem => {
        const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dynamicContentItem.component);
        const componentRef = viewContainerRef.createComponent(componentFactory);
        (<SubstanceSummaryDynamicContent>componentRef.instance).substance = this.privateSubstance;
      });
  }
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

  openMolModal() {

    const dialogRef = this.dialog.open(ShowMolfileDialogComponent, {
      minWidth: '40%',
      maxWidth: '90%',
      height: '90%',
      data: {uuid: this.substance.uuid, approval: this.substance.approvalID}
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      this.overlayContainer.style.zIndex = null;
    });
  }

  moreThanNumberCount(names, number) {
    if(names.length < number) {
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


}
