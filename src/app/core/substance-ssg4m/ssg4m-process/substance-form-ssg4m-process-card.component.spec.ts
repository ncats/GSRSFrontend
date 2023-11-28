import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormSsg4mProcessCardComponent } from './substance-form-ssg4m-process-card.component';

describe('SubstanceFormSsg4mProcessCardComponent', () => {
  let component: SubstanceFormSsg4mProcessCardComponent;
  let fixture: ComponentFixture<SubstanceFormSsg4mProcessCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceFormSsg4mProcessCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormSsg4mProcessCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
