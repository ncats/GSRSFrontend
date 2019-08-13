import { Component, OnInit, AfterViewInit } from '@angular/core';
import { SubstanceFormSectionBase } from '../substance-form-section-base';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceProperty } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';

@Component({
  selector: 'app-substance-form-properties',
  templateUrl: './substance-form-properties.component.html',
  styleUrls: ['./substance-form-properties.component.scss']
})
export class SubstanceFormPropertiesComponent extends SubstanceFormSectionBase implements OnInit, AfterViewInit {
  properties: Array<SubstanceProperty>;

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService
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
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-property-0`, 'center');
    });
  }

  deleteProperty(property: SubstanceProperty): void {
    this.substanceFormService.deleteSubstanceProperty(property);
  }

}
