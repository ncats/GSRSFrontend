import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceName } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.scss']
})
export class NameFormComponent implements OnInit {
  @Input() name: SubstanceName;
  @Output() priorityUpdate = new EventEmitter<SubstanceName>();
  @Output() nameDeleted = new EventEmitter<SubstanceName>();
  nameControl: FormControl;
  nameTypes: Array<VocabularyTerm> = [];
  nameTypeControl: FormControl;
  isDeleted = false;

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.nameControl = new FormControl(this.name.name);
    this.nameControl.valueChanges.subscribe(value => {
      this.name.name = value;
    });
    this.nameTypeControl = new FormControl(this.name.type, [Validators.required]);
    this.nameTypeControl.valueChanges.subscribe(value => {
      this.name.type = value;
    });
    this.getVocabularies();
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('NAME_TYPE').subscribe(response => {
      this.nameTypes = response['NAME_TYPE'].list;
    });
  }

  priorityUpdated(event: MatRadioChange) {
    this.name.displayName = (event.value === 'true');
    this.priorityUpdate.emit(this.name);
  }

  updateAccess(access: Array<string>): void {
    this.name.access = access;
  }

  updateLanguages(languages: Array<string>): void {
    this.name.languages = languages;
  }

  updateDomains(domains: Array<string>): void {
    this.name.domains = domains;
  }

  updateJurisdiction(jurisdiction: Array<string>): void {
    this.name.nameJurisdiction = jurisdiction;
  }

  updatePreferred(event: MatCheckboxChange): void {
    this.name.preferred = event.checked;
  }

  deleteName(): void {
    this.isDeleted = true;
    setTimeout(() => {
      this.nameDeleted.emit(this.name);
    }, 500);
  }
}
