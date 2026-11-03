import {ChangeDetectionStrategy, Component, Input, OnInit} from '@angular/core';
import {PhysicalModificationParameter, SubstanceAmount, SubstanceParameter} from '@gsrs-core/substance';
import {UtilsService} from '@gsrs-core/utils';
import {FormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {AmountFormComponent} from '@gsrs-core/substance-form/amount-form/amount-form.component';

@Component({
    selector: 'app-physical-parameter-form',
    templateUrl: './physical-parameter-form.component.html',
    styleUrls: ['./physical-parameter-form.component.scss'],
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, AmountFormComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PhysicalParameterFormComponent implements OnInit {
  private privateParameter: PhysicalModificationParameter;
  constructor(
    private utilsService: UtilsService) { }

  ngOnInit() {
  }

  @Input()
  set parameter(parameter: PhysicalModificationParameter) {
    this.privateParameter = parameter;
    if ( !this.privateParameter.amount) {
      this.privateParameter.amount = {};
    }
  }

  get parameter(): PhysicalModificationParameter {
    return this.privateParameter;
  }

  get isValid(): boolean {
    return (this.privateParameter.parameterName != null && this.privateParameter.parameterName !== '');
  }
}
