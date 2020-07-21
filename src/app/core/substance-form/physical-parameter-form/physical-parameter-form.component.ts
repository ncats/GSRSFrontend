import {Component, Input, OnInit} from '@angular/core';
import {PhysicalModificationParameter, SubstanceAmount, SubstanceParameter} from '@gsrs-core/substance';
import {UtilsService} from '@gsrs-core/utils';

@Component({
  selector: 'app-physical-parameter-form',
  templateUrl: './physical-parameter-form.component.html',
  styleUrls: ['./physical-parameter-form.component.scss']
})
export class PhysicalParameterFormComponent implements OnInit {
  private privateParameter: PhysicalModificationParameter;
  constructor(
    private utilsService: UtilsService) { }

  ngOnInit() {
  }

  @Input()
  set parameter(parameter: SubstanceParameter) {
    this.privateParameter = parameter;
    if ( !this.privateParameter.amount) {
      this.privateParameter.amount = {};
    }
  }

  get parameter(): SubstanceParameter {
    return this.privateParameter;
  }

  get isValid(): boolean {
    return (this.privateParameter.parameterName != null && this.privateParameter.parameterName !== '');
  }
}
