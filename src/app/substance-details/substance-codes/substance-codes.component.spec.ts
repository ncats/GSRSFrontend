import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceCodesComponent } from './substance-codes.component';

describe('SubstanceCodesComponent', () => {
  let component: SubstanceCodesComponent;
  let fixture: ComponentFixture<SubstanceCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceCodesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
