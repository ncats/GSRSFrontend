import {Component, OnDestroy, OnInit} from '@angular/core';
import {Sugar, Site, SubstanceDetail} from '../../substance/substance.model';
import {SubstanceCardBase} from '../substance-card-base';
import {Subject, Subscription} from 'rxjs';
import {ControlledVocabularyService} from '@gsrs-core/controlled-vocabulary';

@Component({
  selector: 'app-substance-na-sugars',
  templateUrl: './substance-na-sugars.component.html',
  styleUrls: ['./substance-na-sugars.component.scss']
})
export class SubstanceNaSugarsComponent extends SubstanceCardBase implements OnInit, OnDestroy {
  sugars: Array<Sugar>;
  displayedColumns: string[] = ['Sugar' , 'Structure', 'Site Range' , 'Site Count' ];
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
        && this.substance.nucleicAcid.sugars != null
        && this.substance.nucleicAcid.sugars.length) {
        this.sugars = this.substance.nucleicAcid.sugars;
        this.countUpdate.emit(this.sugars.length);
        const cvSubscription =  this.cvService.getDomainVocabulary('NUCLEIC_ACID_SUGAR').subscribe(response => {
          this.vocabulary = response['NUCLEIC_ACID_SUGAR'].dictionary;
          this.sugars.forEach(sugar => {
            if(this.vocabulary[sugar.sugar]) {
              sugar.structure = this.cvService.getStructureUrlFragment(this.vocabulary[sugar.sugar].fragmentStructure);
            } else {
              sugar.structure = null;
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
    for (const sugar of this.sugars) {
      this.siteCount = this.siteCount + sugar.sites.length;
    }

  }

  getSiteCount(sites: Array<Site>): string {
    return sites.length + '/' + this.siteCount;
  }

  getSugarDisplay(term: string): string {
    if (this.vocabulary && this.vocabulary[term] && this.vocabulary[term].display) {
      return this.vocabulary[term].display;
    } else {
      return term;
    }
  }

}
