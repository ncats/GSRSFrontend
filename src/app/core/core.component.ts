import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UtilsService } from '../utils/utils.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-core',
  templateUrl: './core.component.html',
  styleUrls: ['./core.component.scss']
})
export class CoreComponent implements OnInit {
  searchControl = new FormControl();
  autoCompleteOptions: Array<any>;

  constructor(
    private utilsService: UtilsService
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

  updateAutoCompleteOptions(searchValue: string) {

  }

}
