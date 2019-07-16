import { Component, OnInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { SubstanceFormService } from '../substance-form.service';

@Component({
  selector: 'app-substance-form-codes',
  templateUrl: './substance-form-codes.component.html',
  styleUrls: ['./substance-form-codes.component.scss']
})
export class SubstanceFormCodesComponent extends SubstanceFormSectionBase implements OnInit {

  constructor() {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Codes');
  }

}
