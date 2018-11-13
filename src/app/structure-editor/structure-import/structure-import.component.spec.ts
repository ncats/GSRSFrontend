import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureImportComponent } from './structure-import.component';

describe('StructureImportComponent', () => {
  let component: StructureImportComponent;
  let fixture: ComponentFixture<StructureImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
