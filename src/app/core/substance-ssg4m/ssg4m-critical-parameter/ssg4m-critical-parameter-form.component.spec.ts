import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg4mCriticalParameterFormComponent } from './ssg4m-critical-parameter-form.component';

describe('Ssg4mCriticalParameterComponent', () => {
  let component: Ssg4mCriticalParameterFormComponent;
  let fixture: ComponentFixture<Ssg4mCriticalParameterFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mCriticalParameterFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mCriticalParameterFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
