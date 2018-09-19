import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainNotificationComponent } from './main-notification.component';
import { MainNotificationService } from '../main-notification.service';
import { Subject } from '../../../../node_modules/rxjs';

describe('MainNotificationComponent', () => {
  let component: MainNotificationComponent;
  let fixture: ComponentFixture<MainNotificationComponent>;
  let notificationServiceStub: Partial<MainNotificationService>;

  beforeEach(async(() => {

    notificationServiceStub = {
      notificationEvent: new Subject()
    };

    TestBed.configureTestingModule({
      declarations: [ MainNotificationComponent ],
      providers: [
        { provide: MainNotificationService, useValue: notificationServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainNotificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
