import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormNamesComponent } from './substance-form-names.component';

describe('SubstanceFormNamesComponent', () => {
  let component: SubstanceFormNamesComponent;
  let fixture: ComponentFixture<SubstanceFormNamesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormNamesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
