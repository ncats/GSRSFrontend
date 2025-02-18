import {Component, OnInit, Input} from '@angular/core';
import { SubstanceMoiety, SubstanceStructure } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-nitrosamine-display',
  templateUrl: './nitrosamine-display.component.html',
  styleUrls: ['./nitrosamine-display.component.scss']
})
export class NitrosamineDisplayComponent implements OnInit {
  private privateStructure: SubstanceStructure | SubstanceMoiety = {};
  constructor() { }

   @Input()
    set structure(updatedStructure: SubstanceStructure | SubstanceMoiety) {
      if (updatedStructure != null) {
        this.privateStructure = updatedStructure;
      }
    }
  
    get structure(): (SubstanceStructure | SubstanceMoiety) {
      return this.privateStructure;
    }

  ngOnInit(): void {
  }

}
