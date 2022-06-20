import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdverseEventTextSearchComponent } from './adverse-event-text-search.component';

describe('AdverseEventTextSearchComponent', () => {
  let component: AdverseEventTextSearchComponent;
  let fixture: ComponentFixture<AdverseEventTextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdverseEventTextSearchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseEventTextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
