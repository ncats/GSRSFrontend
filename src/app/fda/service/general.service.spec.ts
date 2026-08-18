import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '@gsrs-core/config';

import { GeneralService } from './general.service';

describe('GeneralService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [ HttpClientTestingModule ],
    providers: [
      GeneralService,
      { provide: ConfigService, useValue: { configData: {} } }
    ]
  }));

  it('should be created', () => {
    const service: GeneralService = TestBed.inject(GeneralService);
    expect(service).toBeTruthy();
  });
});
