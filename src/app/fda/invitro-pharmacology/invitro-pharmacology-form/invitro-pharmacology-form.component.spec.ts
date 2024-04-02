import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologyFormComponent } from './invitro-pharmacology-form.component';

describe('InvitroPharmacologyFormComponent', () => {
  let component: InvitroPharmacologyFormComponent;
  let fixture: ComponentFixture<InvitroPharmacologyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
