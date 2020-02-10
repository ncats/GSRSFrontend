import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormPhysicalModificationsComponent } from './substance-form-physical-modifications.component';

describe('SubstanceFormPhysicalModificationsComponent', () => {
  let component: SubstanceFormPhysicalModificationsComponent;
  let fixture: ComponentFixture<SubstanceFormPhysicalModificationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormPhysicalModificationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormPhysicalModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
