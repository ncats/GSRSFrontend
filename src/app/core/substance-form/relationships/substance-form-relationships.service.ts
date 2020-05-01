import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { ReplaySubject, Observable } from 'rxjs';
import { SubstanceRelationship } from '@gsrs-core/substance/substance.model';
import { SubstanceFormRelationshipsModule } from './substance-form-relationships.module';

@Injectable({
  providedIn: SubstanceFormRelationshipsModule
})
export class SubstanceFormRelationshipsService extends SubstanceFormServiceBase {

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
    this.propertyEmitter = new ReplaySubject<SubstanceRelationship>();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.relationships == null) {
        this.substance.relationships = [];
      }
      substanceFormService.resetState();
      this.propertyEmitter.next(this.substance.relationships);
    });
    this.subscriptions.push(subscription);
  }

  get substanceRelationships(): Observable<Array<SubstanceRelationship>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceRelationship(): void {
    const newRelationship: SubstanceRelationship = {
      relatedSubstance: {},
      amount: {},
      references: [],
      access: []
    };
    this.substance.relationships.unshift(newRelationship);
    this.propertyEmitter.next(this.substance.relationships);
  }

  deleteSubstanceRelationship(relationship: SubstanceRelationship): void {
    const subRelationshipIndex = this.substance.relationships
      .findIndex(subRelationship => relationship.$$deletedCode === subRelationship.$$deletedCode);
    if (subRelationshipIndex > -1) {
      this.substance.relationships.splice(subRelationshipIndex, 1);
      this.propertyEmitter.next(this.substance.relationships);
    }
  }
}
