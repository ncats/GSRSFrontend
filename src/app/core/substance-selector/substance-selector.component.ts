import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceService } from '../substance/substance.service';
import { SubstanceSummary } from '../substance/substance.model';
import { ConfigService } from '@gsrs-core/config';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AdvancedSelectorDialogComponent } from '@gsrs-core/substance-selector/advanced-selector-dialog/advanced-selector-dialog.component';
import { StructureImageModalComponent } from '@gsrs-core/structure';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';

@Component({
  selector: 'app-substance-selector',
  templateUrl: './substance-selector.component.html',
  styleUrls: ['./substance-selector.component.scss']
})
export class SubstanceSelectorComponent implements OnInit {
  selectedSubstance?: SubstanceSummary;
  @Input() eventCategory: string;
  @Output() selectionUpdated = new EventEmitter<SubstanceSummary>();
  @Input() placeholder = 'Search';
  @Input() hintMessage = '';
  @Input() header = 'Substance';
  @Input() name?: string;
  @Input() hideImage?: boolean;
  @Input() showMorelinks? = false;
  errorMessage: string;
  showOptions: boolean;
  previousSubstance: SubstanceSummary;
  displayName: string;
  overlayContainer: any;
  savedRecord: SubstanceSummary;

  // Change to configuration approach.
  private substanceSelectorProperties: Array<string> = null;
  /*
    'root_names_name',
    'root_names_stdName',
    'root_approvalID',
    'CAS',
    'ECHA\ \(EC\/EINECS\)'
  ];
  */
  constructor(
    public substanceService: SubstanceService,
    private substanceFormService: SubstanceFormService,
    public configService: ConfigService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
  ) { }

  StoreSelection() {
   // sessionStorage.setItem('GSRS-default-selected-substance', JSON.stringify(this.selectedSubstance));
   this.substanceFormService.setStoredRelated(this.selectedSubstance, this.header);
   alert('Default ' + this.header + ' is set to ' + this.selectedSubstance._name);
  }

  ngOnInit() {

   // const data = sessionStorage.getItem('GSRS-default-selected-substance');
   const data = this.substanceFormService.getStoredRelated(this.header);
    if(data) {
      this.selectedSubstance = data;
      this.selectionUpdated.emit(this.selectedSubstance);
    }

   
        
    if (this.configService.configData.substanceSelectorProperties != null) {
      this.substanceSelectorProperties = this.configService.configData.substanceSelectorProperties;
    } else {
      console.log("The config value for substanceSelectorProperties is null.");
    }
    this.overlayContainer = this.overlayContainerService.getContainerElement();

  }

  @Input()
  set subuuid(uuid: string) {
    if (uuid) {
      this.substanceService.getSubstanceSummary(uuid).subscribe(response => {
        this.selectedSubstance = response;
      }, error => {
        if (this.name && this.name !== '') {
          this.selectedSubstance = {_name: this.name};
        } else {
          this.selectedSubstance = {_name: ''};
        }
        this.errorMessage = 'Not in database';
      });
    }
  }

  processSubstanceSearch(searchValue: string = ''): void {
    const q = searchValue.replace('\"', '');
    console.log('processing');
    const searchStr = this.substanceSelectorProperties.map(property => `${property}:\"^${q}$\"`).join(' OR ');

    this.substanceService.getQuickSubstancesSummaries(searchStr, true).subscribe(response => {
      if (response.content && response.content.length) {
        this.selectedSubstance = response.content[0];
        console.log(response);
        this.selectionUpdated.emit(this.selectedSubstance);
        this.errorMessage = '';
      } else {
        this.errorMessage = 'No substances found';
      }
    });
  }

 

  advanced(type: string): void {

    let active = 0;
    if (type === 'name') {
      active = 1;
    } 
    const dialogRef = this.dialog.open(AdvancedSelectorDialogComponent, {
      minWidth: '75%',
      maxWidth: '90%',
      height: '92%',
      data: {uuid: this.selectedSubstance ? this.selectedSubstance.uuid : null,
          name: this.selectedSubstance ? this.selectedSubstance._name : null,
      tab: active}
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectedSubstance = result;
        this.selectionUpdated.emit(result);
      }
      
      this.overlayContainer.style.zIndex = null;
    });
  }


  openImageModal() {
    let data: any;
    let molfile: string;
    let substance = this.selectedSubstance;

    if (substance.substanceClass === 'chemical') {
      data = {
        structure: substance.uuid,
        smiles: substance.structure.smiles,
        uuid: substance.uuid,
        names: substance.names,
        component: 'substanceSelector'
      };
      molfile = substance.structure.molfile;
    } else {
      data = {
        structure: substance.uuid,
        names: substance.names,
        component: 'substanceSelector'
      };
      if (substance.polymer) {
        molfile = substance.polymer.idealizedStructure.molfile;
      } else {
        molfile = null;
      }
    }

    

    const dialogRef = this.dialog.open(StructureImageModalComponent, {
      width: '650px',
      panelClass: 'structure-image-panel',
      data: data
    });

    this.overlayContainer.style.zIndex = '1002';

    const subscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    }, () => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    });
  }

  editSelectedSubstance(): void {
    this.previousSubstance = JSON.parse(JSON.stringify(this.selectedSubstance));
    this.selectedSubstance = null;
    this.selectionUpdated.emit(this.selectedSubstance);
  }

  revertEdit(): void {
    this.selectedSubstance = JSON.parse(JSON.stringify(this.previousSubstance));
    this.selectionUpdated.emit(this.selectedSubstance);
  }

  delete(): void {
    this.selectedSubstance = null;
    this.selectionUpdated.emit(null);
  }

}
