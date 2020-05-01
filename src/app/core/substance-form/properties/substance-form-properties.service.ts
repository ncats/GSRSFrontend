import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { ReplaySubject, Observable } from 'rxjs';
import { SubstanceProperty } from '@gsrs-core/substance/substance.model';
import { SubstanceFormModule } from '../substance-form.module';

@Injectable({
  providedIn: SubstanceFormModule
})
export class SubstanceFormPropertiesService extends SubstanceFormServiceBase {

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
    this.propertyEmitter = new ReplaySubject<Array<SubstanceProperty>>();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.properties == null) {
        this.substance.properties = [];
      }
      this.substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.properties);
    });
    this.subscriptions.push(subscription);
  }

  get substanceProperties(): Observable<Array<SubstanceProperty>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceProperty(): void {
    const newProperty: SubstanceProperty = {
      value: {},
      references: [],
      access: []
    };
    this.substance.properties.unshift(newProperty);
    this.propertyEmitter.next(this.substance.properties);
  }

  addSubstancePropertyFromFeature(feature: any): void {
    let type = 'NUCLEIC ACID FEATURE';
    if (this.substance.substanceClass === 'protein') {
      type = 'PROTEIN FEATURE';
    }
    const newProperty: SubstanceProperty = {
      value: { 'nonNumericValue': feature.siteRange, 'type': 'Site Range' },
      propertyType: type,
      name: feature.name,
      references: [],
      access: []
    };
    this.substance.properties.unshift(newProperty);
    this.substanceFormService.recalculateAllSites('features');
    this.propertyEmitter.next(this.substance.properties);
  }

  deleteSubstanceProperty(property: SubstanceProperty): void {
    const subPropertyIndex =
      this.substance.properties.findIndex(subProperty => property.$$deletedCode === subProperty.$$deletedCode);
    if (subPropertyIndex > -1) {
      this.substance.properties.splice(subPropertyIndex, 1);
      this.propertyEmitter.next(this.substance.properties);
    }
  }
}
