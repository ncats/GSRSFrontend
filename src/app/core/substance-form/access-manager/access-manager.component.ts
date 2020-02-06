import { Component, OnInit, Input, AfterViewInit, Output, EventEmitter, ElementRef } from '@angular/core';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, FormGroup } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';

@Component({
  selector: 'app-access-manager',
  templateUrl: './access-manager.component.html',
  styleUrls: ['./access-manager.component.scss']
})
export class AccessManagerComponent implements OnInit, AfterViewInit {
  accessOptions: Array<VocabularyTerm> = [];
  privateAccess: Array<string> = [];
  @Output() accessOut = new EventEmitter<Array<string>>();
  tooltipMessage: string;
  accessFormGroup = new FormGroup({});

  constructor(
    private cvService: ControlledVocabularyService,
    private element: ElementRef
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  ngAfterViewInit() {}

  @Input()
  set access(access: Array<string>) {
    if (access != null) {
      this.privateAccess = access;
    } else {
      this.privateAccess = [];
    }
    this.crosscheckAccesses();
  }

  get access(): Array<string> {
    return this.privateAccess;
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

    if (this.privateAccess.length > 0 && this.accessOptions.length > 0) {
      this.privateAccess.forEach(accessOption => {
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

    if (this.privateAccess.length === 0) {
      this.tooltipMessage = this.tooltipMessage.replace('public', '');
    }

    if (event.checked) {
      this.privateAccess.push(accessOption.value);

      if (this.privateAccess.length > 1) {
        this.tooltipMessage += ', ';
      }

      this.tooltipMessage += (accessOption.display);

    } else {

      const indexToRemove = this.privateAccess.indexOf(accessOption.value);

      if (indexToRemove > -1) {
        this.privateAccess.splice(indexToRemove, 1);
      }

      this.tooltipMessage = this.tooltipMessage.replace(accessOption.display, '')
        .replace(': , ', ': ')
        .replace(', ,', ',')
        .replace(/,$/, '')
        .replace(/(, )$/, '');

      if (this.privateAccess.length === 0) {
        this.tooltipMessage += 'public';
      }
    }

    this.accessOut.emit(this.privateAccess);
  }

  menuOpened(): void {
    const event: Event = new Event('focusin', { bubbles: true, cancelable: true} );
    this.element.nativeElement.dispatchEvent(event);
  }

  menuClosed(): void {
    const event: Event = new Event('focusout', { bubbles: true, cancelable: true} );
    this.element.nativeElement.dispatchEvent(event);
  }

}
