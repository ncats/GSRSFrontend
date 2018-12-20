import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '../substance-card-base';
import { SubstanceCode } from '../../substance/substance.model';

@Component({
  selector: 'app-substance-codes',
  templateUrl: './substance-codes.component.html',
  styleUrls: ['./substance-codes.component.scss']
})
export class SubstanceCodesComponent extends SubstanceCardBase implements OnInit {
  type: string;
  codes: Array<SubstanceCode> = [];

  constructor() {
    super();
  }

  ngOnInit() {
    if (this.substance != null && this.type != null) {
      this.filterSubstanceCodes();
    }
  }

  private filterSubstanceCodes(): void {

    if (this.substance.codes && this.substance.codes.length > 0) {
      this.substance.codes.forEach(code => {
        if (code.comments && code.comments.indexOf('|') > -1 && this.type === 'classification') {
          this.codes.push(code);
        } else if (code.comments && code.comments.indexOf('|') === -1 && this.type === 'identifiers') {
          this.codes.push(code);
        }
      });
    }
    console.log(this.type);
    console.log(this.codes);
  }

}
