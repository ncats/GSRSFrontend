import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanDeactivateApplicationFormComponent } from './can-deactivate-application-form.component';

describe('CanDeactivateApplicationFormComponent', () => {
  let component: CanDeactivateApplicationFormComponent;
  let fixture: ComponentFixture<CanDeactivateApplicationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanDeactivateApplicationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanDeactivateApplicationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
