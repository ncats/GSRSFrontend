import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { finalize, take } from 'rxjs/operators';
import moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadObject } from '@gsrs-core/admin/admin-objects.model';
import { LoadingService } from '@gsrs-core/loading';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
    selector: 'app-data-management',
    templateUrl: './data-management.component.html',
    styleUrls: ['./data-management.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, FormsModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatOptionModule, MatProgressSpinnerModule, MatSelectModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DataManagementComponent implements OnInit {
  uploadForm: FormGroup;
  filename: string;
  fileType: string;
  audit = false;
  processing = false;
  message: string;
  constructor(
    public formBuilder: FormBuilder,
    public adminService: AdminService,
    private router: Router,
    private route: ActivatedRoute,
    private loadingService: LoadingService,
    private cdr: ChangeDetectorRef
  ) { 
   // super(formBuilder, adminService, router, route, loadingService, cdr); 

  }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      file: [''],
      fileType: ['JSON'],
      audit: [false]
    });
    this.fileType = 'JSON';
  }

  onSubmit() {
    if (this.processing) {
      return;
    }
    const file = this.uploadForm.get('file').value;
    if (!(file instanceof File)) {
      this.message = 'Select a file before uploading.';
      return;
    }
    const formData = new FormData();
    this.message = '';
    this.processing = true;
    this.loadingService.setLoading(true);

    formData.append('preserve-audit', this.audit.toString());
    formData.append('file-name', file);
     formData.append('file-type', this.fileType);

    this.adminService.loadData(formData).pipe(take(1), finalize(() => {
      this.processing = false;
      this.loadingService.setLoading(false);
    })).subscribe(response => {
      this.router.navigate(['/monitor/' + response.id]);
   }, (error: HttpErrorResponse) => {
    const body: unknown = error.error;
    let detail = '';
    if (typeof body === 'string' && !body.trim().startsWith('<')) {
      detail = body;
    } else if (body !== null && typeof body === 'object' && 'message' in body
        && typeof body.message === 'string') {
      detail = body.message;
    }
    if (!detail) {
      if (error.status === 401) {
        detail = 'Your session has expired. Sign in again.';
      } else if (error.status === 403) {
        detail = 'You do not have permission to import data.';
      } else if (error.status === 413) {
        detail = 'The file exceeds an upload limit. Split the file or contact your administrator.';
      } else if (error.status === 0) {
        detail = 'The server could not be reached. Check your connection and backend availability.';
      } else {
        detail = 'The server rejected the upload. Check the backend log for this request.';
      }
    }
    this.message = `File could not be uploaded${error.status ? ` (HTTP ${error.status})` : ''}: ${detail}`;
   });
}

  onFileSelect(event): void {
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.filename = file.name;
      this.uploadForm.get('file').setValue(file);
    }
  }

  openInput(): void {
    document.getElementById('fileInput').click();
  }
}
