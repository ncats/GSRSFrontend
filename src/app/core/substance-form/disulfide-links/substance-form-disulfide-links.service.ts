import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { DisulfideLink, Site } from '@gsrs-core/substance/substance.model';
import { ReplaySubject, Observable } from 'rxjs';
import { SubstanceFormModule } from '../substance-form.module';

@Injectable({
  providedIn: SubstanceFormModule
})
export class SubstanceFormDisulfideLinksService extends SubstanceFormServiceBase {

  constructor(
    private substanceFormService: SubstanceFormService
  ) {
    super(substanceFormService);
    this.propertyEmitter = new ReplaySubject<Array<DisulfideLink>>();
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
      if (this.substance.protein) {
        if (this.substance.protein.disulfideLinks == null) {
          this.substance.protein.disulfideLinks = [];
        }
        this.substanceFormService.resetState();
        this.propertyEmitter.next(this.substance.protein.disulfideLinks);
      }
    });
    this.subscriptions.push(subscription);
    const linksUpdatedSubscription = this.substanceFormService.disulfideLinksUpdated().subscribe(disulfideLinks => {
      this.propertyEmitter.next(disulfideLinks);
    });
    this.subscriptions.push(linksUpdatedSubscription);
  }

  get substanceDisulfideLinks(): Observable<Array<DisulfideLink>> {
    return this.propertyEmitter.asObservable();
  }

  addSubstanceDisulfideLink(): void {
    const newDisulfideLinks: DisulfideLink = {};
    this.substance.protein.disulfideLinks.unshift(newDisulfideLinks);
    this.propertyEmitter.next(this.substance.protein.disulfideLinks);
  }

  addCompleteDisulfideLinks(sites: Array<Site>): void {
    sites.forEach(link => {
      const newSites = [{ subunitIndex: link[0].subunitIndex, residueIndex: link[0].residueIndex },
      { subunitIndex: link[1].subunitIndex, residueIndex: link[1].residueIndex },
      ];
      const newDisulfideLinks: DisulfideLink = {
        sites:
          newSites
      };
      this.substance.protein.disulfideLinks.unshift(newDisulfideLinks);
    });
    this.emitDisulfideLinkUpdate();
  }

  deleteSubstanceDisulfideLink(disulfideLink: DisulfideLink): void {
    const subLinkIndex =
      this.substance.protein.disulfideLinks.findIndex(subLink => disulfideLink.$$deletedCode === subLink.$$deletedCode);
    if (subLinkIndex > -1) {
      this.substance.protein.disulfideLinks.splice(subLinkIndex, 1);
      this.emitDisulfideLinkUpdate();
    }
  }

  deleteAllDisulfideLinks(): void {
    this.substance.protein.disulfideLinks = [];
    this.emitDisulfideLinkUpdate();
  }

  emitDisulfideLinkUpdate(): void {
    this.substanceFormService.recalculateAllSites('disulfide');
    this.propertyEmitter.next(this.substance.protein.disulfideLinks);
    this.substanceFormService.recalculateCysteine();
  }
}
