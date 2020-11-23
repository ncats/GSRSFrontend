import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {UtilsService} from '../../utils/utils.service';
import {
  AgentModification,
  PhysicalModification,
  StructuralModification,
  SubstanceAmount,
  SubstanceDetail
} from '../../substance/substance.model';
import {Subject} from 'rxjs';

@Component({
  selector: 'app-substance-modifications',
  templateUrl: './substance-modifications.component.html',
  styleUrls: ['./substance-modifications.component.scss']
})
export class SubstanceModificationsComponent extends SubstanceCardBase implements OnInit {
  structural: Array<StructuralModification>;
  physical: Array<PhysicalModification>;
  agent: Array<AgentModification>;
  substanceUpdated = new Subject<SubstanceDetail>();
  structuralColumns: string[] = [
    'Modification Type',
    'Location Site',
    'Location Type',
    'Residue Modified',
    'Extent',
    'Modification Name',
    'Modification ID'
  ];
  physicalColumns: string[] = ['Modification Role', 'Parameter Name', 'Amount'];
  agentColumns: string[] = [
    'Modification Process',
    'Modification Role',
    'Modification Type',
    'Amount',
    'Modification Agent',
    'Approved ID'
  ];
  constructor(
    private utilsService: UtilsService,
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null) {
        if (this.substance.modifications.structuralModifications.length > 0) {
          this.structural = this.substance.modifications.structuralModifications;
        }
        if (this.substance.modifications.physicalModifications.length > 0) {
          this.physical = this.substance.modifications.physicalModifications;
        }
        if (this.substance.modifications.agentModifications.length > 0) {
          this.agent = this.substance.modifications.agentModifications;
        }
      }

      if (this.structural) {
        this.structural.forEach( item => {
          if (item.extentAmount) {
            item.$$amount = this.displayAmount(item.extentAmount);
          }
      });
      }
    });

    
  }

  displayAmount(amount: any): any {
    let returned = this.utilsService.displayAmount(amount);

    if (!returned || returned.trim().length === 0) {
      returned = 'empty value';
    }
    return returned;
  }

}
