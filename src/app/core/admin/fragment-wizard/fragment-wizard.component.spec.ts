import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FragmentWizardComponent } from './fragment-wizard.component';

describe('FragmentWizardComponent', () => {
  let component: FragmentWizardComponent;
  let fixture: ComponentFixture<FragmentWizardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FragmentWizardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FragmentWizardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
