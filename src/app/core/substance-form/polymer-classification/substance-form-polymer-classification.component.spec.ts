import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormPolymerClassificationComponent } from './substance-form-polymer-classification.component';

describe('SubstanceFormPolymerClassificationComponent', () => {
  let component: SubstanceFormPolymerClassificationComponent;
  let fixture: ComponentFixture<SubstanceFormPolymerClassificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormPolymerClassificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormPolymerClassificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
