import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '@gsrs-core/substance-details/substance-card-base';

@Component({
  selector: 'app-sample-card',
  templateUrl: './sample-card.component.html',
  styleUrls: ['./sample-card.component.scss']
})
export class SampleCardComponent extends SubstanceCardBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {}

}
