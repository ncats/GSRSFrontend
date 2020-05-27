import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuidedSearchComponent } from './guided-search.component';

describe('GuidedSearchComponent', () => {
  let component: GuidedSearchComponent;
  let fixture: ComponentFixture<GuidedSearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuidedSearchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuidedSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
