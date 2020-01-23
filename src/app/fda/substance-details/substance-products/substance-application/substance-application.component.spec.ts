import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceApplicationComponent } from './substance-application.component';

describe('SubstanceApplicationComponent', () => {
  let component: SubstanceApplicationComponent;
  let fixture: ComponentFixture<SubstanceApplicationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceApplicationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceApplicationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
