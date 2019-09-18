import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormGlycosylationComponent } from './substance-form-glycosylation.component';

describe('SubstanceFormGlycosylationComponent', () => {
  let component: SubstanceFormGlycosylationComponent;
  let fixture: ComponentFixture<SubstanceFormGlycosylationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormGlycosylationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormGlycosylationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
