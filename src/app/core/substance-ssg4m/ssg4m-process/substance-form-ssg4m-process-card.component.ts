import { Component, OnInit, AfterViewInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent, NavigationStart, NavigationEnd } from '@angular/router';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { Subscription } from 'rxjs';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { HttpClient, HttpParams } from '@angular/common/http';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../../substance-form/base-classes/substance-form-base-filtered-list';
import { SubstanceFormService } from '../../substance-form/substance-form.service';
import { SubstanceFormSsg4mProcessService } from './substance-form-ssg4m-process.service';
import { SubstanceFormSsg4mSitesService } from '../ssg4m-sites/substance-form-ssg4m-sites.service';
import { SpecifiedSubstanceG4mProcess } from '@gsrs-core/substance/substance.model';
import { ConfigService } from '@gsrs-core/config/config.service';
import { StructureImageModalComponent, StructureService } from '@gsrs-core/structure';
import { Ssg4mStepViewDialogComponent } from '../ssg4m-step-view-dialog/ssg4m-step-view-dialog.component';

@Component({
  selector: 'app-substance-form-ssg4m-process-card',
  templateUrl: './substance-form-ssg4m-process-card.component.html',
  styleUrls: ['./substance-form-ssg4m-process-card.component.scss']
})

export class SubstanceFormSsg4mProcessCardComponent extends SubstanceCardBaseFilteredList<SpecifiedSubstanceG4mProcess>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {

  process: Array<SpecifiedSubstanceG4mProcess>;
  private subscriptions: Array<Subscription> = [];
  showAdvancedSettings = false;
  tabSelectedView = 'Form View';
  showView = 'form';
  tabSelectedIndex = 0;
  tabTitle = ['form', 'step', 'scheme'];
  private overlayContainer: HTMLElement;

  constructor(
    private substanceFormSsg4mProcessService: SubstanceFormSsg4mProcessService,
    private substanceFormSsg4mSitesService: SubstanceFormSsg4mSitesService,
    private substanceFormService: SubstanceFormService,
    public configService: ConfigService,
    private overlayContainerService: OverlayContainer,
    private dialog: MatDialog,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private http: HttpClient,
    private activatedRoute: ActivatedRoute
  ) {
    super(gaService);
    //  this.analyticsEventCategory = 'substance form ssg4m process';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Processes');
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    let loaded = false;

    setInterval(() => {
      if (window['schemeUtil'] && !loaded) {
        loaded = true;
        //setup viz stuff
        //TODO: make more configurable and standardized
        console.log("About to configure the scheme view");
        window['schemeUtil'].debug = false;

        window['schemeUtil'].maxContinuousSteps = 1;
        window['schemeUtil'].maxTextLen = 30;
        window['schemeUtil'].BREAK_GAP = 300;
        window['schemeUtil'].maxTitleTextLen = 100;

        const url = `${(this.configService.configData && this.configService.configData.apiBaseUrl) || '/'}api/v1/`;
        const httpp = this.http;
        window['schemeUtil'].apiBaseURL = url;

        //allow resolution of svgs
        window['schemeUtil'].urlResolver = (u, cb) => {
          httpp.get(u, { responseType: 'text' }).subscribe(svg => {
            cb(svg);
          }, error => {
            cb("ERROR");
          });
        };
        //TODO:
        window['schemeUtil'].onClickReaction = (d) => {
          //Can we add a popup dialog that would show the specific step here?
          let pindex = d.processIndex;
          let sindex = d.stepIndex;
          let siteIndex = d.siteIndex;
          if (typeof siteIndex === "undefined") {
            siteIndex = 0;
          }
          this.showStepViewDialog(pindex, siteIndex, sindex);

          //I just want to show a dialog that shows the step/stage component rendered in a popup for now.
          //maybe in the future it should instead be a side window, I don't know.
        };

        //TODO:
        window['schemeUtil'].onClickMaterial = (d) => {
          this.openImageModal(d.refuuid, d.name, d.bottomText);
        };

        if (window['schemeUtil'].executeWhenLoaded) {
          window['schemeUtil'].executeWhenLoaded();
        }
      }
    }, 100);

    // Get the parameter from URL and set the tab to either form view, step view, or scheme view.
    this.showView = this.activatedRoute.snapshot.queryParams['view'] || 'form';
    let urlTabIndex = this.tabTitle.indexOf(this.showView);
    if (urlTabIndex != -1) {
      this.onSelectedIndexChange(urlTabIndex);
    }

  }

  ngAfterViewInit() {
    const processSubscription = this.substanceFormSsg4mProcessService.specifiedSubstanceG4mProcess.subscribe(process => {
      this.process = process;
      this.filtered = process;
      /*
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.notes, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      */
      //   this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
    });

    this.subscriptions.push(processSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addProcess();
  }

  openImageModal(subUuid: string, approvalID: string, displayName: string): void {

    let data: any;
    data = {
      structure: subUuid,
      uuid: subUuid,
      approvalID: approvalID,
      displayName: displayName
    };

    const dialogRef = this.dialog.open(StructureImageModalComponent, {
      height: '96%',
      width: '650px',
      panelClass: 'structure-image-panel',
      data: data
    });

    this.overlayContainer.style.zIndex = '1002';

    const subscription = dialogRef.afterClosed().subscribe(() => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    }, () => {
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    });
  }

  addProcess(): void {
    this.substanceFormSsg4mProcessService.addProcess();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-process-0`, 'center');
    });
  }

  deleteProcess(process: SpecifiedSubstanceG4mProcess): void {
    //  this.substanceFormSsg4mProcessService.deleteProcess(process);
  }

  updateProcess($event) {

  }

  updateAdvancedSettings(event): void {
    this.showAdvancedSettings = event.checked;
  }

  tabSelected($event) {
    if ($event) {
      const evt: any = $event.tab;
      const textLabel: string = evt.textLabel;
      if (textLabel != null) {
        this.tabSelectedView = textLabel;
      }
      //  const ssgjs = JSON.stringify(this.substanceFormService.cleanSubstance());
      //  window['schemeUtil'].renderScheme(window['schemeUtil'].makeDisplayGraph(JSON.parse(ssgjs)), "#scheme-viz-view");
    }

  }

  onSelectedIndexChange(tabIndex: number) {
    this.tabSelectedIndex = tabIndex;
    if (this.tabSelectedIndex === 2) {
      document.querySelector("#scheme-viz-view").className = "";
      //This is a hacky placeholder way to force viz
      //TODO finish this
      const ssgjs = JSON.stringify(this.substanceFormService.cleanSubstance());

      console.log("About to load the scheme view");
      if (window['schemeUtil']) {
        if (window['schemeUtil'].debug) {
          window['schemeUtil'].executeWhenLoaded = (() => {
            console.log("About to render the scheme view");
            window['schemeUtil'].renderScheme(window['schemeUtil'].makeDisplayGraph(JSON.parse(ssgjs)), "#scheme-viz-view");
            window['schemeUtil'].executeWhenLoaded = null;
          });
        } else {
          console.log("About to render the scheme view");
          window['schemeUtil'].renderScheme(window['schemeUtil'].makeDisplayGraph(JSON.parse(ssgjs)), "#scheme-viz-view");
        }
      }
    } else {
      document.querySelector("#scheme-viz-view").className = "hidden";
    }
  }

  tabSelectedIndexOutChange(tabIndex: number) {
    this.tabSelectedIndex = tabIndex;
  }

  showStepViewDialog(processIndex: number, siteIndex: number, stageIndex: number) {
    const data = {
      processIndex: processIndex,
      siteIndex: siteIndex,
      stageIndex: stageIndex
    };

    const dialogRef = this.dialog.open(Ssg4mStepViewDialogComponent, {
      width: '90%',
      height: '80%',
      panelClass: 'structure-image-panel',
      data: data
    });

    this.overlayContainer.style.zIndex = '1002';

    let localTabSelectedIndex = -1;
    const subscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      localTabSelectedIndex = response;
      subscription.unsubscribe();
      if (localTabSelectedIndex > -1) {
        this.tabSelectedIndex = localTabSelectedIndex;
      }
      this.overlayContainer.style.zIndex = null;
      subscription.unsubscribe();
    });
  }
}
