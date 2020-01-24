import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormRelationshipsComponent } from './substance-form-relationships.component';

describe('SubstanceFormRelationshipsComponent', () => {
  let component: SubstanceFormRelationshipsComponent;
  let fixture: ComponentFixture<SubstanceFormRelationshipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormRelationshipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormRelationshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
