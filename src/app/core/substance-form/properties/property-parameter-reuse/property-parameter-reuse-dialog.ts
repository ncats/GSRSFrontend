import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SubstanceProperty, SubstanceDetail, SubstanceParameter } from '../../../substance/substance.model';
import { VocabularyTerm } from '../../../controlled-vocabulary/vocabulary.model';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

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
    private substanceFormService: SubstanceFormService
  ) { }

  ngOnInit() {
    console.log('PropertyParameterReuseDialog, going to set up parameters array');
    console.log(`substance ID: ${this.substance != null ? this.substance.uuid: "[no substance]"} `);
    this.parametersForReuse = [];
    
    const substanceSubscription = this.substanceFormService.substance.subscribe(substance => {
      if( substance && substance != null ) {
        this.substance = substance;
        this.substance.properties?.forEach(pr=>{
          pr.parameters?.forEach(p=>{
            this.parametersForReuse.push(p);
          })
        })
        this.substanceFormService.resetState();
      }
    });
    this.subscriptions.push(substanceSubscription);
    console.log(`parametersForReuse contains ${this.parametersForReuse.length}`);
  }
  
   @Input()
  set substanceSetter(substance: SubstanceDetail) {
    this.substance = substance;
    console.log(`reuse received substance with UUID ${substance.uuid}`);
  }


  useThisParameter(paramNum: number): void {
    console.log('use parameter ' + paramNum);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}