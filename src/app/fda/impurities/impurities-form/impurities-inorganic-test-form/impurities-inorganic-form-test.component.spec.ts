import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesInorganicFormTestComponent } from './impurities-inorganic-form-test.component';

describe('ImpuritiesInorganicFormTestComponent', () => {
  let component: ImpuritiesInorganicFormTestComponent;
  let fixture: ComponentFixture<ImpuritiesInorganicFormTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImpuritiesInorganicFormTestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesInorganicFormTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
