import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SubstanceName, SubstanceNameOrg } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { UtilsService } from '../../utils/utils.service';

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.scss']
})
export class NameFormComponent implements OnInit {
  private privateName: SubstanceName;
  @Output() priorityUpdate = new EventEmitter<SubstanceName>();
  @Output() nameDeleted = new EventEmitter<SubstanceName>();
  nameControl = new FormControl('');
  nameTypes: Array<VocabularyTerm> = [];
  nameTypeControl = new FormControl('');
  deleteTimer: any;

  constructor(
    private cvService: ControlledVocabularyService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set name(name: SubstanceName) {
    if (name != null) {
      this.privateName = name;
      if (!this.privateName.languages || this.privateName.languages.length === 0) {
        this.privateName.languages = ['en'];
      }
      if (!this.privateName.type) {
        this.privateName.type = 'cn';
      }
    }
  }

  get name(): SubstanceName {
    return this.privateName || {};
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

  deleteName(): void {
    this.name.$$deletedCode = this.utilsService.newUUID();

    if (!this.name.name
      && !this.name.type
    ) {
      this.deleteTimer = setTimeout(() => {
        this.nameDeleted.emit(this.name);
      }, 2000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.name.$$deletedCode;
  }

  getNameOrgs(name: SubstanceName): Array<SubstanceNameOrg> {
    if (!name.nameOrgs) {
      name.nameOrgs = [];
    }
    return name.nameOrgs as Array<SubstanceNameOrg>;
  }
}
