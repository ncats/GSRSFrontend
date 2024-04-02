import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologyComponent } from './invitro-pharmacology.component';

describe('InvitroPharmaComponent', () => {
  let component: InvitroPharmacologyComponent;
  let fixture: ComponentFixture<InvitroPharmacologyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
