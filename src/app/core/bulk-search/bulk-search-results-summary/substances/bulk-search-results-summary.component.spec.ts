import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkSearchResultsSummaryComponent } from './bulk-search-results-summary.component';

describe('BulkSearchResultsSummaryComponent', () => {
  let component: BulkSearchResultsSummaryComponent;
  let fixture: ComponentFixture<BulkSearchResultsSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkSearchResultsSummaryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulkSearchResultsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
