import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {SubstanceCardBaseFilteredList, SubstanceCardBaseList} from '@gsrs-core/substance-form/substance-form-base-filtered-list';
import {Link, Linkage, Site, Subunit, Sugar} from '@gsrs-core/substance';
import {Subscription} from 'rxjs';
import {SubstanceFormService} from '@gsrs-core/substance-form/substance-form.service';
import {ScrollToService} from '@gsrs-core/scroll-to/scroll-to.service';
import {GoogleAnalyticsService} from '@gsrs-core/google-analytics';

@Component({
  selector: 'app-substance-form-sugars',
  templateUrl: './substance-form-sugars.component.html',
  styleUrls: ['./substance-form-sugars.component.scss']
})
export class SubstanceFormSugarsComponent extends SubstanceCardBaseFilteredList<Sugar>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList  {

  sugars: Array<Sugar>;
  subunits: Array<Subunit>;
  remainingSites: Array<Site> = [];
  invalidSites = 0 ;
  private subscriptions: Array<Subscription> = [];
  constructor(
    private substanceFormService: SubstanceFormService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService,

  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form sugars';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Sugars');
  }

  ngAfterViewInit() {
    const sugarsSubscription = this.substanceFormService.substanceSugars.subscribe(sugars => {
      this.sugars = sugars;
      this.getRemainingSites();
    });
    this.subscriptions.push(sugarsSubscription);
    const subunitsSubscription = this.substanceFormService.substanceSubunits.subscribe(subunits => {
      this.subunits = subunits;
      this.getRemainingSites();
    });
    this.subscriptions.push(subunitsSubscription);

  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  getRemainingSites(): void {
    let sugarArray = [];
    const subunitArray = [];
    if (this.subunits && this.sugars) {
      this.subunits.forEach(unit => {
        if (unit.sequence != null && unit.sequence.length > 0) {
          for (let i = 1; i <= unit.sequence.length; i++) {
            subunitArray.push({subunitIndex: unit.subunitIndex, residueIndex: i});
          }
        }
      });
      this.sugars.forEach(sugar => {
        sugarArray = sugarArray.concat(sugar.sites);
      });
    }
    this.remainingSites = subunitArray.filter(item => {return !sugarArray.some(function(obj2) {
        return (item.subunitIndex === obj2.subunitIndex && item.residueIndex === obj2.residueIndex);
      });
    });
    this.invalidSites = subunitArray.length - sugarArray.length;
  }

  addItem(): void {
    this.addOtherSugar();
  }

  addOtherSugar(): void {
    this.substanceFormService.addSubstanceSugar();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-sugars-0`, 'center');
    });
  }

  deleteSugar(sugar: Sugar): void {
    this.substanceFormService.deleteSubstanceSugar(sugar);
  }


  private findElements<T, V>(array: T[], property: string, value: V): T[] {
    const foundElements: T[] = [];
    for (const element of array) {
      if (element[property] === value) {
        foundElements.push(element);
      }
    }
    return foundElements;
  }
}
