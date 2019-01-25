import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceMonomersComponent } from './substance-monomers.component';

describe('SubstanceMonomersComponent', () => {
  let component: SubstanceMonomersComponent;
  let fixture: ComponentFixture<SubstanceMonomersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceMonomersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceMonomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
