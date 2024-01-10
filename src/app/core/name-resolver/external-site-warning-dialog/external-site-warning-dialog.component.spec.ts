import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalSiteWarningDialogComponent } from './external-site-warning-dialog.component';

describe('ExternalSiteWarningDialogComponent', () => {
  let component: ExternalSiteWarningDialogComponent;
  let fixture: ComponentFixture<ExternalSiteWarningDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalSiteWarningDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalSiteWarningDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
