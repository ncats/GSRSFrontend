import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceInvitroPharmacologySummaryComponent } from './substance-invitro-pharmacology-summary.component';

describe('SubstanceInvitroPharmacologySummaryComponent', () => {
  let component: SubstanceInvitroPharmacologySummaryComponent;
  let fixture: ComponentFixture<SubstanceInvitroPharmacologySummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceInvitroPharmacologySummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceInvitroPharmacologySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
