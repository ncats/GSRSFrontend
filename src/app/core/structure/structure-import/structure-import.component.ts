import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { StructureService } from '../structure.service';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { FileSelectDirective } from '@gsrs-core/file-select/file-select.directive';

@Component({
    selector: 'app-structure-import',
    templateUrl: './structure-import.component.html',
    styleUrls: ['./structure-import.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, MatProgressBarModule, MatButtonModule, FileSelectDirective],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StructureImportComponent implements OnInit {
  isLoading = false;
  importTextControl = new FormControl();
  messageClass = 'error';
  message: string;

  constructor(
    public dialogRef: MatDialogRef<StructureImportComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public gaService: GoogleAnalyticsService,
    private structureService: StructureService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit() {
  }

  importStructure(): void {
    this.message = null;
    if (this.importTextControl.value) {
      this.isLoading = true;
      this.structureService.interpretStructure(this.importTextControl.value).subscribe(response => {
        this.isLoading = false;
        if (response && response.structure && response.structure.molfile && response.structure.smiles) {
          this.gaService.sendEvent('structureImport', 'button:import', 'file imported');
          this.dialogRef.close(response);
        } else {
          this.messageClass = 'error';
          this.message = 'Please enter a valid v2000 molfile or smiles';
          this.gaService.sendException('wrong structure data imported');
        }
        this.cdr.markForCheck();

      }, error => {
        this.isLoading = false;
        this.messageClass = 'error';
        this.message = 'There was an error importing your structure. Please refresh and try again.';
        this.gaService.sendException('postSubstanceStructure error');
        this.cdr.markForCheck();
      });
    } else {
      this.messageClass = 'error';
      this.message = 'You have not entered anything to import';
      this.gaService.sendException('no structure data entered for import');
    }
  }

  fileBrowse() {
    this.gaService.sendEvent('structureImport', 'button:browse-file', 'browse file');
  }

  fileSelected(file: File): void {
    this.gaService.sendEvent('structureImport', 'file-selected', 'file selected');
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        this.importTextControl.setValue(fileReader.result);
      };
      fileReader.readAsText(file);
    }
  }

  dismissDialog(): void {
    this.gaService.sendEvent('structureImport', 'button:close', 'no file imported');
    this.dialogRef.close();
  }



}
