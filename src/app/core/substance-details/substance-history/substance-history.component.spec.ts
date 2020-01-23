import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceHistoryComponent } from './substance-history.component';

describe('SubstanceHistoryComponent', () => {
  let component: SubstanceHistoryComponent;
  let fixture: ComponentFixture<SubstanceHistoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceHistoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
