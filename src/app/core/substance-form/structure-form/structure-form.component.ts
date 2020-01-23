import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceMoiety, SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { MatDialog } from '@angular/material';
import { StructureImportComponent } from '../../structure/structure-import/structure-import.component';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { StructurePostResponse } from '../../structure/structure-post-response.model';
import { StructureImageModalComponent } from '../../structure/structure-image-modal/structure-image-modal.component';
import { NameResolverDialogComponent } from '@gsrs-core/name-resolver/name-resolver-dialog.component';
import { OverlayContainer } from '@angular/cdk/overlay';

@Component({
  selector: 'app-structure-form',
  templateUrl: './structure-form.component.html',
  styleUrls: ['./structure-form.component.scss']
})
export class StructureFormComponent implements OnInit {
  private privateStructure: SubstanceStructure | SubstanceMoiety = {};
  stereoChemistryTypeList: Array<VocabularyTerm> = [];
  opticalActivityList: Array<VocabularyTerm> = [];
  atropisomerismList: Array<VocabularyTerm> = [];
  @Input() hideAccess = false;
  @Input() showSettings = false;
  @Output() structureImported = new EventEmitter<StructurePostResponse>();
  @Output() nameResolved = new EventEmitter<string>();
  private overlayContainer: HTMLElement;

  constructor(
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer
  ) { }

  ngOnInit() {
    this.getVocabularies();
    this.overlayContainer = this.overlayContainerService.getContainerElement();
  }

  @Input()
  set structure(updatedStructure: SubstanceStructure | SubstanceMoiety) {
    if (updatedStructure != null) {
      this.privateStructure = updatedStructure;
    }
  }

  get structure(): (SubstanceStructure | SubstanceMoiety) {
    return this.privateStructure;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('STEREOCHEMISTRY_TYPE', 'OPTICAL_ACTIVITY', 'ATROPISOMERISM').subscribe(response => {
      this.stereoChemistryTypeList = response['STEREOCHEMISTRY_TYPE'].list;
      this.opticalActivityList = response['OPTICAL_ACTIVITY'].list;
      this.atropisomerismList = response['ATROPISOMERISM'].list;
    });
  }

  updateAccess(access: Array<string>): void {
    this.privateStructure.access = access;
  }

  openStructureImportDialog(): void {
    this.gaService.sendEvent('structureForm', 'button:import', 'import structure');
    const dialogRef = this.dialog.open(StructureImportComponent, {
      height: 'auto',
      width: '650px',
      data: {}
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe((response?: StructurePostResponse) => {
      this.overlayContainer.style.zIndex = null;
      if (response != null) {
        this.structureImported.emit(response);
      }
    }, () => {});
  }

  openNameResolverDialog(): void {
    this.gaService.sendEvent('structureForm', 'button:resolveName', 'resolve name');
    const dialogRef = this.dialog.open(NameResolverDialogComponent, {
      height: 'auto',
      width: '800px',
      data: {}
    });
    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe((molfile?: string) => {
      this.overlayContainer.style.zIndex = null;
      if (molfile != null && molfile !== '') {
        this.nameResolved.emit(molfile);
      }
    }, () => {});
  }

  openStructureImageModal(): void {

    const dialogRef = this.dialog.open(StructureImageModalComponent, {
      height: '90%',
      width: '650px',
      panelClass: 'structure-image-panel',
      data: {
        structure: this.privateStructure.id
      }
    });

    this.overlayContainer.style.zIndex = '1002';

    dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
    }, () => {
      this.overlayContainer.style.zIndex = null;
    });
  }

}
