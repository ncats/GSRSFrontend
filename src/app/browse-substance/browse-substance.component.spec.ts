import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowseSubstanceComponent } from './browse-substance.component';

describe('BrowseSubstanceComponent', () => {
  let component: BrowseSubstanceComponent;
  let fixture: ComponentFixture<BrowseSubstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrowseSubstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrowseSubstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
