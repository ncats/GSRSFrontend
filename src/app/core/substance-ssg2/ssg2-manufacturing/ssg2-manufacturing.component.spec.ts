import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ssg2ManufacturingComponent } from './ssg2-manufacturing.component';

describe('Ssg2ManufacturingComponent', () => {
  let component: Ssg2ManufacturingComponent;
  let fixture: ComponentFixture<Ssg2ManufacturingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Ssg2ManufacturingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg2ManufacturingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
