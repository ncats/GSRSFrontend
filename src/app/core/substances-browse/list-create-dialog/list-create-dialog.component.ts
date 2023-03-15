import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-list-create-dialog',
  templateUrl: './list-create-dialog.component.html',
  styleUrls: ['./list-create-dialog.component.scss']
})
export class ListCreateDialogComponent implements OnInit {
  message: string;
  constructor( @Inject(MAT_DIALOG_DATA) public data: any
) {
  this.message = data.message;
}

  ngOnInit(): void {
  }

}
