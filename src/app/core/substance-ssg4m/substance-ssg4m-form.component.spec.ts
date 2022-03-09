import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSsg4ManufactureFormComponent } from './substance-ssg4m-form.component';

describe('SubstanceSsg4ManufactureFormComponent', () => {
  let component: SubstanceSsg4ManufactureFormComponent;
  let fixture: ComponentFixture<SubstanceSsg4ManufactureFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceSsg4ManufactureFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSsg4ManufactureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
