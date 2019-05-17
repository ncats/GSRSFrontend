import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSearchFormComponent } from './substance-search-form.component';

describe('SubstanceSearchFormComponent', () => {
  let component: SubstanceSearchFormComponent;
  let fixture: ComponentFixture<SubstanceSearchFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceSearchFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSearchFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
