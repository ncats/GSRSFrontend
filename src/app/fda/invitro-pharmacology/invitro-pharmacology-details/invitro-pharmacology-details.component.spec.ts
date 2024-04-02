import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologyDetailsComponent } from './invitro-pharmacology-details.component';

describe('InvitroPharmacologyDetailsComponent', () => {
  let component: InvitroPharmacologyDetailsComponent;
  let fixture: ComponentFixture<InvitroPharmacologyDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
