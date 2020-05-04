import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormRelationshipsCardComponent } from './substance-form-relationships-card.component';

describe('SubstanceFormRelationshipsComponent', () => {
  let component: SubstanceFormRelationshipsCardComponent;
  let fixture: ComponentFixture<SubstanceFormRelationshipsCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceFormRelationshipsCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormRelationshipsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
