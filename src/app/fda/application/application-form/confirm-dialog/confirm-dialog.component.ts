import {Component, Inject, OnInit} from '@angular/core';
import {ApplicationService} from '../../service/application.service';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DomSanitizer} from '@angular/platform-browser';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  public dialogRef: MatDialogRef<ConfirmDialogComponent>;

  constructor(
    private applicationService: ApplicationService,
    private sanitizer: DomSanitizer,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) { }

  ngOnInit() {
  }

}
