import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UtilsService } from '../utils/utils.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { MatAutocompleteSelectedEvent } from '@angular/material';
import { Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
  searchControl = new FormControl();
  autoCompleteOptions: Array<any>;

  constructor(
    private utilsService: UtilsService,
    private router: Router
  ) {
    this.autoCompleteOptions = [];
  }

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap(searchValue =>
        this.utilsService.getStructureSearchSuggestions(searchValue)
      )
    ).subscribe((response: any) => {
      this.autoCompleteOptions = response.Name;
    }, error => {
      console.log(error);
    });
  }

  substanceSearchOptionSelected(event: MatAutocompleteSelectedEvent) {
    console.log(event.option.value);
    let navigationExtras: NavigationExtras = {
      queryParams: { 'search_term': event.option.value }
    };

    // Navigate to the login page with extras
    this.router.navigate(['/browse-substance'], navigationExtras);
  }

}
