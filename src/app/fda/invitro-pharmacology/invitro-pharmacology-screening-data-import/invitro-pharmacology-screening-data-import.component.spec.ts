import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologyScreeningDataImportComponent } from './invitro-pharmacology-screening-data-import.component';

describe('InvitroPharmacologyScreeningDataImportComponent', () => {
  let component: InvitroPharmacologyScreeningDataImportComponent;
  let fixture: ComponentFixture<InvitroPharmacologyScreeningDataImportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyScreeningDataImportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyScreeningDataImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
