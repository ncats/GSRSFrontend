import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-access-manager',
  templateUrl: './access-manager.component.html',
  styleUrls: ['./access-manager.component.scss']
})
export class AccessManagerComponent implements OnInit, AfterViewInit {
  accessOptions: Array<VocabularyTerm>;
  @Input('access') access: Array<string>;
  isPublic = true;
  tooltipMessage: string;
  accessFormGroup = new FormGroup({});

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  ngAfterViewInit() {
    console.log(this.access);
  }

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
      this.tooltipMessage = this.tooltipMessage.replace(/, ([^, ]*)$/, '$1');
    } else {
      this.tooltipMessage += 'public';
    }
  }

  updateAccess(event: MatCheckboxChange, accessValue: string): void {
    if (event.checked) {
      this.access.push(accessValue);
    }
  }

}
