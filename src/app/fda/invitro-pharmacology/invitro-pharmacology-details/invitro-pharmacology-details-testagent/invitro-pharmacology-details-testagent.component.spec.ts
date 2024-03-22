import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InvitroPharmacologyDetailsTestagentComponent } from './invitro-pharmacology-details-testagent.component';

describe('InvitroPharmacologyDetailsTestagentComponent', () => {
  let component: InvitroPharmacologyDetailsTestagentComponent;
  let fixture: ComponentFixture<InvitroPharmacologyDetailsTestagentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyDetailsTestagentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyDetailsTestagentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
