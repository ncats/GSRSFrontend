import { Component, OnInit, Input } from '@angular/core';
import { SubstanceName } from '../../substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-name-form',
  templateUrl: './name-form.component.html',
  styleUrls: ['./name-form.component.scss']
})
export class NameFormComponent implements OnInit {
  @Input() name: SubstanceName;
  nameControl: FormControl;

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.nameControl = new FormControl(this.name.name);
    this.nameControl.valueChanges.subscribe(value => {
      this.name.name = value;
    });
  }

}
