import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormMoietiesComponent } from './substance-form-moieties.component';

describe('SubstanceFormMoietiesComponent', () => {
  let component: SubstanceFormMoietiesComponent;
  let fixture: ComponentFixture<SubstanceFormMoietiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormMoietiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormMoietiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
