import { Component, OnInit, Input, Output, EventEmitter, ComponentFactoryResolver, Inject, ViewChild } from '@angular/core';
import {
  SubstanceDetail,
  SubstanceBase,
  SubstanceName,
  SubstanceSummary,
  SubstanceCode,
  SubstanceRelationship,
  Subunit
} from '../../substance/substance.model';
import { DYNAMIC_COMPONENT_MANIFESTS, DynamicComponentManifest } from '@gsrs-core/dynamic-component-loader';
import { CardDynamicSectionDirective } from '../../substances-browse/card-dynamic-section/card-dynamic-section.directive';
import { UtilsService } from '../../utils/utils.service';
import { SafeUrl } from '@angular/platform-browser';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { StructureService } from '@gsrs-core/structure';
import { SubstanceSummaryDynamicContent } from '../../substances-browse/substance-summary-card/substance-summary-dynamic-content.component';
import {Router} from '@angular/router';
import {Alignment} from '@gsrs-core/utils';
import { take } from 'rxjs/operators';
import {Subject} from 'rxjs';
import { SubstanceCardBaseFilteredList } from '../substance-card-base-filtered-list';
import { GeneralService } from 'src/app/fda/service/general.service';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { SubstanceImageModule } from '@gsrs-core/substance/substance-image.module';
import { ifError } from 'assert';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'substance-dictionary-component',
  templateUrl: './substance-dictionary.component.html',
  styleUrls: ['./substance-dictionary.component.scss']
})
export class SubstanceDictionaryComponent extends SubstanceCardBaseFilteredList<SubstanceDetail> implements OnInit {
  private privateSubstance: SubstanceDetail;
  @Output() openImage = new EventEmitter<SubstanceSummary>();
  @Input() showAudit: boolean;
  isAdmin = false;
  subunits?: Array<Subunit>;
  @ViewChild(CardDynamicSectionDirective, {static: true}) dynamicContentContainer: CardDynamicSectionDirective;
  @Input() names?: Array<SubstanceName>;
  @Input() codeSystemNames?: Array<string>;
  @Input() codeSystems?: { [codeSystem: string]: Array<SubstanceCode> };
  alignments?: Array<Alignment>;
  inxightLink = false;
  inxightUrl: string;
  substanceUpdated = new Subject<SubstanceDetail>();
  innName: string;
  usanName: string;
  banName: string;
  pronName: string;
  iupacName: string;
  uspName: string;
  indexName: string;
  categoryName: string;
  usanDate: string;

  usanId: string;
  innId: string;
  uspId: string;
  casRn: string;
  mwDisplay: string;

  manufacturerNames: Array<ManufacturerName>;
  commonNames: Array<String>;
  MANUFACTURER_TYPE : string = 'MANUFACTURER';

  constructor(
    public utilsService: UtilsService,
    public gaService: GoogleAnalyticsService,
    public authService: AuthService,
    private substanceService: SubstanceService,
    private structureService: StructureService,
    private componentFactoryResolver: ComponentFactoryResolver,
    private router: Router,
    private configService: ConfigService,
    @Inject(DYNAMIC_COMPONENT_MANIFESTS) private dynamicContentItems: DynamicComponentManifest<any>[]
    
  ) { 
    super(gaService);
  }

  ngOnInit() {
    console.log('ngOnInit');
    this.substanceUpdated.subscribe(substance => {
      console.log('subscribe.  substance:' + substance);
      this.substance = substance;
      this.finishiInit();
    });
    this.authService.hasAnyRolesAsync('Updater', 'SuperUpdater').pipe(take(1)).subscribe(response => {
      if (response) {
        this.isAdmin = response;
      }
    });
    this.manufacturerNames = [];
    this.commonNames=[];
  }

  finishiInit() {
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
    this.innName = '';
    this.pronName='';
    this.banName='';
    this.usanName='';

    this.substance.names.forEach(name => {
      //console.log('name.name: ' + name.name);
      if (name.name.toUpperCase().endsWith('[INN]') ) {
        console.log('found our innName');
        this.innName = name.name.replace('[INN]','');
      } else if(name.name.toUpperCase().endsWith('[USAN]')){
        this.usanName=name.name.replace('[USAN]','');
        console.log('found our usanName');
      } else if(name.name.toUpperCase().endsWith('[BAN]')){
        console.log('found our banName');
        this.banName=name.name.replace('[BAN]','');
      } else if(name.name.toUpperCase().endsWith('[IUPAC]')) {
        console.log('found our iupacName');
        this.iupacName=name.name.replace('[IUPAC]', '');
      } else if(name.name.toUpperCase().endsWith('[USP]')) {
        console.log('found our uspName');
        this.uspName=name.name;
      } else if(name.name.toUpperCase().endsWith('[INDEX-NAME]')) {
      console.log('found our index name');
      this.indexName=name.name.replace('[INDEX-NAME]','');
      } else if(name.type.toUpperCase()==='PRON'){
        this.pronName=name.name;
      }else if (name.type.toUpperCase()==='CATEGORY') {
        this.categoryName =name.name;
      } else if( name.type.toUpperCase()==='CN') {
        let commonName = this.commonNames.find(n=> n=== name.name);
        console.log('commonName: ' + commonName);
        if( !commonName || commonName===null) {
          console.log('adding common name: ' + name.name);
          this.commonNames.push(name.name);
        }
      }
      let manufName = this.getManufacturerName(name, this.substance);
      
      if(manufName != null && manufName.length>0) {
        console.log('found manuf name ' + manufName);
        let matchedManuName = this.manufacturerNames.find(n=> n.substanceName=== name.name);
        console.log('matchedManuName: ' + matchedManuName);
        if( !matchedManuName || matchedManuName===null) {
          console.log('ADDED');
          this.manufacturerNames.push( new ManufacturerName( name.name, manufName));
        }
      }

      this.substance.references.forEach(r=>{
        if(r.docType.toUpperCase() === 'USAN DATE') {
          this.usanDate = r.citation;
        }
      });
    });

    this.substance.codes.forEach(cd=>{
      if( cd.codeSystem==='CAS' && cd.type==='PRIMARY') {
        this.casRn = cd.code;
      } else if( cd.codeSystem==='INN' && cd.type==='PRIMARY') {
        this.innId=cd.code;
      } else if(cd.codeSystem==='USAN' && cd.type==='PRIMARY')/*may not exist*/ {
        this.usanId = cd.code;
      }

    });
    console.log('in init, this.manufacturerNames.length: ' + this.manufacturerNames.length);

    if(this.substance.structure ){
      this.mwDisplay = this.substance.structure.mwt.toString();
    }
    this.mwDisplay= this.getMwDisplay(this.substance);

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

/*  @Input()
  set substance(substance: SubstanceDetail) {
    if (substance != null) {
      this.privateSubstance = substance;
      this.substance=substance;
      this.loadDynamicContent();
    }
  }*/

  getSubstanceDetails(id: string, version?: string) {
    this.substanceService.getSubstanceDetails(id, version).subscribe(response => {
      if (response) {
        //this.substance = response;
        this.substanceUpdated.next(response);
        
      } else {
        //this.handleSubstanceRetrivalError();
      }
      //this.loadingService.setLoading(false);
    }, error => {
      this.gaService.sendException('getSubstanceDetails: error from API call');
//      this.loadingService.setLoading(false);
//      this.handleSubstanceRetrivalError();
    });
  }


  /*get substance(): SubstanceDetail {
    return this.privateSubstance;
  }*/

  openImageModal(): void {
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
    const dynamicContentItemsFlat =  this.dynamicContentItems.reduce((acc, val) => acc.concat(val), [])
    .filter(item => item.componentType === 'summary');
    dynamicContentItemsFlat.forEach(dynamicContentItem => {
      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(dynamicContentItem.component);
      const componentRef = viewContainerRef.createComponent(componentFactory);
      (<SubstanceSummaryDynamicContent>componentRef.instance).substance = this.privateSubstance;
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

  getManufacturerName(subName : SubstanceName, parentSubstance: SubstanceDetail) : string{
    if(subName==null) {
      return null;
    }
    let manufactured = null;

    console.log('in isManufacturerName, subName ' + subName.name);
    //parentSubstance.references.forEach(pr=> console.log('parent ref: ' + pr.uuid + ' type: ' + pr.docType + '; cit: ' + pr.citation));
      
    subName.references.forEach(r=>{
      console.log('looking for ref ' + r);
      const foundItem= parentSubstance.references.find(pr=>pr.uuid===r && pr.docType===this.MANUFACTURER_TYPE);
      if(foundItem != null){
        console.log('found item: ' + JSON.stringify(foundItem));
        manufactured = foundItem.citation;
      }
    });
    return manufactured;
  }

  getMwDisplay(chemicalSubstance: any): string {
    const defaultDisplayValue= '[unassigned]';
    var displayValue= defaultDisplayValue;
    if( this.configService.configData && this.configService.configData.molecularWeightPropertyName)  {

    }
    const mwPropertyname =( this.configService.configData && this.configService.configData.molecularWeightPropertyName) ? 
      this.configService.configData.molecularWeightPropertyName : 'MOL_WEIGHT (calc)';
    console.log('mwPropertyname: ' + mwPropertyname);
    chemicalSubstance.properties.forEach(element => {
        if(element.name.indexOf( mwPropertyname) ===0) {
            displayValue = element.value.average != null ? element.value.average : element.value.nonNumericValue;
            console.log('using property');
            //displayValue += ' prop';
        }
        
    });
    if( (displayValue.length ===0 ||displayValue===defaultDisplayValue) && chemicalSubstance.structure !==null) {
        displayValue=chemicalSubstance.structure.mwt;
        console.log('using intrinsic MW');
    }
     return displayValue;
  }

}

export class ManufacturerName {
  substanceName: string;
  manufacturerName: string;

  constructor(subName: string, manuName: string) {
    this.substanceName  =subName;
    this.manufacturerName= manuName;
  }

}
