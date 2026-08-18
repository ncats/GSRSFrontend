import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { LoadingService } from '@gsrs-core/loading';
import { vi } from 'vitest';

import { FileUploadFormComponent } from './file-upload-form.component';

describe('FileUploadFormComponent', () => {
  let component: FileUploadFormComponent;
  let fixture: ComponentFixture<FileUploadFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // template binds formControlName + ngModel on a real <mat-select>, so it needs a
      // real ControlValueAccessor - NO_ERRORS_SCHEMA doesn't substitute for that.
      imports: [ ReactiveFormsModule, FormsModule, MatSelectModule, NoopAnimationsModule ],
      declarations: [ FileUploadFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AdminService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: ActivatedRoute, useValue: { params: of({}) } },
        { provide: LoadingService, useValue: { setLoading: vi.fn() } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FileUploadFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
