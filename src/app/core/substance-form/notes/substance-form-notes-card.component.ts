import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { SubstanceCardBaseFilteredList, SubstanceCardBaseList } from '../base-classes/substance-form-base-filtered-list';
import { SubstanceFormService } from '../substance-form.service';
import { SubstanceNote } from '@gsrs-core/substance/substance.model';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { Subscription } from 'rxjs';
import { SubstanceFormNotesService } from './substance-form-notes.service';

@Component({
  selector: 'app-substance-form-notes-card',
  templateUrl: './substance-form-notes-card.component.html',
  styleUrls: ['./substance-form-notes-card.component.scss']
})
export class SubstanceFormNotesCardComponent extends SubstanceCardBaseFilteredList<SubstanceNote>
  implements OnInit, AfterViewInit, OnDestroy, SubstanceCardBaseList {

  notes: Array<SubstanceNote>;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private substanceFormNotesService: SubstanceFormNotesService,
    private scrollToService: ScrollToService,
    public gaService: GoogleAnalyticsService
  ) {
    super(gaService);
    this.analyticsEventCategory = 'substance form notes';
  }

  ngOnInit() {
    this.canAddItemUpdate.emit(true);
    this.menuLabelUpdate.emit('Notes');
  }

  ngAfterViewInit() {
    const notesSubscription = this.substanceFormNotesService.substanceNotes.subscribe(notes => {
      this.notes = notes;
      this.filtered = notes;
      const searchSubscription = this.searchControl.valueChanges.subscribe(value => {
        this.filterList(value, this.notes, this.analyticsEventCategory);
      }, error => {
        console.log(error);
      });
      this.subscriptions.push(searchSubscription);
      this.page = 0;
      this.pageChange();
    });
    this.subscriptions.push(notesSubscription);
  }

  ngOnDestroy() {
    this.componentDestroyed.emit();
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  addItem(): void {
    this.addNote();
  }

  addNote(): void {
    this.substanceFormNotesService.addSubstanceNote();
    setTimeout(() => {
      this.scrollToService.scrollToElement(`substance-note-0`, 'center');
    });
  }

  deleteNote(note: SubstanceNote): void {
    this.substanceFormNotesService.deleteSubstanceNote(note);
  }

}
