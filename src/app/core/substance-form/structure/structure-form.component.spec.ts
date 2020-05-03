import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureFormComponent } from './structure-form.component';

describe('MoietyFormComponent', () => {
  let component: StructureFormComponent;
  let fixture: ComponentFixture<StructureFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
