import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { SubstanceMixtureParentComponent } from './substance-mixture-parent.component';

describe('SubstanceMixtureParentComponent', () => {
  let component: SubstanceMixtureParentComponent;
  let fixture: ComponentFixture<SubstanceMixtureParentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ RouterTestingModule, SubstanceMixtureParentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceMixtureParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
