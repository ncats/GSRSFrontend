import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {UtilsService} from '../../utils/utils.service';
import {AgentModification, PhysicalModification, StructuralModification, SubstanceAmount} from '../../substance/substance.model';

@Component({
  selector: 'app-substance-modifications',
  templateUrl: './substance-modifications.component.html',
  styleUrls: ['./substance-modifications.component.scss']
})
export class SubstanceModificationsComponent extends SubstanceCardBase implements OnInit {
  structural: Array<StructuralModification>;
  physical: Array<PhysicalModification>;
  agent: Array<AgentModification>;
  structuralColumns: string[] = ['Modification Type', 'Location Site', 'Location Type', 'Residue Modified', 'Extent', 'Modification Name', 'Modification ID'];
  physicalColumns: string[] = ['Modification Role', 'Parameter Name', 'Amount'];
  agentColumns: string[] = ['Modification Process', 'Modification Role', 'Modification Type', 'Amount', 'Modification Agent', 'Approved ID'];
  constructor(
    private utilsService: UtilsService,
  ) {
    super();
  }

  ngOnInit() {

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
  }

  public toString(amount: SubstanceAmount) {
    let val = '';
    if (amount) {
      if ((amount.highLimit)  && (!amount.lowLimit) && (!amount.average) ) {
        val = '>' + (amount.highLimit);
      } else if ((!amount.highLimit) && (!amount.lowLimit) && (amount.average) ) {
        val = (amount.average) + '';
      } else if ((!amount.highLimit) && (amount.lowLimit)  && (!amount.average) ) {
        val = '<' + (amount.lowLimit);
      } else if ((amount.highLimit)  && (amount.lowLimit)  && (amount.average) ) {
        val = (amount.average) + '[' + (amount.lowLimit) + ' to ' + (amount.highLimit) + ']';
      } else if ((amount.highLimit)  && (!amount.lowLimit) && (amount.average) ) {
        val = (amount.average) + '[>' + (amount.highLimit) + ']';
      } else if ((!amount.highLimit) && (amount.lowLimit)  && (amount.average) ) {
        val = (amount.average) + '[<' + (amount.lowLimit) + ']';
      }
      if (amount.nonNumericValue ) {
        val += ' { ' + amount.nonNumericValue + ' }';
        val = val.trim();
      }
      if (amount.units != null) {
        val += ' (' + amount.units + ')';
        val = val.trim();
      }
      if (val.trim().length <= 0) {
        val = 'empty value';
      }
    }else{
      val = 'empty value';
    }


    return val;
  }

}
