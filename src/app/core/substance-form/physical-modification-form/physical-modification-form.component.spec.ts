import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhysicalModificationFormComponent } from './physical-modification-form.component';

describe('PhysicalModificationFormComponent', () => {
  let component: PhysicalModificationFormComponent;
  let fixture: ComponentFixture<PhysicalModificationFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhysicalModificationFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhysicalModificationFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
