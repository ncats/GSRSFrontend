import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceRelationshipsComponent } from './substance-relationships.component';

describe('SubstanceRelationshipsComponent', () => {
  let component: SubstanceRelationshipsComponent;
  let fixture: ComponentFixture<SubstanceRelationshipsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceRelationshipsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceRelationshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
