import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../../substance-form/base-classes/substance-form-base-filtered-list';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
/*
import { take } from 'rxjs/operators';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceFormBase } from '../../substance-form/base-classes/substance-form-base';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
*/
import { SubstanceService } from '../../substance/substance.service';
import { SubstanceSummary, SubstanceRelationship } from '../../substance/substance.model';
import { SpecifiedSubstanceG4mProcess, SubstanceRelated } from '../../substance/substance.model';
import { SubstanceFormSsg4mSitesService } from './substance-form-ssg4m-sites.service';
import { SpecifiedSubstanceG4mSite } from '@gsrs-core/substance/substance.model';

@Component({
  selector: 'app-ssg4m-sites',
  templateUrl: './ssg4m-sites.component.html',
  styleUrls: ['./ssg4m-sites.component.scss']
})
export class Ssg4mSitesComponent implements OnInit {

  @Input() processIndex: number;
  @Input() siteIndex: number;
  privateSite: SpecifiedSubstanceG4mSite;

  constructor(
    public substanceFormSsg4mSitesService: SubstanceFormSsg4mSitesService,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer,
    private scrollToService: ScrollToService) { }

  @Input()
  set site(site: SpecifiedSubstanceG4mSite) {
    this.privateSite = site;
  }

  ngOnInit(): void {

  }

  deleteSite(): void {

  }

  addStage(processIndex:number, siteIndex:number) {
    this.substanceFormSsg4mSitesService.addStage(processIndex, siteIndex);
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-site-stage-0`, 'center');
    });
  }
}
