import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesResidualSolventFormComponent } from './impurities-residual-solvent-form.component';

describe('ImpuritiesResidualSolventFormComponent', () => {
  let component: ImpuritiesResidualSolventFormComponent;
  let fixture: ComponentFixture<ImpuritiesResidualSolventFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpuritiesResidualSolventFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesResidualSolventFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
