import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input } from '@angular/core';
import { SubstanceParameter } from '@gsrs-core/substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, FormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { AmountFormComponent } from '@gsrs-core/substance-form/amount-form/amount-form.component';

@Component({
    selector: 'app-property-parameter-form',
    templateUrl: './property-parameter-form.component.html',
    styleUrls: ['./property-parameter-form.component.scss'],
    standalone: true,
    imports: [FormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatOptionModule, AmountFormComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PropertyParameterFormComponent implements OnInit {
  private privateParameter: SubstanceParameter;
  propertyTypeList: Array<VocabularyTerm> = [];

  constructor(
    private cvService: ControlledVocabularyService,
    private cdr: ChangeDetectorRef
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
      this.cdr.markForCheck();
    });
  }

  get isValid(): boolean {
    return (this.privateParameter.name != null && this.privateParameter.name !== '')
      && (this.privateParameter.type != null && this.privateParameter.type !== '');
  }
}
