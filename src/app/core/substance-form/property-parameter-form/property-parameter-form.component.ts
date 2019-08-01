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
  nameControl = new FormControl('', [Validators.required]);
  propertyTypeList: Array<VocabularyTerm> = [];
  parameterTypeControl = new FormControl('');

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set parameter(parameter: SubstanceParameter) {
    this.privateParameter = parameter;
    this.nameControl.setValue(this.privateParameter.name);
    this.nameControl.valueChanges.subscribe(value => {
      this.privateParameter.name = value;
    });
    this.parameterTypeControl.setValue(this.privateParameter.type);
    this.parameterTypeControl.valueChanges.subscribe(value => {
      this.privateParameter.type = value;
    });
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
    return;
  }
}
