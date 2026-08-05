import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationDetailsBaseComponent } from './application-details-base.component';

describe('ApplicationDetailsBaseComponent', () => {
  let component: ApplicationDetailsBaseComponent;
  let fixture: ComponentFixture<ApplicationDetailsBaseComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationDetailsBaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationDetailsBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
