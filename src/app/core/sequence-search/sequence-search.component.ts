import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { debounceTime } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-sequence-search',
  templateUrl: './sequence-search.component.html',
  styleUrls: ['./sequence-search.component.scss']
})
export class SequenceSearchComponent implements OnInit, OnDestroy {
  sequenceSearchForm = new FormGroup({
    cutoff: new FormControl(0.5, [Validators.min(0), Validators.max(1), Validators.required]),
    type: new FormControl('SUB', Validators.required),
    sequenceType: new FormControl('Protein', Validators.required),
    sequence: new FormControl('', Validators.required)
  });


  constructor(
    public router: Router,
    private activatedRoute: ActivatedRoute,
    private gaService: GoogleAnalyticsService
  ) {
    this.activatedRoute
      .queryParamMap
      .subscribe(params => {
        if (params.has('sequence')) {
          this.sequenceSearchForm.controls.sequence.setValue(params.get('sequence'));
        }
        if (params.has('type')) {
          this.sequenceSearchForm.controls.type.setValue(params.get('type'));
        }
        if (params.has('cutoff')) {
          this.sequenceSearchForm.controls.cutoff.setValue(params.get('cutoff'));
        }
        if (params.has('seq_type')) {
          this.sequenceSearchForm.controls.sequenceType.setValue(params.get('seq_type'));
        }
      });
  }

  ngOnInit() {
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
    if (type === 'Protein') {
      mod = ['A', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y'];
    }
    this.sequenceSearchForm.controls.sequence.setValue(this.filterbychr(this.sequenceSearchForm.controls.sequence.value, mod));


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

  private navigateToBrowseSubstance(): void {

    const navigationExtras: NavigationExtras = {
      queryParams: {}
    };

    navigationExtras.queryParams['type'] = 'sequence';
    navigationExtras.queryParams['sequence_search'] = this.sequenceSearchForm.value.sequence;
    navigationExtras.queryParams['cutoff'] = this.sequenceSearchForm.value.cutoff;
    navigationExtras.queryParams['type'] = this.sequenceSearchForm.value.type;
    navigationExtras.queryParams['seq_type'] = this.sequenceSearchForm.value.sequenceType;


    this.router.navigate(['/browse-substance'], navigationExtras);
  }

}
