import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
    selector: 'app-copy-disulfide-dialog',
    templateUrl: './copy-disulfide-dialog.component.html',
    styleUrls: ['./copy-disulfide-dialog.component.scss'],
    standalone: true,
    imports: [MatDialogModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
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
    private cdr: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any = {}
  ) {
dialogRef.disableClose = true; 
}

  ngOnInit() {
    this.unit = this.data.unit;
    this.sequence = this.data.full.sequence;
    this.subService.substanceSubunits.subscribe(resp => {
      this.units = resp;
      this.cdr.markForCheck();
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
      this.cdr.markForCheck();
    }, 500);

  }

  cancel() {
    this.selected = null;
    this.showButtons = true;

  }

}
