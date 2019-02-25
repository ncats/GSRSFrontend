import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceGlycosylationComponent } from './substance-glycosylation.component';

describe('SubstanceGlycosylationComponent', () => {
  let component: SubstanceGlycosylationComponent;
  let fixture: ComponentFixture<SubstanceGlycosylationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceGlycosylationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceGlycosylationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
