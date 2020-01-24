import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormComponent } from './substance-form.component';

describe('SubstanceFormComponent', () => {
  let component: SubstanceFormComponent;
  let fixture: ComponentFixture<SubstanceFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
