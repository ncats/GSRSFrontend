import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Ssg4mStepViewDialogComponent } from './ssg4m-step-view-dialog.component';

@Component({ selector: 'app-ssg4m-scheme-view', template: '', standalone: true })
class Ssg4mSchemeViewStubComponent {
  @Input() showProcessIndex: any;
  @Input() showSiteIndex: any;
  @Input() showStageIndex: any;
  @Output() tabSelectedIndexOut = new EventEmitter<any>();
}

describe('Ssg4mStepViewDialogComponent', () => {
  let component: Ssg4mStepViewDialogComponent;
  let fixture: ComponentFixture<Ssg4mStepViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ Ssg4mStepViewDialogComponent ],
      providers: [
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v } },
        { provide: MatDialogRef, useValue: { close: () => {} } },
        { provide: MAT_DIALOG_DATA, useValue: { processIndex: 0, siteIndex: 0, stageIndex: 0 } }
      ]
    })
    .overrideComponent(Ssg4mStepViewDialogComponent, {
      set: {
        imports: [MatButtonModule, MatIconModule, Ssg4mSchemeViewStubComponent]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Ssg4mStepViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
