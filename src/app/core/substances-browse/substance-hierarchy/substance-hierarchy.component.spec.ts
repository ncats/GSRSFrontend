import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceHierarchyComponent } from './substance-hierarchy.component';

describe('SubstanceHierarchyComponent', () => {
  let component: SubstanceHierarchyComponent;
  let fixture: ComponentFixture<SubstanceHierarchyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceHierarchyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
