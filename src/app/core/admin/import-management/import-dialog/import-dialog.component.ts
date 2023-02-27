import { Component, OnInit, Inject } from '@angular/core';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { UtilsService } from '@gsrs-core/utils';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.scss']
})
export class ImportDialogComponent implements OnInit {
  settingsActive: any;
  constructor(
    public cvService: ControlledVocabularyService,
    private utilsService: UtilsService,
    public dialogRef: MatDialogRef<ImportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.settingsActive = data.settingsActive;
 
  }

  ngOnInit(): void {
  }

  close(send?: string) {
    if (send) {
      this.dialogRef.close(this.settingsActive);
    } else {
      this.dialogRef.close();
    }
  }

}
