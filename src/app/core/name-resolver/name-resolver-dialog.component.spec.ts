import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { vi } from 'vitest';
import { MatButtonModule } from '@angular/material/button';

import { NameResolverDialogComponent } from './name-resolver-dialog.component';

@Component({ selector: 'app-name-resolver', template: '', standalone: true })
class NameResolverStubComponent {
  @Input() startingName: any;
  @Output() structureSelected = new EventEmitter<any>();
}

describe('NameResolverDialogComponent', () => {
  let component: NameResolverDialogComponent;
  let fixture: ComponentFixture<NameResolverDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NameResolverDialogComponent ],
      providers: [
        { provide: MatDialogRef, useValue: { close: vi.fn() } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: vi.fn(), sendPageView: vi.fn() } }
      ]
    })
    .overrideComponent(NameResolverDialogComponent, {
      set: {
        imports: [MatDialogModule, MatButtonModule, NameResolverStubComponent]
      }
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NameResolverDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
