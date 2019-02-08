import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceMixtureSourceComponent } from './substance-mixture-source.component';

describe('SubstanceMixtureSourceComponent', () => {
  let component: SubstanceMixtureSourceComponent;
  let fixture: ComponentFixture<SubstanceMixtureSourceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceMixtureSourceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceMixtureSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
