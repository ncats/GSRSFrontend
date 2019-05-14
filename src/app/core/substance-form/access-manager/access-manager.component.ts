import { Component, OnInit } from '@angular/core';
import { ControlledVocabularyService } from '../../controlled-vocabulary/controlled-vocabulary.service';
import { VocabularyTerm } from '../../controlled-vocabulary/vocabulary.model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-access-manager',
  templateUrl: './access-manager.component.html',
  styleUrls: ['./access-manager.component.scss']
})
export class AccessManagerComponent implements OnInit {
  accessOptions: Array<VocabularyTerm>;

  constructor(
    private cvService: ControlledVocabularyService
  ) { }

  ngOnInit() {
    this.getVocabularies();
  }

  getVocabularies(): void {
    this.cvService.getDomainVocabulary('ACCESS_GROUP').subscribe(response => {
      this.accessOptions = response['ACCESS_GROUP'].list;
    });
  }

}
