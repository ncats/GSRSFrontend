import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-pwd-recovery',
  templateUrl: './pwd-recovery.component.html',
  styleUrls: ['./pwd-recovery.component.scss']
})
export class PwdRecoveryComponent implements OnInit {

  pwdForm = new FormGroup({
    email: new FormControl('', Validators.required)
  });

  constructor(
    private dialogRef: MatDialogRef<PwdRecoveryComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: string
  ) { 
    console.log('data:::', data);
  }

  ngOnInit(): void {
  }

  exit() {
    this.dialogRef.close();
  }

  pwdRecovery() {
    this.exit();
  }

}
