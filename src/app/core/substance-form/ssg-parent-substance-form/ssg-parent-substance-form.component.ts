import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { SubstanceRelated, SubstanceSummary, SpecifiedSubstanceG3,  SpecifiedSubstanceG4m} from '@gsrs-core/substance';
import { Subscription } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ControlledVocabularyService, VocabularyTerm } from '@gsrs-core/controlled-vocabulary';
import { SubstanceFormBase } from '../base-classes/substance-form-base';

@Component({
  selector: 'app-ssg-parent-substance-form',
  templateUrl: './ssg-parent-substance-form.component.html',
  styleUrls: ['./ssg-parent-substance-form.component.scss']
})

export class SsgParentSubstanceFormComponent extends SubstanceFormBase implements OnInit, AfterViewInit, OnDestroy {

  parentSubstance: SubstanceRelated;
  relatedSubstanceUuid: string;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    public cvService: ControlledVocabularyService
  ) {
    super();
    this.analyticsEventCategory = 'substance form ssg 3 and 4 parent substance';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Parent Substance');
    const substanceSubscription = this.substanceFormService.substance.subscribe(substance => {
      alert('WWWW ' + JSON.stringify(substance));
      // Specified Substance Group 3
      /*
      if (substance.specifiedSubstanceG3.parentSubstance == null) {
        substance.specifiedSubstanceG3.parentSubstance = {};
      }
      this.substanceFormService.resetState();
      this.parentSubstance = substance.specifiedSubstanceG3.parentSubstance;

      if (substance.specifiedSubstanceG3.parentSubstance != null) {
        this.relatedSubstanceUuid = substance.specifiedSubstanceG3.parentSubstance.refuuid;
      }
      */

      // Specified Substance Group 4 Manufacturing
   //   alert('RRRRRR ' + JSON.stringify(substance.specifiedSubstanceG4m.parentSubstance));
     // if (substance.specifiedSubstanceG4m.parentSubstance == null) {
     //   alert('GGGGG');
     //   substance.specifiedSubstanceG4m.parentSubstance = { "uuid": 'test'};
     // }
      this.substanceFormService.resetState();
    //  this.parentSubstance = substance.specifiedSubstanceG4m.parentSubstance;

     // if (substance.specifiedSubstanceG4m.parentSubstance != null) {
     //   this.relatedSubstanceUuid = substance.specifiedSubstanceG4m.parentSubstance.refuuid;
     // }
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

  relatedSubstanceUpdated(substance: SubstanceSummary): void {
    if (substance != null) {
      alert('GGGGGGGGGGGG');
      this.parentSubstance.refPname = substance._name;
      this.parentSubstance.name = substance._name;
      this.parentSubstance.refuuid = substance.uuid;
      this.parentSubstance.substanceClass = 'reference';
      this.parentSubstance.approvalID = substance.approvalID;

      this.relatedSubstanceUuid = this.parentSubstance.refuuid;
    }
  }

}
