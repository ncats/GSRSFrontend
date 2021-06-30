import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceSsg1ParentComponent } from './substance-ssg1-parent.component';

describe('SubstanceSsg1ParentComponent', () => {
  let component: SubstanceSsg1ParentComponent;
  let fixture: ComponentFixture<SubstanceSsg1ParentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceSsg1ParentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSsg1ParentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
