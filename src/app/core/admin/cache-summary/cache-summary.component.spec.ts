import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CacheSummaryComponent } from './cache-summary.component';

describe('CacheSummaryComponent', () => {
  let component: CacheSummaryComponent;
  let fixture: ComponentFixture<CacheSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CacheSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CacheSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
