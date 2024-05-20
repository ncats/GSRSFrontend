import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { SubstanceName } from '@gsrs-core/substance/substance.model';
import { SubstanceFormService } from '../substance-form.service';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';
import { SubstanceFormNamesService } from './substance-form-names.service';
import { ConfigService } from '@gsrs-core/config';

@Component({
  selector: 'app-substance-form-names-card',
  templateUrl: './substance-form-names-card.component.html',
  styleUrls: ['./substance-form-names-card.component.scss']
})
export class SubstanceFormNamesCardComponent
  extends SubstanceCardBaseFilteredList<SubstanceName>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {
  names: Array<SubstanceName>;
  private subscriptions: Array<Subscription> = [];
  pageSize = 10;
  expanded = true;
  showStd = false;
  showMore = false;
  appId: string;
  standardizeButton = false;
  pageSizeOptions = [5, 10, 25, 100];

  constructor(
    private substanceFormNamesService: SubstanceFormNamesService,
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,
    private configService: ConfigService,

  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form names';
  }

  ngOnInit() {
    this.menuLabelUpdate.emit('Names');
    this.appId = this.configService.environment.appId;
    this.standardizeButton = this.configService.configData.showNameStandardizeButton || false;
    if (this.configService && this.configService.configData && this.configService.configData.nameFormPageSizeOptions) {
        this.pageSizeOptions = this.configService.configData.nameFormPageSizeOptions;
    }
    if (this.configService && this.configService.configData && this.configService.configData.nameFormPageSizeDefault) {
      this.pageSize = this.configService.configData.nameFormPageSizeDefault;
    }
    const definitionSubscription = this.substanceFormService.definition.subscribe( level => {
      if (level.definitionType && level.definitionType === 'ALTERNATIVE') {
      //  this.canAddItemUpdate.emit(false);
        this.hiddenStateUpdate.emit(true);
      } else {
        this.canAddItemUpdate.emit(true);
        this.hiddenStateUpdate.emit(false);
      }
      });
    this.subscriptions.push(definitionSubscription);
    const namesSubscription = this.substanceFormNamesService.substanceNames.subscribe(names => {

      this.names = names;
      this.filtered = names;
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.names, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
    });
    this.subscriptions.push(namesSubscription);
  }

  ngAfterViewInit() {

  }


  collapse() {
    this.expanded = !this.expanded;
  }

  standardize(): void {
    // We currently only want the back-end to standardize names
   // this.substanceFormNamesService.standardizeNames();
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addName();
  }

  addName(): void {
    this.substanceFormNamesService.addSubstanceName();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-name-0`, 'center');
    });
  }

  priorityUpdated(updatedName: SubstanceName): void {
    this.names.forEach(name => {
      if (name !== updatedName) {
        name.displayName = false;
      }
    });
  }

  deleteName(name: SubstanceName): void {
    this.substanceFormNamesService.deleteSubstanceName(name);
  }

}
