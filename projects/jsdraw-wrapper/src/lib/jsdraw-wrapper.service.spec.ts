import { TestBed, inject } from '@angular/core/testing';

import { JsdrawWrapperService } from './jsdraw-wrapper.service';

describe('JsdrawWrapperService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsdrawWrapperService]
    });
  });

  it('should be created', inject([JsdrawWrapperService], (service: JsdrawWrapperService) => {
    expect(service).toBeTruthy();
  }));
});
