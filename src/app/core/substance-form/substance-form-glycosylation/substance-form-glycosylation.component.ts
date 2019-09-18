import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {Glycosylation, SubstanceName} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';
import {ControlledVocabularyService, VocabularyTerm} from '@gsrs-core/controlled-vocabulary';
@Component({
  selector: 'app-substance-form-glycosylation',
  templateUrl: './substance-form-glycosylation.component.html',
  styleUrls: ['./substance-form-glycosylation.component.scss']
})
// tslint:disable-next-line:max-line-length
export class SubstanceFormGlycosylationComponent extends SubstanceCardBaseFilteredList<SubstanceName> implements OnInit, AfterViewInit, OnDestroy {
  glycosylation: Glycosylation;
  glycosylationTypes: Array<VocabularyTerm>;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private cvService: ControlledVocabularyService,

  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form glycosylation';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Glycosylation');
    this.getVocabularies();
  }

  ngAfterViewInit() {
    const glycosylationSubscription = this.substanceFormService.substanceGlycosylation.subscribe(glycosylation => {
      console.log(glycosylation);
      this.glycosylation = glycosylation;
      console.log(this.glycosylation);
    this.subscriptions.push(glycosylationSubscription);
  });
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getVocabularies(): void {
    const subscription = this.cvService.getDomainVocabulary('GLYCOSYLATION_TYPE').subscribe(response => {
      this.glycosylationTypes = response['GLYCOSYLATION_TYPE'].list;
    });
    this.subscriptions.push(subscription);
  };

}
