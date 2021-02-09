import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesTestFormComponent } from './impurities-test-form.component';

describe('ImpuritiesTestFormComponent', () => {
  let component: ImpuritiesTestFormComponent;
  let fixture: ComponentFixture<ImpuritiesTestFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpuritiesTestFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesTestFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
