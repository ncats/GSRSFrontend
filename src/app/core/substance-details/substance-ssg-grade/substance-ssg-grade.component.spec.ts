import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSsgGradeComponent } from './substance-ssg-grade.component';

describe('SubstanceSsgGradeComponent', () => {
  let component: SubstanceSsgGradeComponent;
  let fixture: ComponentFixture<SubstanceSsgGradeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceSsgGradeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSsgGradeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
