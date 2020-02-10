import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { SubstanceName, SubstanceNameOrg } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { UtilsService } from '../../utils/utils.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.scss']
})
export class NameFormComponent implements OnInit, OnDestroy {
  private privateName: SubstanceName;
  @Output() priorityUpdate = new EventEmitter<SubstanceName>();
  @Output() nameDeleted = new EventEmitter<SubstanceName>();
  nameControl = new FormControl('');
  nameTypes: Array<VocabularyTerm> = [];
  nameTypeControl = new FormControl('');
  deleteTimer: any;
  private subscriptions: Array<Subscription> = [];

  constructor(
    private cvService: ControlledVocabularyService,
    private utilsService: UtilsService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
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
    const subscription = this.cvService.getDomainVocabulary('NAME_TYPE').subscribe(response => {
      this.nameTypes = response['NAME_TYPE'].list;
    });
    this.subscriptions.push(subscription);
  }

  priorityUpdated(event: MatRadioChange) {
    this.privateName.displayName = (event.value === 'true');
    this.priorityUpdate.emit(this.privateName);
  }

  updateAccess(access: Array<string>): void {
    this.privateName.access = access;
  }

  updateLanguages(languages: Array<string>): void {
    this.privateName.languages = languages;
  }

  updateDomains(domains: Array<string>): void {
    this.privateName.domains = domains;
  }

  updateJurisdiction(jurisdiction: Array<string>): void {
    this.privateName.nameJurisdiction = jurisdiction;
  }

  deleteName(): void {
    this.privateName.$$deletedCode = this.utilsService.newUUID();

    if (!this.privateName.name
      && !this.privateName.type
    ) {
      this.deleteTimer = setTimeout(() => {
        this.nameDeleted.emit(this.privateName);
      }, 2000);
    }
  }

  undoDelete(): void {
    clearTimeout(this.deleteTimer);
    delete this.privateName.$$deletedCode;
  }

  getNameOrgs(name: SubstanceName): Array<SubstanceNameOrg> {
    if (!name.nameOrgs) {
      name.nameOrgs = [];
    }
    return name.nameOrgs as Array<SubstanceNameOrg>;
  }
}
