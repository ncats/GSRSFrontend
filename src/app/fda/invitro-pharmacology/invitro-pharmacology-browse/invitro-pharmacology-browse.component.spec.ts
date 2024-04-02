import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologyBrowseComponent } from './invitro-pharmacology-browse.component';

describe('InvitroPharmacologyBrowseComponent', () => {
  let component: InvitroPharmacologyBrowseComponent;
  let fixture: ComponentFixture<InvitroPharmacologyBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyBrowseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
