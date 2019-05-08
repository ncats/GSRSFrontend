import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceAddEditComponent } from './substance-add-edit.component';

describe('SubstanceAddEditComponent', () => {
  let component: SubstanceAddEditComponent;
  let fixture: ComponentFixture<SubstanceAddEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceAddEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceAddEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
