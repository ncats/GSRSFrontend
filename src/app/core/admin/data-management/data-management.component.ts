import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
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
  ) { }

  ngOnInit() {
    this.uploadForm = this.formBuilder.group({
      file: [''],
      fileType: ['JSON'],
      audit: [false]
    });
    this.fileType = 'JSON';
  }

  onSubmit() {
    const formData = new FormData();
    this.loadingService.setLoading(true);

    formData.append('preserve-audit', this.audit.toString());
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
