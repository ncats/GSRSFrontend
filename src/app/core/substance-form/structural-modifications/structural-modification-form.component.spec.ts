import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructuralModificationFormComponent } from './structural-modification-form.component';

describe('StructuralModificationFormComponent', () => {
  let component: StructuralModificationFormComponent;
  let fixture: ComponentFixture<StructuralModificationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructuralModificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructuralModificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
