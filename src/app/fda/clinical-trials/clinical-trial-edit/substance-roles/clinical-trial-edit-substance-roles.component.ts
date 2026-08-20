import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { SubstanceRole } from '../../clinical-trial/clinical-trial.model';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import lodashIntersection from 'lodash/intersection';
import lodashMap from 'lodash/map';
import { FormControl } from '@angular/forms';
import { VocabularyTerm } from '@gsrs-core/controlled-vocabulary';

@Component({
    selector: 'app-clinical-trial-edit-substance-roles',
    templateUrl: './clinical-trial-edit-substance-roles.component.html',
    styleUrls: ['./clinical-trial-edit-substance-roles.component.scss'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ClinicalTrialEditSubstanceRolesComponent implements OnInit {
  @Input() tableRowIndex: number;
  @Input() disabled = true;
  @Input() initialSubstanceRoles: Array<SubstanceRole>;

  @Output() substanceRolesEventOutput = new EventEmitter<any>()

  rolesList: Array<VocabularyTerm> = [];
  selectedRolesTitle = ""; 
  substanceRolesForm: FormControl = new FormControl();
  initialSelections: Array<string> = [];  

  constructor(
    public cvService: ControlledVocabularyService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.cvService.getDomainVocabulary('CTUS_SUBSTANCE_ROLES').subscribe(response => {
      this.rolesList = response['CTUS_SUBSTANCE_ROLES'].list;
      if(this.initialSubstanceRoles)  {
        this.initialSelections = lodashIntersection(
          lodashMap(this.initialSubstanceRoles, 'substanceRole'),
          lodashMap(this.rolesList, 'value')
        );
        this.selectedRolesTitle = lodashMap(this.rolesList.filter(v => this.initialSelections.includes(v.value)), 'display').join(', ');
      }
      this.substanceRolesForm = new FormControl(this.initialSelections);
      this.cdr.markForCheck();
    });
  }
  
  onSelectionChange(ob) { 
    const newSubstanceRoles: Array<SubstanceRole> = [];
    this.selectedRolesTitle = ob.value.join(',');
    ob.value.forEach( (v, i) =>  {
      newSubstanceRoles.push({id: null, substanceRole: v});
    });
    const data = {value: newSubstanceRoles, tableRowIndex: this.tableRowIndex};
    this.substanceRolesEventOutput.emit(data);
  }
}
