import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanDeactivateImpuritiesFormComponent } from './can-deactivate-impurities-form.component';

describe('CanDeactivateImpuritiesFormComponent', () => {
  let component: CanDeactivateImpuritiesFormComponent;
  let fixture: ComponentFixture<CanDeactivateImpuritiesFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanDeactivateImpuritiesFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanDeactivateImpuritiesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
