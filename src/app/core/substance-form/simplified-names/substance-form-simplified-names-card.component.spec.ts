import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormSimplifiedNamesCardComponent } from './substance-form-simplified-names-card.component';

describe('SubstanceFormNamesComponent', () => {
  let component: SubstanceFormSimplifiedNamesCardComponent;
  let fixture: ComponentFixture<SubstanceFormSimplifiedNamesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormSimplifiedNamesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormSimplifiedNamesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
