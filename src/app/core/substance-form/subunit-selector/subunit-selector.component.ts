import {AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2} from '@angular/core';
import {Feature, Glycosylation, Link, Site, SubstanceAmount, Subunit} from '@gsrs-core/substance';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
import {Subscription} from 'rxjs';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-subunit-selector',
  templateUrl: './subunit-selector.component.html',
  styleUrls: ['./subunit-selector.component.scss'],
  animations: [
    trigger('errorFlash', [
      state('initial', style({
        backgroundColor: 'white'
      })),
      state('final', style({
        backgroundColor: 'pink'
      })),
      transition('initial=>final', animate('1000ms')),
      transition('final=>initial', animate('500ms'))
    ]),
  ]
})
export class SubunitSelectorComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() card: any;
  @Input() link?: Array<any>;
 // @Input() feature?: Feature;
  @Output() sitesUpdate = new EventEmitter<Array<Site>>();
  @Output() featureUpdate = new EventEmitter<any>();
  privateFeature: Feature = {name: '', siteRange: ''};
  sites: Array<any> = [];
  sitesDisplay: string;
  subunits: Array<Subunit>;
  otherLinks: Array<Link>;
  glycosylation: Glycosylation;
  allSites: Array<DisplaySite> = [];
  vocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  private subscriptions: Array<Subscription> = [];
  features: Array<Feature>;
  featureName?: string;
  selectState: string;
  newFeature: Array<Site> = [];
  subunitSequences: Array<TestSequence> = [];
  currentState = 'initial';
  newFeatureArray: Array<Array<Site>> = [];
  valid = true;
  cysteineMessage: string;
  changeState() {
    this.currentState = this.currentState === 'initial' ? 'final' : 'initial';
  }

  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService,
    private render: Renderer2
  ) {
}

  @Input()
  set feature(feat: Feature) {
    this.privateFeature = feat;
  }

  get feature(): Feature {
    return this.privateFeature;
  }

  ngOnInit() {
    this.getVocabularies();
    if ( this.link && this.link.length > 0) {
      this.sites = this.link;
      this.allSites = [];
      this.updateDisplay();
      this.sitesUpdate.emit(this.sites);
    } else {
      this.link = [];
    }
    if (this.feature) {
      this.convertFeature();
    }
    this.selectState = 'first';
  }

  ngAfterViewInit()  {
    if ((!this.link.length) || (this.link.length === 0)) {
      this.selectState = 'first';
    } else if (this.link.length === 1) {
      this.selectState = 'last';
    } else if (this.link.length === 2) {
      this.selectState = 'finished';
    }
    setTimeout(() => {
      const subunitsSubscription = this.substanceFormService.subunitDisplaySequences.subscribe(subunits => {
        this.subunitSequences = subunits;
        if (this.card === 'disulfide') {
          this.subunitSequences.forEach(testSequence => {
            testSequence.subunits.forEach(sequenceUnit => {
              if (sequenceUnit.unitValue !== 'C') {
                sequenceUnit.class = 'unavailable';
              } else {
                sequenceUnit.class = 'cys';
              }
            });
          });
        }
        if (this.feature) {
          this.convertFeature();
        }
      });
      this.subscriptions.push(subunitsSubscription);


      const allSitesSubscription = this.substanceFormService.allSites.subscribe(allSites => {
        this.allSites = this.allSites.concat(allSites);
      });
      this.subscriptions.push(allSitesSubscription);

      if (this.card === 'link') {
        const linksSubscription = this.substanceFormService.substanceLinks.subscribe(Links => {
          Links.forEach(link => {
            if (link.sites) {
              link.sites.forEach(site => {
                const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'other'};
                this.allSites.push(newLink);
              });
            }
          });

        });
        this.subscriptions.push(linksSubscription);
      } else if (this.card === 'sugar') {
        const linksSubscription = this.substanceFormService.substanceSugars.subscribe(Links => {
          Links.forEach(link => {
            if (link.sites) {
              link.sites.forEach(site => {
                const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'other'};
                this.allSites.push(newLink);
              });
            }
          });
        });
        this.subscriptions.push(linksSubscription);

      }


      // sort out universal timing of subunit and site processing
      setTimeout(() => {
        this.addStyle();
      }, 100);
    });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
  emitUpdate(event: any): void {
    // ### no idea why this would be undefined if it's declared earlier
    if (!this.privateFeature){
      this.privateFeature = {name: this.featureName, siteRange: ''};
    }
    this.featureUpdate.emit(this.privateFeature);
    this.privateFeature.name = this.featureName;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('AMINO_ACID_RESIDUE').subscribe(response => {
      this.vocabulary = response['AMINO_ACID_RESIDUE'].dictionary;
    }, error => {
    });
  }

  getTooltipMessage(subunitIndex: number, unitIndex: number, unitValue: string, type: string): string {
    const vocab = (this.vocabulary[unitValue] === undefined ? 'UNDEFINED' : this.vocabulary[unitValue].display);
    return `${subunitIndex} - ${unitIndex}: ${unitValue.toUpperCase()} (${vocab}) \n ${type}`;
  }

  removeFeature() {
    this.newFeature = [];
    if (this.newFeature[1]) {
      this.addFeature(this.newFeature, true);
      this.addStyle();
      this.selectState = 'first';
    } else if (this.newFeature[0]) {
      this.subunitSequences[this.newFeature[0].subunitIndex - 1].subunits[this.newFeature[0].residueIndex - 1].class = '';
    }
  }

  addFeature(feature: Array<Site>, reverse?: boolean) {
    if (feature[0].subunitIndex === feature[1].subunitIndex) {
      const subunitIndex = feature[0].subunitIndex;
      let start = feature[0].residueIndex;
      let end = feature[1].residueIndex;
      if ( feature[0].residueIndex > feature[1].residueIndex) {
        start = feature[1].residueIndex;
        end = feature[0].residueIndex;
      }
      for (let i = start; i <= end; i++) {
        if (reverse) {
          this.subunitSequences[subunitIndex - 1].subunits[i - 1].class = '';
        } else {
          this.subunitSequences[subunitIndex - 1].subunits[i - 1].class = 'chosen';
        }

      }
    }
  }

  deleteFeature(event: any): void {
    for (let i = event[0].residueIndex; i <= event[1].residueIndex; i++) {
      this.subunitSequences[event[0].subunitIndex - 1].subunits[i - 1].class = '';
    }
  this.newFeatureArray = this.newFeatureArray.filter(feat => ((event[0] !== feat[0]) && (event[1] !== feat[1])) );

  }

  pushFeature(): void {
    if (this.newFeature.length === 2) {
      this.newFeatureArray.push(this.newFeature);
      this.newFeature = [];
      this.selectState = 'first';
    }
  }

  drawFeature(feature: Feature): void {
    const sites = feature.siteRange.split('-');
    const start = Number(sites[0].split('_')[1]);
    const end = Number(sites[1].split('_')[1]);
    const subunit = Number(sites[0].split('_')[0]);
    for (let i = start; i <= end; i++) {
        this.subunitSequences[subunit - 1].subunits[i - 1].class = 'feature';
    }
}
  updateDisplay(): void  {
    this.sites = this.sites.sort(function (s1, s2) {
      if (s1.subUnitIndex > s2.subunitIndex) {
        return 1;
      } else if (s1.subunitIndex < s2.subunitIndex) {
        return -1;
      } else if (s1.residueIndex > s2.residueIndex) {
        return 1;
      } else if (s1.residueIndex < s2.residueIndex) {
      } else {
        return 1;
      }
    });
      this.sitesDisplay = this.substanceFormService.siteString(this.sites);

    }


      toggleSite(subunit: any, residue: any, value: any, event: any): void {
        const newobj = {subunitIndex: subunit, residueIndex: residue};
      if (this.card === 'feature') {
        if (this.selectState === 'first') {
          this.newFeature[0] = newobj;
          this.render.addClass(event.target, 'chosen');
          this.selectState = 'last';
        } else if (this.selectState === 'last') {
          if (this.newFeature[0] === newobj) {
            this.selectState = 'first';
            this.render.removeClass(event.target, 'chosen');
          } else {
            this.newFeature[1] = newobj;
            this.addFeature(this.newFeature);
            this.selectState = 'finished';
            let siterange = '';
            this.newFeatureArray.forEach(feat => {
              siterange = siterange + (feat[0].subunitIndex +
                '_' + feat[0].residueIndex + '-' + feat[1].subunitIndex + '_' + feat[1].residueIndex+ ';');
            });
            siterange = siterange + (this.newFeature[0].subunitIndex +
              '_' + this.newFeature[0].residueIndex + '-' + this.newFeature[1].subunitIndex + '_' + this.newFeature[1].residueIndex);
            this.privateFeature = {'name': this.featureName || '', 'siteRange': siterange};
            this.featureUpdate.emit(this.privateFeature);
          }

        } else if (this.selectState === 'finished') {
          this.pushFeature();
          this.newFeature[0] = newobj;
          this.render.addClass(event.target, 'chosen');
          this.selectState = 'last';
          let siterange = '';
          this.newFeatureArray.forEach(feat => {
            siterange = siterange + (feat[0].subunitIndex +
              '_' + feat[0].residueIndex + '-' + feat[1].subunitIndex + '_' + feat[1].residueIndex);
          });
          this.privateFeature = {'name': this.featureName || '', 'siteRange': siterange};
          this.featureUpdate.emit(this.privateFeature);
        }
      } else {
        const inSites = this.sites.some(r => (r.residueIndex == residue) && (r.subunitIndex == subunit));
        if (this.card !== 'disulfide') {
          if (inSites) {
            this.sites = this.sites.filter(function (r) {
              return (r.residueIndex !== residue) || (r.subunitIndex !== subunit);
            });
            this.render.removeClass(event.target, 'chosen');

          } else {
            this.sites.push(newobj);
            this.render.addClass(event.target, 'chosen');
          }
          this.updateDisplay();
          this.sitesUpdate.emit(this.sites);

        } else {
          if (inSites) {
            this.render.removeClass(event.target, 'chosen');
          } else if (this.selectState !== 'finished') {
            this.render.removeClass(event.target, 'chosen');
          }
          if (event.target.innerText === 'C') {

            if (this.selectState === 'first') {
              if (!inSites) {
                this.selectState = 'last';

                this.render.addClass(event.target, 'chosen');
                this.sites[0] = newobj;
              } else {
                this.render.removeClass(event.target, 'chosen');
                this.sites = this.sites.filter(function (r) {
                  return (r.residueIndex !== residue) || (r.subunitIndex !== subunit);
                });
              }
            } else if (this.selectState === 'last') {
              if (!inSites) {
                this.selectState = 'finished';
                this.sites[1] = newobj;
                this.render.addClass(event.target, 'chosen');
              } else {
                this.selectState = 'first';
                this.sites = [];
                this.render.removeClass(event.target, 'chosen');
              }
            } else if (this.selectState === 'finished') {
                if (inSites) {
                this.selectState = 'last';
                  this.sites = this.sites.filter(function (r) {
                    return (r.residueIndex !== residue) || (r.subunitIndex !== subunit);
                  });
               } else {
                  this.cysteineMessage = "You must clear existing sites to select new ones"
               }
            }
            this.updateDisplay();
            this.sitesUpdate.emit(this.sites);
          } else {
            this.render.addClass(event.target, 'invalid_blink');
            setTimeout(
              function() {this.render.removeClass(event.target, 'invalid_blink'); }, 2000);
          }
       }
      }

      }

      clearSites(): void {
        this.sites.forEach(site => {  this.subunitSequences[site.subunitIndex - 1].subunits[site.residueIndex - 1].class = ''; });
        this.sites = [];
        this.cysteineMessage = '';
        this.selectState = 'first';
        this.updateDisplay();
        }

  addStyle(): void {
    if (this.subunitSequences && this.subunitSequences[0] && this.subunitSequences[0].subunits) {
      this.subunitSequences.forEach(sites => {
        sites.subunits.forEach( site => {
          if(this.card === 'disulfide' ){
              if (site.unitValue !== 'C') {
                site.class = 'unavailable';
              } else {
                site.class = 'cys';
              }
          } else {
            site.class = '';
          }
        });
      });
      this.allSites.forEach(site => {
        if (this.subunitSequences[site.subunit - 1].subunits) {
          if (this.subunitSequences[site.subunit - 1].subunits[site.residue - 1].class !== '') {
            this.subunitSequences[site.subunit - 1].subunits[site.residue - 1].class = this.subunitSequences[site.subunit - 1].subunits[site.residue - 1].class + ' ' + site.type;
          } else {
            this.subunitSequences[site.subunit - 1].subunits[site.residue - 1].class = site.type;
          }
        }
      });
      this.sites.forEach(site => {
        if (this.subunitSequences[site.subunitIndex - 1].subunits) {
          this.subunitSequences[site.subunitIndex - 1].subunits[site.residueIndex - 1].class = 'chosen';
        } else {
        }
      });
      if (this.features) {
        this.features.forEach(feat => {
          this.drawFeature(feat);
        });
      }
    }

  }

  manualInput(event: any): void {
    try {
      const newsites = this.substanceFormService.stringToSites(event.replace(/ /g, ''));
      if (this.sites !== newsites) {
        this.sites = newsites;
        this.addStyle();
        this.sitesUpdate.emit(this.sites);
      } else {
      }
      this.valid = true;
      this.sitesDisplay = event;
    } catch (e) {
      this.valid = false;
    }
  }

  convertFeature(): void {
    this.newFeatureArray = [];
    const siteSplit = this.feature.siteRange.split(';');
      siteSplit.forEach(pair => {
        const sites = pair.split('-');
        const start = Number(sites[0].split('_')[1]);
        const end = Number(sites[1].split('_')[1]);
        const subunit = Number(sites[0].split('_')[0]);
        const newArr = [{subunitIndex: subunit, residueIndex: start}, {subunitIndex: subunit, residueIndex: end} ];
        this.newFeatureArray.push( newArr );
        this.addFeature(newArr);
      });
    this.newFeature = [];
    this.featureName = this.feature.name;
    this.selectState = 'first';
  }

  private processSubunits(): void {

  }

}
  /*private processSubunits2(): void {
    const t0 = performance.now();
    this.subunitSequences = [];
    let subunitIndex = 1;
    this.subunits.forEach(subunit => {
      const subsections = [];
      let currentSections = [];
      for (let count = 0; count < subunit.sequence.length; count = count + 10) {
        if ((count + 10) >= subunit.sequence.length) {
          currentSections.push([count, subunit.sequence.length]);
          if ((count + 10) % 50 !== 0) {
            subsections.push(currentSections);
          }
        } else {
          currentSections.push([count, count + 10]);
        }
        if ((count + 10) % 50 === 0) {
          subsections.push(currentSections);
          currentSections = [];
        }
      }
      const thisTest: TestSequence =  {
        subunitIndex: subunitIndex,
        subunits: [],
        subsections: subsections,
        subgroups: currentSections
      };
      let index = 0;
      const indexEnd = subunit.sequence.length;
      while (index <= indexEnd) {
        if (subunit.sequence[index]) {
          const sequenceUnit: SequenceUnit = {
            unitIndex: index + 1,
            unitValue: subunit.sequence[index],
            class: ''
          };
          if (this.card === 'disulfide') {
            if (sequenceUnit.unitValue !== 'C') {
              sequenceUnit.class = 'unavailable';
            } else {
              sequenceUnit.class = 'cys';
            }
          }
          thisTest.subunits.push(sequenceUnit);
        }
        index++;
      }
      this.subunitSequences.push(thisTest);
      subunitIndex++;
    });
    setTimeout(() => {
     // this.addStyle();
    if (this.feature) {this.convertFeature(); } });
    const t1 = performance.now();
    const totaltime = t1 - t0;
    console.log(t1);
    console.log('time to process subunit display: '+ totaltime);
  }*/


interface SequenceUnit {
  unitIndex: number;
  unitValue: string;
  class?: string;
  type?: string;
}

interface DisplaySite {
  type: string;
  subunit: number;
  residue: number;
}


interface TestSequence {
  subunitIndex?: number;
  subsections?: Array<any>;
  subgroups?: Array<any>;
  subunits?: Array<SequenceUnit>;
}
