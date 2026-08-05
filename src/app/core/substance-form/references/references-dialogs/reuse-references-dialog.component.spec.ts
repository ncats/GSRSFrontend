import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReuseReferencesDialogComponent } from './reuse-references-dialog.component';

describe('ReuseReferencesDialogComponent', () => {
  let component: ReuseReferencesDialogComponent;
  let fixture: ComponentFixture<ReuseReferencesDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ReuseReferencesDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReuseReferencesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
