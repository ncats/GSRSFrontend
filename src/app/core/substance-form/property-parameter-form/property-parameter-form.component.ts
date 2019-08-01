import { Component, OnInit, Input } from '@angular/core';
import { SubstanceParameter } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-property-parameter-form',
  templateUrl: './property-parameter-form.component.html',
  styleUrls: ['./property-parameter-form.component.scss']
})
export class PropertyParameterFormComponent implements OnInit {
  private privateParameter: SubstanceParameter;

  constructor() { }

  ngOnInit() {
  }

  @Input()
  set parameter(parameter: SubstanceParameter) {
    this.privateParameter = parameter;
  }

  get parameter(): SubstanceParameter {
    return this.privateParameter;
  }
}
