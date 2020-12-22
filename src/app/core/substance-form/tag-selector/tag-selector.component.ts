import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';
import { MatAutocompleteSelectedEvent, MatAutocomplete } from '@angular/material/autocomplete';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { MatChipInputEvent, MatDialog } from '@angular/material';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import { OverlayContainer } from '@angular/cdk/overlay';
import { AuthService } from '@gsrs-core/auth';
import { CvDialogComponent } from '@gsrs-core/substance-form/cv-dialog/cv-dialog.component';

@Component({
  selector: 'app-tag-selector',
  templateUrl: './tag-selector.component.html',
  styleUrls: ['./tag-selector.component.scss']
})
export class TagSelectorComponent implements OnInit, AfterViewInit {
  @Input() cvDomain: string;
  @Output() tagsUpdate = new EventEmitter<Array<string>>();
  @Input() placeholder = 'Tags';
  @Input() disableCV?: boolean;
  privateTags: Array<string> = [];
  allOptions: Array<VocabularyTerm>;  
  cvOptions: Array<VocabularyTerm>;
  filteredOptions: Observable<Array<VocabularyTerm>>;
  tagControl = new FormControl();
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  @ViewChild('tagInput', {static: true}) tagInput: ElementRef<HTMLInputElement>;
  @ViewChild('tagsAuto', {static: true}) matAutocomplete: MatAutocomplete;
  optionsDictionary: { [dictionaryValue: string]: VocabularyTerm } = {};
  private overlayContainer: HTMLElement;
  isAdmin: boolean;

  constructor(
    private cvService: ControlledVocabularyService,
    private dialog: MatDialog,
    private overlayContainerService: OverlayContainer,
    private authService: AuthService

  ) {
  }

  ngOnInit() {
    this.overlayContainer = this.overlayContainerService.getContainerElement();
    this.isAdmin = this.authService.hasRoles('admin');
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.cvService.getDomainVocabulary(this.cvDomain).subscribe(response => {
        this.allOptions = response[this.cvDomain].list;
        this.cvOptions = response[this.cvDomain].list;
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

  inCV(vocab: Array<VocabularyTerm>, property: string): boolean {
    if (vocab) {
      return vocab.some(r => property === r.value);
    } else {
      return true;
    }
  }

  tagAdded(event: MatChipInputEvent): void {
    if ((event.value || '').trim()) {
      const addedTag = event.value.trim();
      this.privateTags.push(addedTag);
      this.tagsUpdate.emit(this.privateTags);
      if (this.isAdmin && !this.inCV(this.allOptions, addedTag) && !this.disableCV) {
        if (confirm('Add new option to the CV?')) {
          const vocabSubscription = this.cvService.fetchFullVocabulary(this.cvDomain).subscribe ( response => {
            if (response.content && response.content.length > 0) {
              const toPut = response.content[0];
              this.openDialog(toPut, addedTag);
            }
          });
        }
      }
    this.clearTagsInput();
    }
    if (event.input) {
      event.input.value = '';
    }
  }



  private _filter(value: string): Array<VocabularyTerm> {
    const filterValue = value.toLowerCase();

    return this.allOptions.filter(option => {
      return this.privateTags.indexOf(option.value) === -1 && option.display.toLowerCase().indexOf(filterValue) > -1;
    });
  }

  openDialog(vocab: any, term: string): void {
    const dialogRef = this.dialog.open(CvDialogComponent, {
      data: {'vocabulary': vocab, 'term': term},
      width: '1040px'
    });
    this.overlayContainer.style.zIndex = '1002';
    const dialogSubscription = dialogRef.afterClosed().subscribe(response => {
      this.overlayContainer.style.zIndex = null;
      if (response ) {
      }
    });
  }
}
