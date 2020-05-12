import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormPhysicalModificationsCardComponent } from './substance-form-physical-modifications-card.component';

describe('SubstanceFormPhysicalModificationsComponent', () => {
  let component: SubstanceFormPhysicalModificationsCardComponent;
  let fixture: ComponentFixture<SubstanceFormPhysicalModificationsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormPhysicalModificationsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormPhysicalModificationsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
