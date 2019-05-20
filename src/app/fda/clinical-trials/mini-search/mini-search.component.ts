import { Component, Output, Input, EventEmitter, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { NavigationExtras, Router, RouterEvent, NavigationEnd } from '@angular/router';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SubstanceSuggestionsGroup } from '../../utils/substance-suggestions-group.model';
import { UtilsService } from '../../utils/utils.service';
import {MatAutocompleteTrigger} from '@angular/material';

@Component({
  selector: 'mini-search',
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
  @ViewChild(MatAutocompleteTrigger) trigger;

  searchControl = new FormControl();
  
  substanceSuggestionsGroup: SubstanceSuggestionsGroup;
  suggestionsFields: Array<string>;
  mainPathSegment = '';
  // try to get this from the markup.
  showIcon=false;
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
      console.log(error);
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
    console.log("bbb"+this.myInitialSearch);

    this.trigger.panelClosingActions
      .subscribe(e => {
        if(e==null) {
        }

        console.log(JSON.stringify(e));

        var data = {value: this.searchControl.value, myIndex: this.myIndex}; 
        this.miniSearchOutput.emit(data);


          this.trigger.closePanel();
          console.log("In closing panel trigger subsciption")
        
      });
  }
  
  getMainPathSegmentFromUrl(url: string): string {
    const path = url.split('?')[0];
    const mainPathPart = path.split('/')[0];
    return mainPathPart;
  }

  substanceSearchOptionSelected(event?: MatAutocompleteSelectedEvent) {
    // this.navigateToSearchResults(event.option.value);
    var data = {value: event.option.value,myIndex: this.myIndex}; 
    console.log("xxx:" + JSON.stringify(data));
    this.miniSearchOutput.emit(data);
  }

  processSubstanceSearch() {
    const searchTerm = this.searchControl.value;
    this.navigateToSearchResults(searchTerm);
  }

  navigateToSearchResults(searchTerm: string) {
    const navigationExtras: NavigationExtras = {
      queryParams: searchTerm ? { 'search_term': searchTerm } : null
    };
    this.router.navigate(['/browse-substance'], navigationExtras);
  }

}
