import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSummaryCardComponent } from './substance-summary-card.component';

describe('SubstanceSummaryCardComponent', () => {
  let component: SubstanceSummaryCardComponent;
  let fixture: ComponentFixture<SubstanceSummaryCardComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceSummaryCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSummaryCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
