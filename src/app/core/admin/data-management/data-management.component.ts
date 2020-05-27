import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { take } from 'rxjs/operators';
import * as moment from 'moment';
import { Router, ActivatedRoute } from '@angular/router';
import { UploadObject } from '@gsrs-core/admin/admin-objects.model';
import { LoadingService } from '@gsrs-core/loading';

@Component({
  selector: 'app-data-management',
  templateUrl: './data-management.component.html',
  styleUrls: ['./data-management.component.scss']
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
    private loadingService: LoadingService

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
     formData.forEach((value, key) => {
      console.log(key + ' ' + value + '');
    });
    this.adminService.loadData(formData).pipe(take(1)).subscribe(response => {
      this.loadingService.setLoading(false);

      this.router.navigate(['/monitor/' + response.id]);
   }, error => {this.message = 'File could not be uploaded';
   this.loadingService.setLoading(false);

   });
}

  onFileSelect(event): void {
    console.log(event);
    if (event.target.files.length > 0) {
      const file = event.target.files[0];
      this.filename = file.name;
      this.uploadForm.get('file').setValue(file);
      console.log(file);
      console.log(file.name);
    }
  }

  openInput(): void {
    document.getElementById('fileInput').click();
  }
}
