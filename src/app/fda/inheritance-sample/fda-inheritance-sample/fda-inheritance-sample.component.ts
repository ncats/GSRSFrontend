import { Component, OnInit } from '@angular/core';
import { InheritanceSampleBase } from '../inheritance-sample-base';
import { SubstanceService } from '../../../core/substance/substance.service';

@Component({
  selector: 'app-fda-inheritance-sample',
  templateUrl: './fda-inheritance-sample.component.html',
  styleUrls: ['./fda-inheritance-sample.component.scss']
})
export class FdaInheritanceSampleComponent extends InheritanceSampleBase implements OnInit {

  constructor(
    public substanceService: SubstanceService
  ) {
    super(substanceService);
  }

  ngOnInit() {
    this.message = 'this is the FDA message';
  }

}
