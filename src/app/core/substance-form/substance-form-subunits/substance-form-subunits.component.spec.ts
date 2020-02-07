import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormSubunitsComponent } from './substance-form-subunits.component';

describe('SubstanceFormSubunitsComponent', () => {
  let component: SubstanceFormSubunitsComponent;
  let fixture: ComponentFixture<SubstanceFormSubunitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormSubunitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormSubunitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
