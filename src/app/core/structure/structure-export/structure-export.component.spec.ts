import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureExportComponent } from './structure-export.component';

describe('StructureExportComponent', () => {
  let component: StructureExportComponent;
  let fixture: ComponentFixture<StructureExportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StructureExportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
