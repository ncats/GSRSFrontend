import { TestBed } from '@angular/core/testing';

import { WildcardService } from './wildcard.service';

describe('WildcardService', () => {
  let service: WildcardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WildcardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
