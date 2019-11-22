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
  @Output() sitesUpdate = new EventEmitter<Array<Site>>();
  @Output() featureUpdate = new EventEmitter<any>();
  @Output() disulfidesUpdate = new EventEmitter<any>();
  @Output() cardTypeUpdate = new EventEmitter<string>();

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
  siteTotal: number;
  disulfideArray: Array<Array<any>> = [];
  showStyle = true;
  startingCard: string;

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
    this.startingCard = this.card;
  }

  ngAfterViewInit()  {
    this.siteTotal = 0;
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
          this.subunitSequences.forEach(testSequence => {
            this.siteTotal = this.siteTotal + testSequence.subunits.length;
            if (this.card === 'disulfide') {
              testSequence.subunits.forEach(sequenceUnit => {
                if (sequenceUnit.unitValue !== 'C') {
                  sequenceUnit.class = 'unavailable';
                } else {
                  sequenceUnit.class = 'cys';
                }
              });
            }
            this.siteTotal > 5000 ? this.showStyle = false : this.showStyle = true;
          });

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
        const sugarSubscription = this.substanceFormService.substanceSugars.subscribe(Links => {
          Links.forEach(link => {
            if (link.sites) {
              link.sites.forEach(site => {
                const newLink: DisplaySite = {residue: site.residueIndex, subunit: site.subunitIndex, type: 'other'};
                this.allSites.push(newLink);
              });
            }
          });
        });
        this.subscriptions.push(sugarSubscription);
      }
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

  emitUpdate(event): void {
    // ### no idea why this would be undefined if it's declared earlier
    if (!this.privateFeature) {
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

  switchType(event): void {
    const type = event.value;
    console.log(event);
    this.card = type;
    this.sites = [];
    this.features = [];
    this.sitesDisplay = '';
    this.selectState = 'first';
    this.cardTypeUpdate.emit(type);
    this.addStyle();
  }

  getTooltipMessage(subunitIndex: number, unitIndex: number, unitValue: string, type: string): string {
    const vocab = (this.vocabulary[unitValue] === undefined ? 'UNDEFINED' : this.vocabulary[unitValue].display);
    return `${subunitIndex} - ${unitIndex}: ${unitValue.toUpperCase()} (${vocab}) \n ${type}`;
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

    toggleMultiDisulfide(subunit: any, residue: any, value: any, event): void {
      const newobj = {subunitIndex: subunit, residueIndex: residue, event: event.target};
      if (this.selectState === 'first') {
        this.sites[0] = newobj;
        this.render.addClass(event.target, 'chosen');
        this.selectState = 'last';
      } else if (this.selectState === 'last') {
        if (this.sites[0] === newobj) {
          this.selectState = 'first';
          this.render.removeClass(event.target, 'chosen');
        } else {
          this.sites[1] = newobj;
          this.disulfideArray.push(this.sites);
          this.sites = [];
          this.selectState = 'first';
          this.renderDisulfideArray();
          this.disulfidesUpdate.emit(this.disulfideArray);
        }
      }
    }

        deleteDisulfide(index: number): void {
            this.disulfideArray[index].forEach(site => {
              console.log(site);
              this.render.removeClass(site.event, 'new-disulfide');
            })
            this.disulfideArray.splice(index, 1);
          this.disulfidesUpdate.emit(this.disulfideArray);
        }

        renderDisulfideArray(): void {
          this.disulfideArray.forEach(set => {
            set.forEach(site =>{
             this.render.removeClass(site.event, 'chosen');
             this.render.addClass(site.event, 'new-disulfide');
            });
          });

        }


      toggleSite(subunit: any, residue: any, value: any, event): void {
        const newobj = {subunitIndex: subunit, residueIndex: residue};
      if (this.card === 'feature') {
        this.toggleFeatureSite(subunit, residue, value, event);
        } else if (this.card === 'multi-disulfide') {
        this.toggleMultiDisulfide(subunit, residue, value, event);
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
                  this.cysteineMessage = 'You must clear existing sites to select new ones';
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
        this.sites.forEach(site => {  this.subunitSequences[site.subunitIndex - 1].subunits[site.residueIndex - 1].class = '';
        });
        this.sites = [];
        this.cysteineMessage = '';
        this.selectState = 'first';
        this.updateDisplay();

        }

  addStyle(): void {
    if (this.subunitSequences && this.subunitSequences[0] && this.subunitSequences[0].subunits) {
      this.subunitSequences.forEach(sites => {
        sites.subunits.forEach( site => {
          if (this.card === 'disulfide' || this.card === 'multi-disulfide' ) {
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

  manualInput(event): void {
    try {
      const newsites = this.substanceFormService.stringToSites(event.replace(/ /g, ''));
      if (this.sites !== newsites) {
        if(this.card === 'disulfide'){
          if(newsites.length < 3 && newsites.length > 0) {
            this.sites[0] = newsites[0] ? newsites[0] : {};
            this.sites[1] = newsites[1] ? newsites[1] : {};
            this.valid = true;
            this.sitesDisplay = event;
            this.addStyle();
          } else {
            this.valid = false;
          }
        } else {
          this.sites = newsites;
          this.addStyle();
          this.sitesUpdate.emit(this.sites);
        }
      } else {
      }
      this.valid = true;
      this.sitesDisplay = event;
    } catch (e) {
      console.log(e)
      this.valid = false;
    }
  }

  // start feature specific

  removeFeature(): void {
    if (this.newFeature[1]) {
      this.addFeature(this.newFeature, true);
      this.addStyle();
      this.selectState = 'first';
    } else if (this.newFeature[0]) {
      this.subunitSequences[this.newFeature[0].subunitIndex - 1].subunits[this.newFeature[0].residueIndex - 1].class = '';
    }
    this.newFeature = [];
  }

  addFeature(feature: Array<Site>, reverse?: boolean): void {
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

  deleteFeature(event): void {
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

  toggleFeatureSite(subunit: any, residue: any, value: any, event): void {
    const newobj = {subunitIndex: subunit, residueIndex: residue};
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
            '_' + feat[0].residueIndex + '-' + feat[1].subunitIndex + '_' + feat[1].residueIndex + ';');
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

  // end Feature specific

}



interface SequenceUnit {
  unitIndex: number;
  unitValue: string;
  class?: string;
  type?: string;
  event?: any;
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
