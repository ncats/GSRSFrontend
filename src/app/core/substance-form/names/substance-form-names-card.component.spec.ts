import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormNamesCardComponent } from './substance-form-names-card.component';

describe('SubstanceFormNamesComponent', () => {
  let component: SubstanceFormNamesCardComponent;
  let fixture: ComponentFixture<SubstanceFormNamesCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormNamesCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormNamesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
