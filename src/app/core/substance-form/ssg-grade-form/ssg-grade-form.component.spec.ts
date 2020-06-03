import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SsgGradeFormComponent } from './ssg-grade-form.component';

describe('SsgGradeFormComponent', () => {
  let component: SsgGradeFormComponent;
  let fixture: ComponentFixture<SsgGradeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SsgGradeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SsgGradeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
