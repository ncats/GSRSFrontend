import { TestBed, inject } from '@angular/core/testing';

import { SubstanceSsg4mService } from './substance-ssg4m-form.service';

describe('SubstanceSsg4mService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SubstanceSsg4mService]
    });
  });

  it('should be created', inject([SubstanceSsg4mService], (service: SubstanceSsg4mService) => {
    expect(service).toBeTruthy();
  }));
});
