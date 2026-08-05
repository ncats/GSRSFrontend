import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceOverviewComponent } from './substance-overview.component';

describe('SubstanceOverviewComponent', () => {
  let component: SubstanceOverviewComponent;
  let fixture: ComponentFixture<SubstanceOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
