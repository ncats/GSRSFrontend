import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesCompareComponent } from './impurities-compare.component';

describe('ImpuritiesCompareComponent', () => {
  let component: ImpuritiesCompareComponent;
  let fixture: ComponentFixture<ImpuritiesCompareComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImpuritiesCompareComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImpuritiesCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
