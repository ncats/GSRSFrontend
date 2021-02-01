import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImpuritiesFormComponent } from './impurities-form.component';

describe('ImpuritiesFormComponent', () => {
  let component: ImpuritiesFormComponent;
  let fixture: ComponentFixture<ImpuritiesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImpuritiesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImpuritiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
