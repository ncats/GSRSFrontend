import { Component, OnInit } from '@angular/core';
import { SubstanceCardBase } from '@gsrs-core/substance-details/substance-card-base';
import { Subject } from 'rxjs';
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-substance-ssg1-parent',
  templateUrl: './substance-ssg1-parent.component.html',
  styleUrls: ['./substance-ssg1-parent.component.scss']
})
export class SubstanceSsg1ParentComponent  extends SubstanceCardBase implements OnInit {
  substanceUpdated = new Subject<SubstanceDetail>();
  constructor() {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
  });
}

}
