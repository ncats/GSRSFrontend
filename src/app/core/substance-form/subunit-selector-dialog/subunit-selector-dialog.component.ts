import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-subunit-selector-dialog',
  templateUrl: './subunit-selector-dialog.component.html',
  styleUrls: ['./subunit-selector-dialog.component.scss']
})
export class SubunitSelectorDialogComponent implements OnInit {
  feature: any;
  warning = '';
  constructor(
    public dialogRef: MatDialogRef<SubunitSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {}
  ) {}

  ngOnInit() {
  }

  save(): void {
    if (this.data.card === 'feature') {
      if (this.feature && this.feature.name  && this.feature.name !== '') {
        if (this.feature.siteRange) {
          this.dialogRef.close(this.feature);
        } else {
          this.warning = 'Select site Range(s) before saving';
        }
      } else {
        this.warning = 'Enter a feature name before saving';
      }
    } else {
      this.dialogRef.close(this.data.links);
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }
  updateSites(sites: any): void {
    this.data.links = sites;
  }

  updateFeature(feature: any): void {
    this.feature = feature;
  }
}

