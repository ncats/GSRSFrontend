import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologyAssaysetFormComponent } from './invitro-pharmacology-assayset-form.component';

describe('InvitroPharmacologyAssaysetFormComponent', () => {
  let component: InvitroPharmacologyAssaysetFormComponent;
  let fixture: ComponentFixture<InvitroPharmacologyAssaysetFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyAssaysetFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyAssaysetFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
