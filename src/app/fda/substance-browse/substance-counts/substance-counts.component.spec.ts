import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceCountsComponent } from './substance-counts.component';

describe('SubstanceCountsComponent', () => {
  let component: SubstanceCountsComponent;
  let fixture: ComponentFixture<SubstanceCountsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceCountsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceCountsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
