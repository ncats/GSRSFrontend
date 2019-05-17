import { Component, OnInit, ElementRef, AfterViewInit, Pipe } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { SubstanceSuggestionsGroup } from '../utils/substance-suggestions-group.model';
import { UtilsService } from '../utils/utils.service';

@Component({
  selector: 'app-substance-search-form',
  templateUrl: './substance-search-form.component.html',
  styleUrls: ['./substance-search-form.component.scss']
})
export class SubstanceSearchFormComponent implements OnInit {
  searchControl = new FormControl();
  substanceSuggestionsGroup: SubstanceSuggestionsGroup;
  suggestionsFields: Array<any>;
  matOpen = true;
  private testElem: HTMLElement;
  private searchContainerElement: HTMLElement;
  private query: string;

  constructor(
    private utilsService: UtilsService,
    private element: ElementRef
  ) { }

  ngOnInit() {
  }

}
