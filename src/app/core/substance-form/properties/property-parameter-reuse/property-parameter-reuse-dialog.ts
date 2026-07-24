import { Component, OnInit, Input, Output, EventEmitter, OnDestroy, Inject } from '@angular/core';
import { SubstanceProperty, SubstanceDetail, SubstanceParameter } from '../../../substance/substance.model';
import { VocabularyTerm } from '../../../controlled-vocabulary/vocabulary.model';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { Subscription } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
    selector: 'property-parameter-reuse',
    templateUrl: 'property-parameter-reuse-dialog.html',
    styleUrls: ['property-parameter-reuse-dialog.scss'],
    standalone: false
})
export class PropertyParameterReuseDialog implements OnInit, OnDestroy {
  deleteTimer: any;
  referencedSubstanceUuid: string;
  @Output() propertyDeleted = new EventEmitter<SubstanceProperty>();
  propertyNameList: Array<VocabularyTerm> = [];
  propertyTypeList: Array<VocabularyTerm> = [];
  _nonNumeric: string;
  parametersForReuse: Array<SubstanceParameter>;
  private substance: SubstanceDetail;
  private subscriptions: Array<Subscription> = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: SubstanceDetail,
    private substanceFormService: SubstanceFormService,
    public dialogRef: MatDialogRef<PropertyParameterReuseDialog>
  ) { 
    this.substance = data;
  }

  ngOnInit() {
    this.parametersForReuse = [];
    this.assignParametersForReuse();
    console.log(`in ongOnIit, parametersForReuse.len: ${this.parametersForReuse.length}`);
  }
  
  @Input()
  set substanceSetter(substance: SubstanceDetail) {
    this.substance = substance;
  }


  useThisParameter(parameter: SubstanceParameter, paramNum: number): void {
    this.dialogRef.close(parameter);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  assignParametersForReuse(): void {
    this.substance.properties?.forEach(pr => {
      pr.parameters?.forEach(p => {
        console.log(`in assignParametersForReuse looking at p ${JSON.stringify(p)}`);
        const isNumeric = p.value?.average !== undefined || p.value?.units !== undefined;
        const isNonNumeric = p.value?.nonNumericValue !== undefined;

        const exists = this.parametersForReuse.some(existing => {
          if (existing.name !== p.name || existing.type !== p.type) {
            return false;
          }

          const existingIsNumeric =
            existing.value?.average !== undefined || existing.value?.units !== undefined;
          const existingIsNonNumeric =
            existing.value?.nonNumericValue !== undefined;

          if (isNumeric) {
            return (
              existingIsNumeric &&
              existing.value?.average === p.value?.average &&
              existing.value?.units === p.value?.units
            );
          }

          if (isNonNumeric) {
            return (
              existingIsNonNumeric &&
              existing.value?.nonNumericValue === p.value?.nonNumericValue
            );
          }

          return (
            !existingIsNumeric &&
            !existingIsNonNumeric
          );
        });

        if (!exists) {
          console.log('adding one parameter to parametersForReuse');
          this.parametersForReuse.push(p);
        }
      });
    });
    
  } 
}