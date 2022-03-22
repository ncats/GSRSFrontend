import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg4mStartingMaterialsFormComponent } from './ssg4m-starting-materials-form.component';

describe('Ssg4mStartingMaterialsFormComponent', () => {
  let component: Ssg4mStartingMaterialsFormComponent;
  let fixture: ComponentFixture<Ssg4mStartingMaterialsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mStartingMaterialsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mStartingMaterialsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
