import { TestBed, inject } from '@angular/core/testing';

import { DataDictionaryService } from './data-dictionary.service';

describe('DataDictionaryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DataDictionaryService]
    });
  });

  it('should be created', inject([DataDictionaryService], (service: DataDictionaryService) => {
    expect(service).toBeTruthy();
  }));
});
