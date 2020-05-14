import { Injectable } from '@angular/core';
import { SubstanceFormServiceBase } from '../base-classes/substance-form-service-base';
import { SubstanceFormService } from '../substance-form.service';
import { DisulfideLink, Site } from '@gsrs-core/substance/substance.model';
import { Observable, ReplaySubject } from 'rxjs';

@Injectable()
export class SubstanceFormDisulfideLinksService extends SubstanceFormServiceBase<Array<DisulfideLink>> {
  private substanceCysteineEmitter = new ReplaySubject<Array<Site>>();

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
        if (this.substance.protein.disulfideLinks == null) {
          this.substance.protein.disulfideLinks = [];
        }
        this.substanceFormService.resetState();
        this.propertyEmitter.next(this.substance.protein.disulfideLinks);
        let available = [];
        for (let i = 0; i < this.substance.protein.subunits.length; i++) {
          const sequence = this.substance.protein.subunits[i].sequence;
          if (sequence != null && sequence.length > 0) {
            for (let j = 0; j < sequence.length; j++) {
              const site = sequence[j];
              if (site.toUpperCase() === 'C') {
                available.push({ 'residueIndex': (j + 1), 'subunitIndex': (i + 1) });
              }
            }
          }
        }

        this.substance.protein.disulfideLinks.forEach(link => {
          if (link.sites) {
            link.sites.forEach(site => {
              available = available.filter(r => (r.residueIndex !== site.residueIndex) || (r.subunitIndex !== site.subunitIndex));
            });
          }
        });
        this.substanceCysteineEmitter.next(available);
        const cysteineUpdatedSubscription = this.substanceFormService.cysteineUpdated().subscribe(cysteine => {
          this.substanceCysteineEmitter.next(cysteine);
        });
        this.subscriptions.push(cysteineUpdatedSubscription);
      }
      const linksUpdatedSubscription = this.substanceFormService.disulfideLinksUpdated().subscribe(disulfideLinks => {
        this.propertyEmitter.next(disulfideLinks);
      });
      this.subscriptions.push(linksUpdatedSubscription);
    });
    this.subscriptions.push(subscription);
  }

  unloadSubstance(): void {
    this.substanceCysteineEmitter.complete();
    this.substanceCysteineEmitter = new ReplaySubject<Array<Site>>();
    super.unloadSubstance();
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

  get substanceCysteineSites(): Observable<Array<Site>> {
    return this.substanceCysteineEmitter.asObservable();
  }

  updateCysteine(cysteine: Array<Site>): void {
    this.emitDisulfideLinkUpdate();
  }
}
