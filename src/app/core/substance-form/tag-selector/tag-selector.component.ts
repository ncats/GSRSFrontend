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
  @Output() tagsUpdate = new EventEmitter<Array<string>>();
  @Input() placeholder = 'Tags';
  privateTags: Array<string> = [];
  allOptions: Array<VocabularyTerm>;
  filteredOptions: Observable<Array<VocabularyTerm>>;
  tagControl = new FormControl();
  @ViewChild('tagInput', {static: true}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('tagsAuto', {static: true}) matAutocomplete: MatAutocomplete;
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
        let inCV = false;
        this.allOptions.forEach(option => {
          if (option.display.toLowerCase() === 'other') {
            inCV = true;
          }
        });
        if (inCV === false) {
          const other = {
            display: 'Other',
            value: 'Other',
            filter: ' = ',
            selected: false
         };
         this.allOptions.push(other);
        }
        this.optionsDictionary = response[this.cvDomain].dictionary;

        this.filteredOptions = this.tagControl.valueChanges.pipe(
          startWith(<string>null),
          map((tag: string | null) => tag ? this._filter(tag)
            : this.allOptions.filter(option => this.privateTags.indexOf(option.value) === -1)));
      });
    });
  }

  @Input()
  set tags(tags: Array<string>) {
    this.privateTags = tags || [];
  }

  get tags(): Array<string> {
    return this.privateTags;
  }

  clearTagsInput(): void {
    setTimeout(() => {
      this.tagInput.nativeElement.value = '';
      if (!this.matAutocomplete.isOpen) {
      this.tagControl.setValue(null);
      }
    });
  }

  remove(tag: string): void {
    const index = this.privateTags.indexOf(tag);
    if (index > -1) {
      this.privateTags.splice(index, 1);
    }
    this.tagsUpdate.emit(this.privateTags);
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.privateTags.push(event.option.value);
    this.tagsUpdate.emit(this.privateTags);
    this.clearTagsInput();
  }

  private _filter(value: string): Array<VocabularyTerm> {
    const filterValue = value.toLowerCase();

    return this.allOptions.filter(option => {
      return this.privateTags.indexOf(option.value) === -1 && option.display.toLowerCase().indexOf(filterValue) > -1;
    });
  }
}
