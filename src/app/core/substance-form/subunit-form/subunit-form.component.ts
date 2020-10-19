import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import { Linkage, Site, Subunit, Sugar } from '@gsrs-core/substance';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { Subject, Subscription } from 'rxjs';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import * as deepEqual from 'deep-equal';
import { SubstanceFormLinksService } from '../links/substance-form-links.service';
import { MatDialog } from '@angular/material';
import { OverlayContainer } from '@angular/cdk/overlay';
import { CopyDisulfideDialogComponent } from '@gsrs-core/substance-form/copy-disulfide-dialog/copy-disulfide-dialog.component';

@Component({
  selector: 'app-subunit-form',
  templateUrl: './subunit-form.component.html',
  styleUrls: ['./subunit-form.component.scss']
})

export class SubunitFormComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() subunit: Subunit;
  @Input() view: string;
  @Input() sites?: Array<any>;
  @Output() subunitDeleted = new EventEmitter<Subunit>();
  subunitSequence: SubunitSequence;
  vocabulary: { [vocabularyTermValue: string]: VocabularyTerm } = {};
  private subscriptions: Array<Subscription> = [];
  toggle = {};
  allSites: Array<DisplaySite> = [];
  features: Array<any> = [];
  sequenceSites: Array<any> = [];
  editSequence: string;
  sugars: Array<Sugar>;
  links: Array<Linkage>;
  sequenceType = '';
  substanceType: string;
  searchType: string;
  validArray: Array<string> = [];
  private overlayContainer: HTMLElement;



  constructor(
    private substanceFormService: SubstanceFormService,
    private substanceFormLinksService: SubstanceFormLinksService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
  ) {

  }

  ngOnInit() {
    this.allSites = [];
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    if (this.subunit.sequence === '') {
      this.toggle[this.subunit.subunitIndex] = true;
    }
    const definitionSubscription = this.substanceFormService.definition.subscribe(definition => {
      this.substanceType = definition.substanceClass;
      if (this.substanceType === 'protein') {
        this.searchType = 'Protein';
      } else {
        this.searchType = 'Nucleicacid';
      }
      this.getVocabularies();
    });
    definitionSubscription.unsubscribe();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      const displaySequenceSubscription = this.substanceFormService.subunitDisplaySequences.subscribe(subunits => {
        const newSubunits = subunits.filter(unit => unit.subunitIndex === this.subunit.subunitIndex)[0];
        if (!this.subunitSequence || !deepEqual(this.subunitSequence, newSubunits)) {
          if (this.subunitSequence && JSON.stringify(this.subunitSequence) !== JSON.stringify(newSubunits)) {
            this.subunitSequence = newSubunits;
            setTimeout(() => {
              if (this.allSites) {
                this.addStyle();
              }
            });
          } else {
            this.subunitSequence = newSubunits;
          }
        }
      });
      this.subscriptions.push(displaySequenceSubscription);

    });

    const allSitesSubscription = this.substanceFormService.allSites.subscribe(allSites => {
      const tempSitelist = [];
      allSites.forEach(site => {
        if (site.subunit === this.subunit.subunitIndex) {
          tempSitelist.push(site);
        }
      });
      if (this.allSites && this.allSites !== tempSitelist) {
        this.allSites = tempSitelist;
        setTimeout(() => {
          if (this.subunitSequence) {
            this.addStyle();
          }
        });
      } else if (!this.allSites) {
        this.allSites = tempSitelist;
      }

    }
    );
    this.subscriptions.push(allSitesSubscription);
    setTimeout(() => {
      if (this.subunitSequence) {
        // this.addStyle('after subs');
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getVocabularies(): void {
    const nonStandard: VocabularyTerm = {
      'value': 'X',
      'display': 'Non-standard Residue'
    };
    if (this.substanceType === 'protein') {
      this.cvService.getDomainVocabulary('AMINO_ACID_RESIDUE').subscribe(response => {
        this.vocabulary = response['AMINO_ACID_RESIDUE'].dictionary;
        this.vocabulary.X = nonStandard;
        // tslint:disable-next-line:forin
        for (const key in this.vocabulary) {
          this.validArray.push(this.vocabulary[key].value);
        }
      }, error => {
      });
    } else {
      this.cvService.getDomainVocabulary('NUCLEIC_ACID_BASE').subscribe(response => {
        this.vocabulary = response['NUCLEIC_ACID_BASE'].dictionary;
        this.vocabulary.X = nonStandard;
        // tslint:disable-next-line:forin
        for (const key in this.vocabulary) {
          this.validArray.push(this.vocabulary[key].value);
        }

      }, error => {
      });

    }

  }

  addStyle(): void {
    if (this.subunitSequence && this.subunitSequence.subunits) {
      this.allSites.forEach(site => {
        if (this.subunitSequence.subunits) {
          if (this.subunitSequence.subunits[site.residue - 1].class
            && this.subunitSequence.subunits[site.residue - 1].class !== site.type) {
            this.subunitSequence.subunits[site.residue - 1].class = this.subunitSequence.subunits[site.residue - 1].class + ' ' + site.type;
          } else {
            this.subunitSequence.subunits[site.residue - 1].class = site.type;
          }
        }
      });
    }
  }

  /* getTooltipMessage(subunitIndex: number, unitIndex: number, unitValue: string): string {
     const vocab = (this.vocabulary[unitValue.toUpperCase()] === undefined ? 'UNDEFINED'
     : this.vocabulary[unitValue.toUpperCase()].display);
     return `${subunitIndex} - ${unitIndex}: ${unitValue.toUpperCase()} (${vocab})`;
   }*/

  getTooltipMessage(subunitIndex: number, unitIndex: number, unitValue: string, type: string): any {
    const vocab = (this.vocabulary[unitValue] === undefined ? 'UNDEFINED' : this.vocabulary[unitValue].display);
    const arr = [];
    const formatted = {
      'modification': 'Structural Modification',
      'other': 'Other Link',
      'C-Glycosylation': 'C-Glycosylation',
      'N-Glycosylation': 'N-Glycosylation',
      'O-Glycosylation': 'O-Glycosylation',
      'feature': this.substanceType.toUpperCase() + ' Feature',
      'disulfide': 'Disulfide Link'
    };
    arr.push(`${subunitIndex} - ${unitIndex}: ${unitValue.toUpperCase()} (${vocab})`);
    const splitDisplay = type.split(' ');
    splitDisplay.forEach(type2 => {
      arr.push(formatted[type2] || '');
    });
    return arr;
  }

  copyDisulfides() {
    const dialogRef = this.dialog.open(CopyDisulfideDialogComponent, {
      data: {'unit': this.subunit.subunitIndex, 'full': this.subunit},
      width: '600px'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response ) {
      }
    });
  }

  editSubunit(subunit: Subunit, input: string): void {
    this.toggle[subunit.subunitIndex] = !this.toggle[subunit.subunitIndex];
    if (this.toggle[subunit.subunitIndex] === false) {
      this.subunit.sequence = input.trim().replace(/\s/g, '');
      this.substanceFormService.emitSubunitUpdate();
      this.substanceFormService.recalculateCysteine();
    } else {
      this.editSequence = this.preformatSeq(this.subunit.sequence);

      setTimeout(() => {
        const textArea = document.getElementsByClassName('sequence-textarea');
        [].forEach.call(textArea, function (area) {
          area.style.height = (area.scrollHeight + 10) + 'px';
        });
      });
    }
  }
  change(event): void {
    if (this.toggle[this.subunit.subunitIndex] === false) {
      event.target.value = this.subunit.sequence;
    }
  }

  deleteSubunit(): void {
    this.subunitDeleted.emit(this.subunit);
  }

  preformatSeq(seq): string {
    let ret = '';
    if (seq) {
      for (let i = 0; i < seq.length; i += 10) {
        if (i % 60 === 0) {
          ret += '\n';
        }
        ret += seq.substr(i, 10) + '     ';
      }
    }
    return ret.trim();
  }

  cleanSequence(): void {
    if (!this.toggle[this.subunit.subunitIndex]) {

      const toArray = this.subunit.sequence.split('');
      const cleanedSequence = toArray.filter(char => this.validArray.indexOf(char.toUpperCase()) >= 0).toString().replace(/,/g, '').trim();
      if (this.toggle[this.subunit.subunitIndex] === false) {

      }
      if (cleanedSequence !== this.subunit.sequence) {
        this.subunit.sequence = cleanedSequence;
        this.substanceFormService.emitSubunitUpdate();
        this.substanceFormService.recalculateCysteine();
      }
    } else {
      const toArray = this.editSequence.replace(/\s/g, '').split('');
      const cleanedSequence = toArray.filter(char => this.validArray.indexOf(char.toUpperCase()) >= 0).toString().replace(/,/g, '').trim();
      this.editSequence = this.preformatSeq(cleanedSequence);
    }
  }

  convertSequence(): void {
    const dashes = true;
    const dict = 'A	Ala;C	Cys;D	Asp;E	Glu;F	Phe;G	Gly;H	His;I	Ile;K	Lys;L	Leu;M	Met;N	Asn;P	Pro;Q	Gln;R	Arg;S	Ser;T	Thr;V	Val;W	Trp;Y	Tyr';
    let arr = [];
    const obj = {};
    let n = '';
    arr = dict.split(';');
    for (let i = 0; i < arr.length; i++) {
      let arr2 = [];
      arr2 = arr[i].split('\t');
      obj[arr2[0]] = arr2[1];
      obj[arr2[1].toUpperCase()] = arr2[0];
    }
    let seqarr = [];
    if (!this.toggle[this.subunit.subunitIndex]) {
    seqarr = this.subunit.sequence.replace(/[ ]/g, '-').split('-');
    } else {
      seqarr = this.editSequence.replace(/[ ]/g, '-').split('-');

    }

    for (let i = 0; i < seqarr.length; i++) {
      let trans = obj[seqarr[i].toUpperCase()];
      if (seqarr[i].length > 3) {
        n = n + seqarr[i];
        continue;
      }
      if (trans === undefined) {
        trans = 'X';
      }

      n = n + trans;
    }
    if (!this.toggle[this.subunit.subunitIndex]) {
    this.subunit.sequence = n;
    this.substanceFormService.emitSubunitUpdate();
    this.substanceFormService.recalculateCysteine();
    } else {
      this.editSequence = n;
    }
  }



  generateSites(event): void {
    this.sequenceType = event;
    const sugarsSubscription = this.substanceFormService.substanceSugars.subscribe(sug => {
      this.sugars = sug;
    });

    const linksSubscription = this.substanceFormLinksService.substanceLinks.subscribe(l => {
      this.links = l;
    });
    let sugarType = '';
    if (event === 'DNA') {
      sugarType = 'dR';
    } else {
      sugarType = 'R';
    }
    this.sugars.forEach(sugar => {
      sugar.sites = sugar.sites.filter(s => s.subunitIndex !== this.subunit.subunitIndex);
    });
    const subunitArray = [];
    if (this.subunit != null && this.subunit.sequence != null) {
      for (let i = 1; i <= this.subunit.sequence.length; i++) {
        subunitArray.push({ subunitIndex: this.subunit.subunitIndex, residueIndex: i });
      }
    }
    const newSugar: Sugar = { sugar: sugarType, sites: subunitArray };
    this.sugars.push(newSugar);
    this.links.forEach(link => {
      link.sites = link.sites.filter(s => s.subunitIndex !== this.subunit.subunitIndex);
    });
    const linkageArray = [];
    if (this.subunit != null && this.subunit.sequence != null) {
      for (let i = 2; i <= this.subunit.sequence.length; i++) {
        linkageArray.push({ subunitIndex: this.subunit.subunitIndex, residueIndex: i });
      }
    }
    const newLinkage: Linkage = { linkage: 'P', sites: linkageArray };
    this.links.push(newLinkage);
    this.substanceFormService.emitSugarUpdate();
    this.substanceFormService.emitLinkUpdate();
    linksSubscription.unsubscribe();
    sugarsSubscription.unsubscribe();
  }

}

interface SubunitSequence {
  subunitIndex?: number;
  subsections?: Array<any>;
  subgroups?: Array<any>;
  subunits?: Array<SequenceUnit>;
}

interface SequenceUnit {
  unitIndex: number;
  unitValue: string;
  class: string;
}

interface DisplaySite {
  type: string;
  subunit: number;
  residue: number;
}
