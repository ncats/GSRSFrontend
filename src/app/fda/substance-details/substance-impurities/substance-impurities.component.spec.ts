import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceImpuritiesComponent } from './substance-impurities.component';

describe('SubstanceImpuritiesComponent', () => {
  let component: SubstanceImpuritiesComponent;
  let fixture: ComponentFixture<SubstanceImpuritiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceImpuritiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceImpuritiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
