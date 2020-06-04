import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSsgParentSubstanceComponent } from './substance-ssg-parent-substance.component';

describe('SubstanceSsgParentSubstanceComponent', () => {
  let component: SubstanceSsgParentSubstanceComponent;
  let fixture: ComponentFixture<SubstanceSsgParentSubstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceSsgParentSubstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSsgParentSubstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
