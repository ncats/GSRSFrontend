import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceNamesComponent } from './substance-names.component';

describe('SubstanceNamesComponent', () => {
  let component: SubstanceNamesComponent;
  let fixture: ComponentFixture<SubstanceNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
