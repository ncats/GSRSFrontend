import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Observable } from 'rxjs';
import { SubstanceDetail } from '../../substance/substance.model';

@Component({
  selector: 'app-access-manager',
  templateUrl: './access-manager.component.html',
  styleUrls: ['./access-manager.component.scss']
})
export class AccessManagerComponent implements OnInit, AfterViewInit {
  accessOptions: Array<VocabularyTerm>;
  access: Array<string> = [];
  @Input('substanceUpdated') substanceUpdated: Observable<SubstanceDetail>;
  tooltipMessage: string;
  accessFormGroup = new FormGroup({});

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.substanceUpdated.subscribe(substance => {
      this.access = substance.access;
      this.getVocabularies();
    });
  }

  ngAfterViewInit() {}

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('ACCESS_GROUP').subscribe(response => {
      const accessOptions = response['ACCESS_GROUP'].list;
      this.createAccessFromGroup(accessOptions);
      this.accessOptions = accessOptions;
      this.crosscheckAccesses();
    });
  }

  private createAccessFromGroup(accessOptions: Array<VocabularyTerm> = []): void {
    const group: any = {};
    accessOptions.forEach(accessOption => {
      group[accessOption.value] = new FormControl();
    });
    this.accessFormGroup = new FormGroup(group);
  }

  private crosscheckAccesses() {
    this.tooltipMessage = 'Access is set to: ';

    if (this.access.length > 0) {
      this.access.forEach(accessOption => {
        for (let i = 0; i < this.accessOptions.length; i++) {
          if (accessOption === this.accessOptions[i].value) {
            this.accessFormGroup.controls[accessOption].setValue(true);
            this.tooltipMessage += (this.accessOptions[i].display + ', ');
            break;
          }
        }
      });
      this.tooltipMessage = this.tooltipMessage.replace(/(, )$/, '');
    } else {
      this.tooltipMessage += 'public';
    }
  }

  updateAccess(event: MatCheckboxChange, accessOption: VocabularyTerm): void {

    if (this.access.length === 0) {
      this.tooltipMessage = this.tooltipMessage.replace('public', '');
    }

    if (event.checked) {
      this.access.push(accessOption.value);

      if (this.access.length > 1) {
        this.tooltipMessage += ', ';
      }

      this.tooltipMessage += (accessOption.display);

    } else {

      const indexToRemove = this.access.indexOf(accessOption.value);

      if (indexToRemove > -1) {
        this.access.splice(indexToRemove, 1);
      }

      this.tooltipMessage = this.tooltipMessage.replace(accessOption.display, '')
        .replace(': , ', ': ')
        .replace(', ,', ',')
        .replace(/,$/, '')
        .replace(/(, )$/, '');

      if (this.access.length === 0) {
        this.tooltipMessage += 'public';
      }
    }
  }

}
