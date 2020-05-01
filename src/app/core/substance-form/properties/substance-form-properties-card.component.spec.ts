import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormPropertiesComponent } from './substance-form-properties-card.component';

describe('SubstanceFormPropertiesComponent', () => {
  let component: SubstanceFormPropertiesComponent;
  let fixture: ComponentFixture<SubstanceFormPropertiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormPropertiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
