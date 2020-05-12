import { Injectable } from '@angular/core';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { Observable } from 'rxjs';
import { Linkage, Link } from '@gsrs-core/substance/substance.model';

@Injectable()
export class SubstanceFormLinksService extends SubstanceFormServiceBase<Array<Linkage>> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.nucleicAcid) {
        if (this.substance.nucleicAcid.linkages == null) {
          this.substance.nucleicAcid.linkages = [];
        }
        this.substanceFormService.resetState();
        this.propertyEmitter.next(this.substance.nucleicAcid.linkages);
      }
    });
    this.subscriptions.push(subscription);
    const linksUpdatedSubscription = this.substanceFormService.linksUpdated().subscribe(linkages => {
      this.propertyEmitter.next(linkages);
    });
    this.subscriptions.push(linksUpdatedSubscription);
  }

  get substanceLinks(): Observable<Array<Linkage>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceLink(): void {
    const newLinks: Linkage = {
      sites: []
    };
    this.substance.nucleicAcid.linkages.unshift(newLinks);
    this.propertyEmitter.next(this.substance.nucleicAcid.linkages);
  }

  deleteSubstanceLink(link: Link): void {
    const subLinkIndex = this.substance.nucleicAcid.linkages.findIndex(subCode => link.$$deletedCode === subCode.$$deletedCode);
    if (subLinkIndex > -1) {
      this.substance.nucleicAcid.linkages.splice(subLinkIndex, 1);
      this.propertyEmitter.next(this.substance.nucleicAcid.linkages);
    }
  }

  emitLinkUpdate(): void {
    this.propertyEmitter.next(this.substance.nucleicAcid.linkages);
  }
}
