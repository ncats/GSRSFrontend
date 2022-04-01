import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg4mProcessingMaterialsFormComponent } from './ssg4m-processing-materials-form.component';

describe('Ssg4mProcessingMaterialsFormComponent', () => {
  let component: Ssg4mProcessingMaterialsFormComponent;
  let fixture: ComponentFixture<Ssg4mProcessingMaterialsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg4mProcessingMaterialsFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mProcessingMaterialsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
