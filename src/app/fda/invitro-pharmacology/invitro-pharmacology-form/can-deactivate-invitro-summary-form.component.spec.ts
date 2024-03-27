import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanDeactivateInvitroSummaryFormComponent } from './can-deactivate-invitro-summary-form.component';

describe('CanDeactivateInvitroSummaryFormComponent', () => {
  let component: CanDeactivateInvitroSummaryFormComponent;
  let fixture: ComponentFixture<CanDeactivateInvitroSummaryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanDeactivateInvitroSummaryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanDeactivateInvitroSummaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
