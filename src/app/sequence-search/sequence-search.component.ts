import { Component, OnInit } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { NavigationExtras, Router, ActivatedRoute } from '@angular/router';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';

@Component({
  selector: 'app-sequence-search',
  templateUrl: './sequence-search.component.html',
  styleUrls: ['./sequence-search.component.scss']
})
export class SequenceSearchComponent implements OnInit {
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
    this.gaService.setTitle(`Sequence Search`);
  }

  search(): void {
    if (this.sequenceSearchForm.valid) {
      this.navigateToBrowseSubstance();
    }
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
