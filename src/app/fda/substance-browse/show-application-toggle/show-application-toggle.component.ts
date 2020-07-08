import { Component, OnInit } from '@angular/core';
import { SubstanceBrowseHeaderDynamicContent } from '@gsrs-core/substances-browse/substance-browse-header-dynamic-content.component';

@Component({
  selector: 'app-show-application-toggle',
  templateUrl: './show-application-toggle.component.html',
  styleUrls: ['./show-application-toggle.component.scss']
})
export class ShowApplicationToggleComponent implements OnInit, SubstanceBrowseHeaderDynamicContent {
  test: any;
  constructor() { }

  ngOnInit() {
  }

}
