import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceInvitroPharmacologyComponent } from './substance-invitro-pharmacology.component';

describe('SubstanceInvitroPharmacologyComponent', () => {
  let component: SubstanceInvitroPharmacologyComponent;
  let fixture: ComponentFixture<SubstanceInvitroPharmacologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceInvitroPharmacologyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceInvitroPharmacologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
