import { Component, OnInit, AfterViewInit, Input, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { Subscription } from 'rxjs';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config/config.service';
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
import { SubstanceDetail } from '@gsrs-core/substance/substance.model';
import { SubstanceFormSsg4mSitesService } from './substance-form-ssg4m-sites.service';
import { SpecifiedSubstanceG4mSite } from '@gsrs-core/substance/substance.model';
import { ConfirmDialogComponent } from '../../../fda/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ssg4m-sites',
  templateUrl: './ssg4m-sites.component.html',
  styleUrls: ['./ssg4m-sites.component.scss']
})
export class Ssg4mSitesComponent implements OnInit {

  privateSite: SpecifiedSubstanceG4mSite;
  privateProcessIndex: number;
  privateSiteIndex: number;
  substance: SubstanceDetail;
  privateShowAdvancedSettings: boolean;
  configSsg4Form: any;
  configTitleStage: string;
  subscriptions: Array<Subscription> = [];

  constructor(
    public substanceFormSsg4mSitesService: SubstanceFormSsg4mSitesService,
    private substanceFormService: SubstanceFormService,
    public gaService: GoogleAnalyticsService,
    private overlayContainerService: OverlayContainer,
    private scrollToService: ScrollToService,
    public configService: ConfigService,
    private dialog: MatDialog
  ) { }

  @Input()
  set site(site: SpecifiedSubstanceG4mSite) {
    this.privateSite = site;
  }

  get site(): SpecifiedSubstanceG4mSite {
    return this.privateSite;
  }

  @Input()
  set processIndex(processIndex: number) {
    this.privateProcessIndex = processIndex;
  }

  get processIndex(): number {
    return this.privateProcessIndex;
  }

  @Input()
  set siteIndex(siteIndex: number) {
    this.privateSiteIndex = siteIndex;
    // Set the Site Name
    this.privateSite.siteName = 'Site ' + (this.privateSiteIndex + 1);
  }

  get siteIndex(): number {
    return this.privateSiteIndex;
  }

  @Input()
  set showAdvancedSettings(showAdvancedSettings: boolean) {
    this.privateShowAdvancedSettings = showAdvancedSettings;
  }

  get showAdvancedSettings(): boolean {
    return this.privateShowAdvancedSettings;
  }

  ngOnInit(): void {
    // this.substance = this.substanceFormSsg4mSitesService.substance;
    const subscription = this.substanceFormService.substance.subscribe(substance => {
      this.substance = substance;
    });
    this.subscriptions.push(subscription);
    // Get Config variables for SSG4
    this.configSsg4Form = (this.configService.configData && this.configService.configData.ssg4Form) || null;
    this.configTitleStage = 'Stage';
    if (this.configSsg4Form) {
      this.configTitleStage = this.configSsg4Form.titles.stage || null;
      if (!this.configTitleStage) {
        this.configTitleStage = 'Stage';
      }
    }
  }

  ngOnDestroy(): void {
    // this.substanceFormService.unloadSubstance();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addStage(processIndex: number, siteIndex: number) {
    this.substanceFormSsg4mSitesService.addStage(processIndex, siteIndex);
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-site-stage-0`, 'center');
    });
  }

  confirmDeleteSite() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: { message: 'Are you sure you want to delele Site ' + (this.siteIndex + 1) + ' for Process ' + (this.processIndex + 1) + '?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result === true) {
        this.deleteSite();
      }
    });
  }

  deleteSite(): void {
    this.substance.specifiedSubstanceG4m.process[this.processIndex].sites.splice(this.siteIndex, 1);
  }
}
