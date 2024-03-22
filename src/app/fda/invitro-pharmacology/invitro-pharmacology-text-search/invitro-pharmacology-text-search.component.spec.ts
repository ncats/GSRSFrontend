import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologyTextSearchComponent } from './invitro-pharmacology-text-search.component';

describe('InvitroPharmacologyTextSearchComponent', () => {
  let component: InvitroPharmacologyTextSearchComponent;
  let fixture: ComponentFixture<InvitroPharmacologyTextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyTextSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyTextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
