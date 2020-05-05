import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSearchSelectorComponent } from './substance-search-selector.component';

describe('SubstanceSearchSelectorComponent', () => {
  let component: SubstanceSearchSelectorComponent;
  let fixture: ComponentFixture<SubstanceSearchSelectorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceSearchSelectorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSearchSelectorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
