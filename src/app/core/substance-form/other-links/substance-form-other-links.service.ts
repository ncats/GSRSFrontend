import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { ReplaySubject, Observable } from 'rxjs';
import { Link } from '@gsrs-core/substance/substance.model';
import { SubstanceFormOtherLinksModule } from './substance-form-other-links.module';

@Injectable({
  providedIn: SubstanceFormOtherLinksModule
})
export class SubstanceFormOtherLinksService extends SubstanceFormServiceBase<Array<Link>> {

  constructor(
    public substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
  }

  initSubtanceForm(): void {
    super.initSubtanceForm();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.protein) {
        if (this.substance.protein.otherLinks == null) {
          this.substance.protein.otherLinks = [];
        }
        this.substanceFormService.resetState();
        this.propertyEmitter.next(this.substance.protein.otherLinks);
      }
    });
    this.subscriptions.push(subscription);
    const otherLinksUpdatedSubscription = this.substanceFormService.otherLinksUpdated().subscribe(links => {
      this.propertyEmitter.next(links);
    });
    this.subscriptions.push(otherLinksUpdatedSubscription);
  }

  get substanceOtherLinks(): Observable<Array<Link>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceOtherLink(): void {
    const newOtherLinks: Link = {
      references: [],
      access: []
    };
    this.substance.protein.otherLinks.unshift(newOtherLinks);
    this.propertyEmitter.next(this.substance.protein.otherLinks);
  }

  deleteSubstanceOtherLink(link: Link): void {
    const subLinkIndex = this.substance.protein.otherLinks.findIndex(subCode => link.$$deletedCode === subCode.$$deletedCode);
    if (subLinkIndex > -1) {
      this.substance.protein.otherLinks.splice(subLinkIndex, 1);
      this.propertyEmitter.next(this.substance.protein.otherLinks);
    }
  }
}
