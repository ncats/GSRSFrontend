import { Component, OnInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';

@Component({
  selector: 'app-substance-form-names',
  templateUrl: './substance-form-names.component.html',
  styleUrls: ['./substance-form-names.component.scss']
})
export class SubstanceFormNamesComponent extends SubstanceFormSectionBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Names');
  }

}
