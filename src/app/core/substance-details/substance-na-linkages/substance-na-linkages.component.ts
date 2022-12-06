import {Component, OnDestroy, OnInit} from '@angular/core';
import {Linkage, Site, SubstanceDetail} from '../../substance/substance.model';
import {SubstanceCardBase} from '../substance-card-base';
import {Subject, Subscription} from 'rxjs';
import {DataDictionaryService} from '@gsrs-core/utils/data-dictionary.service';
import {ControlledVocabularyService, VocabularyDictionary, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';

@Component({
  selector: 'app-substance-na-linkages',
  templateUrl: './substance-na-linkages.component.html',
  styleUrls: ['./substance-na-linkages.component.scss']
})
export class SubstanceNaLinkagesComponent extends SubstanceCardBase implements OnInit, OnDestroy {
  linkages: Array<Linkage>;
  displayedColumns: string[] = ['linkage' , 'Structure', 'Site Range' , 'Site Count' ];
  siteCount: number;
  vocabulary: any;
  substanceUpdated = new Subject<SubstanceDetail>();
  subscriptions: Array<Subscription> = [];


  constructor(
    public cvService: ControlledVocabularyService,
  ) {
    super();
  }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.substance = substance;
      if (this.substance != null
        && this.substance.nucleicAcid != null
        && this.substance.nucleicAcid.linkages != null
        && this.substance.nucleicAcid.linkages.length) {
        this.linkages = this.substance.nucleicAcid.linkages;
        this.countUpdate.emit(this.linkages.length);
        const cvSubscription =  this.cvService.getDomainVocabulary('NUCLEIC_ACID_LINKAGE').subscribe(response => {
          this.vocabulary = response['NUCLEIC_ACID_LINKAGE'].dictionary;
          this.linkages.forEach(linkage => {
            if(this.vocabulary[linkage.linkage]) {
              linkage.structure = this.cvService.getStructureUrlFragment(this.vocabulary[linkage.linkage].fragmentStructure);
            } else {
              linkage.structure = null;
            }
          })
        });
        this.subscriptions.push(cvSubscription);
        this.getTotalSites();
      }
    });
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getTotalSites() {
    this.siteCount = 0;
    for (const linkage of this.linkages) {
      this.siteCount = this.siteCount + linkage.sites.length;
    }

  }

  getSiteCount(sites: Array<Site>): string {
    return sites.length + '/' + this.siteCount;
  }

  getLinkageDisplay(term: string): string {
    if (this.vocabulary && this.vocabulary[term] && this.vocabulary[term].display) {
      return this.vocabulary[term].display;
    } else {
      return term;
    }
  }

}
