import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { debounceTime } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import {SubstanceService} from '@gsrs-core/substance';
import {LoadingService} from '@gsrs-core/loading';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-sequence-search',
  templateUrl: './sequence-search.component.html',
  styleUrls: ['./sequence-search.component.scss']
})
export class SequenceSearchComponent implements OnInit, OnDestroy {
  sequenceSearchForm = new FormGroup({
    cutoff: new FormControl(0.9, [Validators.min(0), Validators.max(1), Validators.required]),
    type: new FormControl('GLOBAL', Validators.required),
    sequenceType: new FormControl('protein', Validators.required),
    sequence: new FormControl('', Validators.required)
  });
  errorMessage = '';
  id?: string;



  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private substanceService: SubstanceService,
    private gaService: GoogleAnalyticsService,
    private loadingService: LoadingService,
    private titleService: Title


  ) {
    this.activatedRoute
      .queryParamMap
      .subscribe(params => {
          if (params.has('source') && params.get('source') === 'edit') {
            this.id = params.get('source_id');
            this.sequenceSearchForm.controls.sequence.setValue(JSON.parse(sessionStorage.getItem('gsrs_edit_sequence_' + this.id)));
          } else {
            if (params.has('sequence')) {
            this.sequenceSearchForm.controls.sequence.setValue(params.get('sequence'));
            }
          }
        if (params.has('type')) {
          this.sequenceSearchForm.controls.type.setValue(params.get('type'));
        }
        if (params.has('cutoff')) {
          this.sequenceSearchForm.controls.cutoff.setValue(params.get('cutoff'));
        }
        if (params.has('seq_type')) {
          const type = params.get('seq_type');
          if (type.toLowerCase() === 'nucleicacid') {
            this.sequenceSearchForm.controls.sequenceType.setValue('nucleicAcid');
          } else {
            this.sequenceSearchForm.controls.sequenceType.setValue('protein');
          }
        }
        if (params.has('subunit') && params.has('substance') && params.has('seq_type')) {
          this.getSequence(params.get('substance'), params.get('subunit'), params.get('seq_type'));
        }

      });
  }

  ngOnInit() {
    this.titleService.setTitle('Sequence Search');
    this.gaService.sendPageView(`Sequence Search`);
    this.sequenceSearchForm.controls.cutoff.valueChanges.pipe(
      debounceTime(1000)
    ).subscribe(value => {
      this.gaService.sendEvent('sequenceSearch', 'input:cutoff', 'search identity', value);
    });
    this.sequenceSearchForm.controls.type.valueChanges.subscribe(value => {
      const eventLabel = !environment.isAnalyticsPrivate && value || 'cutoff type';
      this.gaService.sendEvent('sequenceSearch', 'select:cutoff-type', eventLabel);
    });
    this.sequenceSearchForm.controls.sequenceType.valueChanges.subscribe(value => {
      const eventLabel = !environment.isAnalyticsPrivate && value || 'cutoff type';
      this.gaService.sendEvent('sequenceSearch', 'select:sequence-type', eventLabel);
    });
  }

  ngOnDestroy() {}

  search(): void {
    if (this.sequenceSearchForm.valid) {
      this.gaService.sendEvent('sequenceSearch', 'button:search', 'sequence');
      this.navigateToBrowseSubstance();
    } else {
      this.gaService.sendException('tried invalid sequence search');
    }
  }

  cleanSequence(type): void {
    let mod = ['G', 'T', 'U', 'N', 'A', 'C', 'X'];

    if (type.toUpperCase() === 'PROTEIN') {
      mod = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y'];
    }
    this.sequenceSearchForm.controls.sequence.setValue(this.filterbychr(this.sequenceSearchForm.controls.sequence.value, mod));


  }

  getSequence(substance: string, unit: string, type: string) {
    type = type.charAt(0).toLowerCase() + type.slice(1);
    this.substanceService.getSequenceByID(substance, unit, type).subscribe(response => {
        if (response && response.length > 0 && response[0].sequence) {
          this.sequenceSearchForm.controls.sequence.setValue(response[0].sequence);
        }
    });
  }

  filterbychr(str: string, reg: string[]): string {
    const arr = str.toString().split('');
    const newArr = [];
    arr.forEach( (item, index, object) => {
      if (reg.indexOf(item.toUpperCase()) >= 0) {
        newArr.push(item);
      }
    });
    return newArr.join('');
    }
    makeRandom() {
      let text = '';
      const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
      for (let i = 0; i < 6; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
      }
        return text;
    }

  private navigateToBrowseSubstance(): void {
    this.errorMessage = '';
    this.loadingService.setLoading(true);
    if (!this.id) {
        this.id = this.makeRandom();
    }
    sessionStorage.setItem('gsrs_search_sequence_' + this.id, JSON.stringify(this.sequenceSearchForm.value.sequence));
    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

        navigationExtras.queryParams['type'] = 'sequence';
        navigationExtras.queryParams['cutoff'] = this.sequenceSearchForm.value.cutoff;
        navigationExtras.queryParams['type'] = this.sequenceSearchForm.value.type;
        navigationExtras.queryParams['seq_type'] = this.sequenceSearchForm.value.sequenceType;
        navigationExtras.queryParams['source_id'] = this.id;

        if ( this.sequenceSearchForm.value.sequence.length > 1000) {
        //  navigationExtras.queryParams['sequence_search'] = this.sequenceSearchForm.value.sequence.substring(0, 1000);
        } else {
       //   navigationExtras.queryParams['sequence_search'] = this.sequenceSearchForm.value.sequence;
        }

    this.substanceService.getSubstanceSequenceResults(
      this.sequenceSearchForm.value.sequence,
      this.sequenceSearchForm.value.cutoff,
      this.sequenceSearchForm.value.type,
      this.sequenceSearchForm.value.sequenceType
    ).subscribe(response => {
      this.loadingService.setLoading(false);
      if (response.key) {
        navigationExtras.queryParams['sequence_key'] = response.key;
        this.router.navigate(['/browse-substance'], navigationExtras);
      } else {
        this.errorMessage = 'There was a problem processing your sequence search request';
      }
    }, error => {
      console.log(error);
      if (this.sequenceSearchForm.value.sequence > 50000 ) {
        this.errorMessage = 'Cannot process searches for sequences with more than 50,000 sites';
      } else {
        this.errorMessage = 'There was a problem processing your sequence search request';
      }
      this.loadingService.setLoading(false);
    });
  }

}
