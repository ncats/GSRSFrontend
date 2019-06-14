import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { Observable, Subject } from 'rxjs';
import { SubstanceReference } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';

@Component({
  selector: 'app-substance-form-references',
  templateUrl: './substance-form-references.component.html',
  styleUrls: ['./substance-form-references.component.scss']
})
export class SubstanceFormReferencesComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  references: Array<SubstanceReference>;

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Substance References');
  }

  ngAfterViewInit() {
    this.substanceFormService.substanceReferences.subscribe(references => {
      this.references = references;
    });
  }

}
