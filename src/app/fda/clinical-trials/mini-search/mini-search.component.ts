import { Component, Output, Input, EventEmitter, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NavigationExtras, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SubstanceSuggestionsGroup } from '@gsrs-core/utils';
import { UtilsService } from '@gsrs-core/utils';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';

@Component({
  selector: 'app-mini-search',
  templateUrl: './mini-search.component.html',
  styleUrls: ['./mini-search.component.scss']
})
export class MiniSearchComponent implements OnInit, AfterViewInit {

  @Input() myIndex: number;
  @Input() myInitialSearch: string;


  // need to handle escape or none selected???
  // https://github.com/angular/material2/issues/3334
  // https://material.angular.io/components/autocomplete/api
  // regarding myIndex, etc, think about how this could be generlized, so that an object
  // is added onto the data emitted. This would allow mini search to be used in other
  // contexts than in this assumed table type layout.

  // need to consider what happens when partial change to text is made but nothing is selected.
  // might be too complicated to implement w/out a modal or something.


  @Output() miniSearchOutput = new EventEmitter<any>();
  @ViewChild(MatAutocompleteTrigger, { static: true }) trigger;

  searchControl = new FormControl();

  substanceSuggestionsGroup: SubstanceSuggestionsGroup;
  suggestionsFields: Array<string>;
  mainPathSegment = '';
  // try to get this from the markup.
  showIcon = false;
  suggestions: Array<any> = [];
  constructor(
    private utilsService: UtilsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchValue =>
        this.utilsService.getStructureSearchSuggestions(searchValue)
      )
    ).subscribe((response: SubstanceSuggestionsGroup) => {
      this.substanceSuggestionsGroup = response;
      this.suggestionsFields = Object.keys(this.substanceSuggestionsGroup);
      this.suggestions = response['Name'];
    }, error => {
    });

    this.mainPathSegment = this.getMainPathSegmentFromUrl(this.router.routerState.snapshot.url.substring(1));

    this.router.events.subscribe((event: RouterEvent) => {
      if (event instanceof NavigationEnd) {
        this.mainPathSegment = this.getMainPathSegmentFromUrl(event.url.substring(1));
      }
    });
  }

  ngAfterViewInit() {
    this.searchControl.setValue(this.myInitialSearch);
    this.trigger.panelClosingActions
      .subscribe(e => {
        const data = {value: this.searchControl.value, myIndex: this.myIndex};
        this.miniSearchOutput.emit(data);
        this.trigger.closePanel();
      });
  }

  getMainPathSegmentFromUrl(url: string): string {
    const path = url.split('?')[0];
    const mainPathPart = path.split('/')[0];
    return mainPathPart;
  }

  substanceSearchOptionSelected(event?: MatAutocompleteSelectedEvent) {
    // this.navigateToSearchResults(event.option.value);
    const data = {value: event.option.value, myIndex: this.myIndex};
    this.miniSearchOutput.emit(data);
  }

  processSubstanceNameSearch() {
    // will enhance in future
    // const searchTerm = this.searchControl.value;
  }

  navigateToSearchResults(searchTerm: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: searchTerm ? { 'search_term': searchTerm } : null
    };
    this.router.navigate(['/browse-substance'], navigationExtras);
  }

}
