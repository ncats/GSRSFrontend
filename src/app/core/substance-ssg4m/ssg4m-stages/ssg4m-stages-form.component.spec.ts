import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg4mStagesFormComponent } from './ssg4m-stages-form.component';

describe('Ssg4mStagesComponent', () => {
  let component: Ssg4mStagesFormComponent;
  let fixture: ComponentFixture<Ssg4mStagesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mStagesFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mStagesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
