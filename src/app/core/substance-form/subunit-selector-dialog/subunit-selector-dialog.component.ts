import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-subunit-selector-dialog',
  templateUrl: './subunit-selector-dialog.component.html',
  styleUrls: ['./subunit-selector-dialog.component.scss']
})
export class SubunitSelectorDialogComponent implements OnInit, AfterViewInit {
  feature: any;
  warning = '';
  disulfides: any;
  siteType: string;
  dataToSend: any;
  constructor(
    public dialogRef: MatDialogRef<SubunitSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any = {}
  ) {dialogRef.disableClose = true;}

  ngOnInit() {
    this.dialogRef.backdropClick().subscribe(fun => {
      if (this.data.card === 'feature') {
        if (this.feature && this.feature.name && this.feature.name !== '') {
          if (this.feature.siteRange) {
            this.dialogRef.close(this.feature);
          } else {
            this.invalidFeatureConfirm();
          }
        } else {
          this.invalidFeatureConfirm();
        }
      } else {
        this.dialogRef.close(this.data.links);
      }
    });
  }

  invalidFeatureConfirm(): void {
    let cn = confirm('Feature is missing information and will not be saved. Close the dialog anyway?');
    if (cn) {
      this.dialogRef.close();
    }
  }

  ngAfterViewInit() {
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
    } else if(this.data.card === 'multi-disulfide'){
      this.dialogRef.close(this.disulfides);
    } else if (this.data.card === 'any') {
      this.dialogRef.close(this.data);
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
    this.data.sentFeature = feature;
  }

  updateDisulfides(sites: any): void {
    this.disulfides = sites;
  }

  updateCardType(type: string) {
    console.log('updating with '+ type);
    this.data.siteType = type;
  }

}

