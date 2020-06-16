import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsgParentSubstanceFormComponent } from './ssg-parent-substance-form.component';

describe('SsgParentSubstanceFormComponent', () => {
  let component: SsgParentSubstanceFormComponent;
  let fixture: ComponentFixture<SsgParentSubstanceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsgParentSubstanceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsgParentSubstanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
