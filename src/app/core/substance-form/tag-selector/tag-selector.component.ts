import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss']
})
export class TagSelectorComponent implements OnInit, AfterViewInit {
  @Input() cvDomain: string;
  @Input() tagsAsync?: Observable<Array<string>>;
  @Input() tagsSync?: Array<string>;
  @Output() tagsOut = new EventEmitter<Array<string>>();
  tags: Array<string> = [];
  allOptions: Array<VocabularyTerm>;
  filteredOptions: Observable<Array<VocabularyTerm>>;
  tagControl = new FormControl();
  @ViewChild('tagInput') tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto') matAutocomplete: MatAutocomplete;
  optionsDictionary: { [dictionaryValue: string]: VocabularyTerm } = {};

  constructor(
    private cvService: ControlledVocabularyService
  ) {
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cvService.getDomainVocabulary(this.cvDomain).subscribe(response => {
        this.allOptions = response[this.cvDomain].list;
        this.optionsDictionary = response[this.cvDomain].dictionary;

        this.filteredOptions = this.tagControl.valueChanges.pipe(
          startWith(null),
          map((tag: string | null) => tag ? this._filter(tag) : this.allOptions.filter(option => this.tags.indexOf(option.value) === -1)));
      });
      if (this.tagsAsync) {
        this.tagsAsync.subscribe(tags => {
          this.tags = tags;
        });
      }

      if (this.tagsSync) {
        this.tags = this.tagsSync;
      }
    });
  }

  clearTagsInput(): void {
    this.tagInput.nativeElement.value = '';
    this.tagControl.setValue(null);
  }

  remove(tag: string): void {
    const index = this.tags.indexOf(tag);
    if (index > -1) {
      this.tags.splice(index, 1);
    }
    this.tagsOut.emit(this.tags);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.tags.push(event.option.value);
    this.tagInput.nativeElement.value = '';
    this.tagControl.setValue(null);
    this.tagsOut.emit(this.tags);
  }

  private _filter(value: string): Array<VocabularyTerm> {
    const filterValue = value.toLowerCase();

    return this.allOptions.filter(option => {
      return this.tags.indexOf(option.value) === -1 && option.display.toLowerCase().indexOf(filterValue) > -1;
    });
  }

}
