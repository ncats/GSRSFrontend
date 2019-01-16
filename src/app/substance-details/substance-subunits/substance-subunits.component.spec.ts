import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSubunitsComponent } from './substance-subunits.component';

describe('SubstanceSubunitsComponent', () => {
  let component: SubstanceSubunitsComponent;
  let fixture: ComponentFixture<SubstanceSubunitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceSubunitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSubunitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
