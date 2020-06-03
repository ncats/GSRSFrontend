import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Grade } from '@gsrs-core/substance';
import { Subscription } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { SubstanceFormBase } from '../base-classes/substance-form-base';

@Component({
  selector: 'app-ssg-grade-form',
  templateUrl: './ssg-grade-form.component.html',
  styleUrls: ['./ssg-grade-form.component.scss']
})

export class SsgGradeFormComponent extends SubstanceFormBase implements OnInit, AfterViewInit, OnDestroy {

  grade: Grade;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super();
    this.analyticsEventCategory = 'substance form ssg 3 grade';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Grade');
    const substanceSubscription = this.substanceFormService.substance.subscribe(substance => {
      if (substance.specifiedSubstanceG3.grade == null) {
        substance.specifiedSubstanceG3.grade = {};
      }
      this.substanceFormService.resetState();
      this.grade = substance.specifiedSubstanceG3.grade;
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

  updateGradeName(name: string): void {
    this.grade.name = name;
  }

  updateGradeType(type: string): void {
    this.grade.type = type;
  }

  updateAccess(access: Array<string>): void {
    this.grade.access = access;
  }

}
