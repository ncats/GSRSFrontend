import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesSubstanceComponent } from './impurities-substance.component';

describe('ImpuritiesSubstanceComponent', () => {
  let component: ImpuritiesSubstanceComponent;
  let fixture: ComponentFixture<ImpuritiesSubstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpuritiesSubstanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesSubstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
