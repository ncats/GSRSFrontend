import { Component, OnInit } from '@angular/core';
import {SubstanceCardBase} from '../substance-card-base';
import {UtilsService} from '../../utils/utils.service';
import {AgentModification, PhysicalModification, StructuralModification, SubstanceModifications} from '../../substance/substance.model';

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
    console.log(this.substance.modifications);
    if (this.substance != null) {
      if (this.substance.modifications.structuralModifications.length > 0) {
        this.structural = this.substance.modifications.structuralModifications;
        console.log(this.structural);
      }
      if (this.substance.modifications.physicalModifications.length > 0) {
        this.physical = this.substance.modifications.physicalModifications;
      }
      if (this.substance.modifications.agentModifications.length > 0) {
        this.agent = this.substance.modifications.agentModifications;
      }
    }
  }

}
