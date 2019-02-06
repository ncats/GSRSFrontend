import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceNaSugarsComponent } from './substance-na-sugars.component';

describe('SubstanceNaSugarsComponent', () => {
  let component: SubstanceNaSugarsComponent;
  let fixture: ComponentFixture<SubstanceNaSugarsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceNaSugarsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceNaSugarsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
