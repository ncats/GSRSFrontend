import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg4mResultingMaterialsFormComponent } from './ssg4m-resulting-materials-form.component';

describe('Ssg4mResultingMaterialsFormComponent', () => {
  let component: Ssg4mResultingMaterialsFormComponent;
  let fixture: ComponentFixture<Ssg4mResultingMaterialsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mResultingMaterialsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mResultingMaterialsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
