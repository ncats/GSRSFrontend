import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Definition } from '@gsrs-core/substance';
import { Subscription } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { SubstanceFormBase } from '../base-classes/substance-form-base';

@Component({
  selector: 'app-ssg-definition-form',
  templateUrl: './ssg-definition-form.component.html',
  styleUrls: ['./ssg-definition-form.component.scss']
})

export class SsgDefinitionFormComponent extends SubstanceFormBase implements OnInit, AfterViewInit, OnDestroy {
  definition: Definition;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super();
    this.analyticsEventCategory = 'substance form ssg 3 definition';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('definition');
    const substanceSubscription = this.substanceFormService.substance.subscribe(substance => {
      if (substance.specifiedSubstanceG3.definition == null) {
        substance.specifiedSubstanceG3.definition = {};
      }
      this.substanceFormService.resetState();
      this.definition = substance.specifiedSubstanceG3.definition;
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

  updateAccess(access: Array<string>): void {
    this.definition.access = access;
  }
}
