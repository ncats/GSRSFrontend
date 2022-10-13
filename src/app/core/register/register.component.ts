import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  regForm = new FormGroup({
    username: new FormControl('', Validators.required),
    email: new FormControl('', Validators.required)
  });

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<RegisterComponent>
  ) { }

  ngOnInit() {
    console.log('Register component init.')
    this.regForm.controls.email.markAsTouched();
    // this.regForm = this.fb.group({
    //   username: '',
    //   email: ''
    // })
  }

  register() {
    this.dialogRef.close(this.regForm.value);
  }

  exit() {
    this.dialogRef.close();
  }

}
