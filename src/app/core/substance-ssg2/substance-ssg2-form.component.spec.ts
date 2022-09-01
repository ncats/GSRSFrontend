import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSsg2FormComponent } from './substance-ssg2-form.component';

describe('SubstanceSsg2FormComponent', () => {
  let component: SubstanceSsg2FormComponent;
  let fixture: ComponentFixture<SubstanceSsg2FormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceSsg2FormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSsg2FormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
