import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormOverviewComponent } from './substance-form-overview.component';

describe('SubstanceFormOverviewComponent', () => {
  let component: SubstanceFormOverviewComponent;
  let fixture: ComponentFixture<SubstanceFormOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
