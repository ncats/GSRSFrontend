import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreviousReferencesDialogComponent } from './previous-references-dialog.component';

describe('PreviousReferencesDialogComponent', () => {
  let component: PreviousReferencesDialogComponent;
  let fixture: ComponentFixture<PreviousReferencesDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreviousReferencesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousReferencesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
