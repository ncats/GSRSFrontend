import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { SubstanceFormBase } from '../../substance-form/base-classes/substance-form-base';
import { SubstanceDetail, SpecifiedSubstanceG2 } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-ssg2-overview-form',
  templateUrl: './ssg2-overview-form.component.html',
  styleUrls: ['./ssg2-overview-form.component.scss']
})
export class Ssg2OverviewFormComponent extends SubstanceFormBase implements OnInit, AfterViewInit, OnDestroy {

  substance: SubstanceDetail;
  specifiedSubstanceG2: SpecifiedSubstanceG2;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super();
    this.analyticsEventCategory = 'substance form ssg 2 Manufacturing';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Overview');
    const substanceSubscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;

      if (!substance.specifiedSubstanceG2) {
        substance.specifiedSubstanceG2 = {};
      }
      this.substanceFormService.resetState();
      this.specifiedSubstanceG2 = substance.specifiedSubstanceG2;
    });
    this.subscriptions.push(substanceSubscription);
  }

  ngAfterViewInit() {
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

}