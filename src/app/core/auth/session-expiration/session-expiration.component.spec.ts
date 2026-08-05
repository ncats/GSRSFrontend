import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SessionExpirationComponent } from './session-expiration.component';

describe('SessionExpirationComponent', () => {
  let component: SessionExpirationComponent;
  let fixture: ComponentFixture<SessionExpirationComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SessionExpirationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SessionExpirationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
