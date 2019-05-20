import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceAuditInfoComponent } from './substance-audit-info.component';

describe('SubstanceAuditInfoComponent', () => {
  let component: SubstanceAuditInfoComponent;
  let fixture: ComponentFixture<SubstanceAuditInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceAuditInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceAuditInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
