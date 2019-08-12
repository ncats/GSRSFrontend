import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceProperty } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-substance-form-properties',
  templateUrl: './substance-form-properties.component.html',
  styleUrls: ['./substance-form-properties.component.scss']
})
export class SubstanceFormPropertiesComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  properties: Array<SubstanceProperty>;

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super();
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Properties');
  }

  ngAfterViewInit() {
    this.substanceFormService.substanceProperties.subscribe(properties => {
      this.properties = properties;
    });
  }

  addProperty(): void {
    this.substanceFormService.addSubstanceProperty();
  }

  deleteProperty(property: SubstanceProperty): void {
    this.substanceFormService.deleteSubstanceProperty(property);
  }

}
