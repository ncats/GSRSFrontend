import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesUnspecifiedFormComponent } from './impurities-unspecified-form.component';

describe('ImpuritiesUnspecifiedFormComponent', () => {
  let component: ImpuritiesUnspecifiedFormComponent;
  let fixture: ComponentFixture<ImpuritiesUnspecifiedFormComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpuritiesUnspecifiedFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesUnspecifiedFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
