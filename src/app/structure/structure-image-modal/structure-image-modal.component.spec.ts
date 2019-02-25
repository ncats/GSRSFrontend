import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureImageModalComponent } from './structure-image-modal.component';

describe('StructureImageModalComponent', () => {
  let component: StructureImageModalComponent;
  let fixture: ComponentFixture<StructureImageModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureImageModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureImageModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
