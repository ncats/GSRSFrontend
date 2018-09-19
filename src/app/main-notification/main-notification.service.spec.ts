import { TestBed, inject } from '@angular/core/testing';

import { MainNotificationService } from './main-notification.service';

describe('MainNotificationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MainNotificationService]
    });
  });

  it('should be created', inject([MainNotificationService], (service: MainNotificationService) => {
    expect(service).toBeTruthy();
  }));
});
