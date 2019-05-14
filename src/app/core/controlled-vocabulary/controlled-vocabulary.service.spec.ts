import { TestBed, inject } from '@angular/core/testing';

import { ControlledVocabularyService } from './controlled-vocabulary.service';

describe('ControlledVocabularyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ControlledVocabularyService]
    });
  });

  it('should be created', inject([ControlledVocabularyService], (service: ControlledVocabularyService) => {
    expect(service).toBeTruthy();
  }));
});
