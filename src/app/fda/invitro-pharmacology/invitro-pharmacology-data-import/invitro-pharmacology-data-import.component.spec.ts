import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologyDataImportComponent } from './invitro-pharmacology-data-import.component';

describe('InvitroPharmacologyDataImportComponent', () => {
  let component: InvitroPharmacologyDataImportComponent;
  let fixture: ComponentFixture<InvitroPharmacologyDataImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyDataImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyDataImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
