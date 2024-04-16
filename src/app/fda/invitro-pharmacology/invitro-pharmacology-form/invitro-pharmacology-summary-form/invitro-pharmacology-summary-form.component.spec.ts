import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologySummaryFormComponent } from './invitro-pharmacology-summary-form.component';

describe('InvitroPharmacologySummaryFormComponent', () => {
  let component: InvitroPharmacologySummaryFormComponent;
  let fixture: ComponentFixture<InvitroPharmacologySummaryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologySummaryFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologySummaryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
