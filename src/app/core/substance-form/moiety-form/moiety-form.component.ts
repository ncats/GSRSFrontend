import { Component, OnInit, Input } from '@angular/core';
import { SubstanceMoiety } from '@gsrs-core/substance/substance.model';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-moiety-form',
  templateUrl: './moiety-form.component.html',
  styleUrls: ['./moiety-form.component.scss']
})
export class MoietyFormComponent implements OnInit {
  private privateMoiety: SubstanceMoiety;

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  @Input()
  set moiety(moiety: SubstanceMoiety) {
    this.privateMoiety = moiety;
  }

  get name(): SubstanceMoiety {
    return this.privateMoiety;
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('NAME_TYPE').subscribe(response => {

    });
  }

}
