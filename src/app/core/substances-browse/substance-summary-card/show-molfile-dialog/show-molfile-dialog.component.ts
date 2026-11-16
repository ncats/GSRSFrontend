import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { StructureService } from '@gsrs-core/structure';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-show-molfile-dialog',
    templateUrl: './show-molfile-dialog.component.html',
    styleUrls: ['./show-molfile-dialog.component.scss'],
    standalone: true,
    imports: [FormsModule, MatDialogModule, MatButtonModule],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ShowMolfileDialogComponent {

  private readonly structureService = inject(StructureService);
  private readonly data = inject(MAT_DIALOG_DATA);

  readonly molfile = toSignal(
    this.structureService.getMolfile(this.data.uuid),
    { initialValue: '' }
  );
}

