import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanDeactivateInvitroAssayFormComponent } from './can-deactivate-invitro-assay-form.component';

describe('CanDeactivateInvitroAssayFormComponent', () => {
  let component: CanDeactivateInvitroAssayFormComponent;
  let fixture: ComponentFixture<CanDeactivateInvitroAssayFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanDeactivateInvitroAssayFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanDeactivateInvitroAssayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
