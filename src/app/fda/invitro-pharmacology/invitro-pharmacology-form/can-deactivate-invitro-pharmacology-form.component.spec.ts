import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanDeactivateInvitroScreeningFormComponent } from './can-deactivate-invitro-screening-form.component';

describe('CanDeactivateProductFormComponent', () => {
  let component: CanDeactivateInvitroScreeningFormComponent;
  let fixture: ComponentFixture<CanDeactivateInvitroScreeningFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanDeactivateInvitroScreeningFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanDeactivateInvitroScreeningFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
