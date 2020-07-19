import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceEditImportDialogComponent } from './substance-edit-import-dialog.component';

describe('SubstanceEditImportDialogComponent', () => {
  let component: SubstanceEditImportDialogComponent;
  let fixture: ComponentFixture<SubstanceEditImportDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SubstanceEditImportDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceEditImportDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
