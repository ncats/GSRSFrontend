import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceMoiety, SubstanceStructure } from '@gsrs-core/substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { MatDialog } from '@angular/material';
import { StructureImportComponent } from '../../structure/structure-import/structure-import.component';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { StructurePostResponse } from '@gsrs-core/structure';
import { NameResolverDialogComponent } from '@gsrs-core/name-resolver/name-resolver-dialog.component';

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

  constructor(
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private gaService: GoogleAnalyticsService
  ) { }

  ngOnInit() {
    this.getVocabularies();
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

    dialogRef.afterClosed().subscribe((response?: StructurePostResponse) => {
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

    dialogRef.afterClosed().subscribe((molfile?: string) => {
      if (molfile != null && molfile !== '') {
        this.nameResolved.emit(molfile);
      }
    }, () => {});
  }

}
