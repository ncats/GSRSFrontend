import { Component, OnInit, Inject } from '@angular/core';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-copy-disulfide-dialog',
  templateUrl: './copy-disulfide-dialog.component.html',
  styleUrls: ['./copy-disulfide-dialog.component.scss']
})
export class CopyDisulfideDialogComponent implements OnInit {
  unit: any;
  units: any;
  selected: any;
  sequence: string;
  message: string;
  showButtons = true;
  constructor(
    public dialogRef: MatDialogRef<CopyDisulfideDialogComponent>,
    private subService: SubstanceFormService,
    @Inject(MAT_DIALOG_DATA) public data: any = {}
  ) {dialogRef.disableClose = true; }

  ngOnInit() {
    this.unit = this.data.unit;
    this.sequence = this.data.full.sequence;
    this.subService.substanceSubunits.subscribe(resp => {
      this.units = resp;
    });
  }

  select(unit: any) {
    this.selected = unit;
    this.showButtons = false;
  }

  confirm() {
    this.subService.copyDisulfideLinks(this.unit, this.selected);
    this.selected = null;
    this.message = 'Copying...';
    setTimeout(() => {
      this.message = 'Links successfully copied over.';
    }, 500);

  }

  cancel() {
    this.selected = null;
    this.showButtons = true;

  }

}
