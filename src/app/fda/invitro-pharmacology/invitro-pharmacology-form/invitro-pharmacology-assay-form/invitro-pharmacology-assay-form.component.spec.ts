import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologyAssayFormComponent } from './invitro-pharmacology-assay-form.component';

describe('InvitroPharmacologyAssayFormComponent', () => {
  let component: InvitroPharmacologyAssayFormComponent;
  let fixture: ComponentFixture<InvitroPharmacologyAssayFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyAssayFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyAssayFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
