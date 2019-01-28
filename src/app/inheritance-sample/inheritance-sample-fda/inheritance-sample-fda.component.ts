import { Component, OnInit } from '@angular/core';
import { InheritanceSampleBase } from '../inheritance-sample-base';

@Component({
  selector: 'app-inheritance-sample-fda',
  templateUrl: './inheritance-sample-fda.component.html',
  styleUrls: ['./inheritance-sample-fda.component.scss']
})
export class InheritanceSampleFdaComponent extends InheritanceSampleBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
  }

}
