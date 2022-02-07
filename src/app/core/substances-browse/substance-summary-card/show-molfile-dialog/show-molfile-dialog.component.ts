import { Component, OnInit, Inject } from '@angular/core';
import { SubstanceHistoryDialogComponent } from '@gsrs-core/substance-history-dialog/substance-history-dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { StructureService } from '@gsrs-core/structure';

@Component({
  selector: 'app-show-molfile-dialog',
  templateUrl: './show-molfile-dialog.component.html',
  styleUrls: ['./show-molfile-dialog.component.scss']
})
export class ShowMolfileDialogComponent implements OnInit {
molfile: string;
  constructor(
    public dialogRef: MatDialogRef<SubstanceHistoryDialogComponent>,
    private structureService: StructureService,
    @Inject(MAT_DIALOG_DATA) public data: any

  ) {
  }

  ngOnInit() {

    this.structureService.getMolfile(this.data.uuid).subscribe( response => {
      this.molfile = response;


  });
}

}
