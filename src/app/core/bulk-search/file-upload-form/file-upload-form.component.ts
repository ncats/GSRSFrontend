import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingService } from '@gsrs-core/loading';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
    selector: 'app-file-upload-form',
    templateUrl: './file-upload-form.component.html',
    styleUrls: ['./file-upload-form.component.scss'],
    standalone: true,
    imports: [
      CommonModule,
      FormsModule,
      ReactiveFormsModule,
      MatButtonModule,
      MatFormFieldModule,
      MatSelectModule,
      MatProgressSpinnerModule
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FileUploadFormComponent implements OnInit {
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
  ) { }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      file: [''],
      fileType: ['TEXT'],
      audit: [false]
    });
    this.fileType = 'TEXT';
  }

  onSubmit() {
    const formData = new FormData();
    this.loadingService.setLoading(true);
    formData.append('file-name', this.uploadForm.get('file').value);
    formData.append('file-type', this.fileType);

    this.adminService.loadData(formData).pipe(take(1)).subscribe(response => {
      this.loadingService.setLoading(false);
      this.router.navigate(['/monitor/' + response.id]);
   }, error => {
    this.message = 'File could not be uploaded';
    this.loadingService.setLoading(false);
    this.cdr.markForCheck();
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
