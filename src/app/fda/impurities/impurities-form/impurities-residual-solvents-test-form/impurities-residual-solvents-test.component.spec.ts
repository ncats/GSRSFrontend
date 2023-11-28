import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesResidualSolventsTestComponent } from './impurities-residual-solvents-test.component';

describe('ImpuritiesResidualSolventsTestComponent', () => {
  let component: ImpuritiesResidualSolventsTestComponent;
  let fixture: ComponentFixture<ImpuritiesResidualSolventsTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpuritiesResidualSolventsTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesResidualSolventsTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
