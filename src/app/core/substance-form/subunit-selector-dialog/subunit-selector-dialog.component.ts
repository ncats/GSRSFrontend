import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Site, SubstanceReference} from '@gsrs-core/substance';
import {RefernceFormDialogComponent} from '@gsrs-core/substance-form/references-dialogs/refernce-form-dialog.component';

@Component({
  selector: 'app-subunit-selector-dialog',
  templateUrl: './subunit-selector-dialog.component.html',
  styleUrls: ['./subunit-selector-dialog.component.scss']
})
export class SubunitSelectorDialogComponent implements OnInit {

  constructor(
    public dialogRef: MatDialogRef<SubunitSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {}
  ) {}

  ngOnInit() {
    console.log(this.data);
    console.log(this.data.links);
  }

  save(): void {
    console.log('saving');
    this.dialogRef.close(this.data.links);
    console.log(this.data.links);
  }

  cancel(): void {
    console.log('cancel'
    );
    this.dialogRef.close();
  }
  updateSites(sites: any): void {
    this.data.links = sites;
    console.log('updateSites');
    console.log(sites);
  }
}

