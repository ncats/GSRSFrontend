import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg4mProcessFormComponent } from './ssg4m-process-form.component';

describe('SubstanceSsg4ManufactureFormComponent', () => {
  let component: Ssg4mProcessFormComponent;
  let fixture: ComponentFixture<Ssg4mProcessFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Ssg4mProcessFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mProcessFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
