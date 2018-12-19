import { TestBed, inject } from '@angular/core/testing';

import { SubstanceCardsService } from './substance-cards.service';

describe('SubstanceCardsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubstanceCardsService]
    });
  });

  it('should be created', inject([SubstanceCardsService], (service: SubstanceCardsService) => {
    expect(service).toBeTruthy();
  }));
});
