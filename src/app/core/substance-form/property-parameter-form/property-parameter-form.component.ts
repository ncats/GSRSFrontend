import { Component, OnInit, Input } from '@angular/core';
import { SubstanceParameter } from '@gsrs-core/substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-property-parameter-form',
  templateUrl: './property-parameter-form.component.html',
  styleUrls: ['./property-parameter-form.component.scss']
})
export class PropertyParameterFormComponent implements OnInit {
  private privateParameter: SubstanceParameter;
  propertyTypeList: Array<VocabularyTerm> = [];

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set parameter(parameter: SubstanceParameter) {
    this.privateParameter = parameter;
  }

  get parameter(): SubstanceParameter {
    return this.privateParameter;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('PROPERTY_TYPE').subscribe(response => {
      this.propertyTypeList = response['PROPERTY_TYPE'].list;
    });
  }

  get isValid(): boolean {
    return (this.privateParameter.name != null || this.privateParameter.name !== '')
      && (this.privateParameter.type != null || this.privateParameter.type !== '');
  }
}
