import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationshipFormComponent } from './relationship-form.component';

describe('RelationshipFormComponent', () => {
  let component: RelationshipFormComponent;
  let fixture: ComponentFixture<RelationshipFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationshipFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationshipFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
