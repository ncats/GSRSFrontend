import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-substance-form-overview',
  templateUrl: './substance-form-overview.component.html',
  styleUrls: ['./substance-form-overview.component.scss']
})
export class SubstanceFormOverviewComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  definitionTypes: Array<VocabularyTerm>;
  definitionLevels: Array<VocabularyTerm>;
  definitionTypeControl = new FormControl();
  definitionLevelControl = new FormControl();

  constructor(
    private cvService: ControlledVocabularyService
  ) {
    super();
  }

  ngOnInit() {
    this.getVocabularies();
  }

  ngAfterViewInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      const definitionType = this.substance && this.substance.definitionType || 'primary';
      this.definitionTypeControl.setValue(definitionType);
      const definitionLevel = this.substance && this.substance.definitionLevel || 'complete';
      this.definitionLevelControl.setValue(definitionLevel);
    });
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('DEFINITION_TYPE', 'DEFINITION_LEVEL').subscribe(response => {
      this.definitionTypes = response['DEFINITION_TYPE'].list;
      this.definitionLevels = response['DEFINITION_LEVEL'].list;
    });
  }

  updateDefinitionType(event: MatSelectChange): void {
    this.substance.definitionType = event.value;
  }

  updateDefinitionLevel(event: MatSelectChange): void {
    this.substance.definitionLevel = event.value;
  }
}
