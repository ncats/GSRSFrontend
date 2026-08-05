import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { HighlightedSearchActionComponent } from './highlighted-search-action.component';

describe('HighlightedSearchActionComponent', () => {
  let component: HighlightedSearchActionComponent;
  let fixture: ComponentFixture<HighlightedSearchActionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ HighlightedSearchActionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HighlightedSearchActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
