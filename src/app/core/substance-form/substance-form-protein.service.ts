import { Injectable } from '@angular/core';
import {
  SubstanceDetail,
  SubstanceReference,
  SubstanceName,
  SubstanceStructure,
  SubstanceMoiety,
  SubstanceCode,
  SubstanceRelationship,
  SubstanceNote,
  SubstanceProperty,
  Subunit,
  Link,
  DisulfideLink,
  Glycosylation,
  Site,
  AgentModification,
  PhysicalModification,
  StructuralModification,
  PhysicalModificationParameter, Protein, ProteinFeatures, Feature
} from '../substance/substance.model';
import {
  SubstanceFormDefinition,
  SubstanceFormResults, ValidationResults
} from './substance-form.model';
import {Observable, Subject, observable, Subscription} from 'rxjs';
import { SubstanceService } from '../substance/substance.service';
import { domainKeys, domainDisplayKeys } from './references/domain-references/domain-keys.constant';
import { UtilsService } from '../utils/utils.service';
import { StructureService } from '@gsrs-core/structure';
import { DomainsWithReferences } from './references/domain-references/domain.references.model';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';

@Injectable({
  providedIn: 'root'
})
export class SubstanceFormProteinService {
  private allLinksEmitter = new Subject<Array<Feature>>();
  private test: string;
  allSites: Array<DisplaySite>;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormService: SubstanceFormService
  ) { }


  /*get allSites(): Observable<Array<DisplaySite>> {
    return new Observable(observer => {
      this.ready().subscribe(() => {
        if (this.allSites == null) {
          this.allSites = [];
        }

        const disulfideLinksSubscription = this.substanceFormService.substanceDisulfideLinks.subscribe(disulfideLinks => {
          disulfideLinks.forEach(link => {
            link.sites.forEach(site => {
              const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'disulfide'};
              this.allSites.push(newLink);
            });
          });
        });
        this.subscriptions.push(disulfideLinksSubscription);

        const otherLinksSubscription = this.substanceFormService.substanceOtherLinks.subscribe(otherLinks => {
          otherLinks.forEach(link => {
            if (link.sites) {
              link.sites.forEach(site => {
                const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'other'};
                this.allSites.push(newLink);
                //    this.otherSites.push(site);
              });
            }
          });
        });
        this.subscriptions.push(otherLinksSubscription);

        const glycosylationSubscription = this.substanceFormService.substanceGlycosylation.subscribe(glycosylation => {
          this.glycosylation = glycosylation;


          if (glycosylation.CGlycosylationSites) {

            glycosylation.CGlycosylationSites.forEach(site => {
              // this.CGlycosylationSites.push(site);
              const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Cglycosylation'};
              this.allSites.push(newLink);
            });
          }

          if (glycosylation.NGlycosylationSites) {
            glycosylation.NGlycosylationSites.forEach(site => {
              //    this.NGlycosylationSites.push(site);
              const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Nglycosylation'};
              this.allSites.push(newLink);
            });
          }

          if (glycosylation.OGlycosylationSites) {
            glycosylation.OGlycosylationSites.forEach(site => {
              //this.OGlycosylationSites.push(site);
              const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'Oglycosylation'};
              this.allSites.push(newLink);
            });
          }
        });
        console.log(this.allSites);
        observer.next(this.allSites);
        this.customFeaturesEmitter.subscribe(sites => {
          console.log(sites);
          observer.next(this.allSites);
        });
      });
    });
  }*/



}
  interface DisplaySite {
  type: string;
  subunit: number;
  residue: number;
}
