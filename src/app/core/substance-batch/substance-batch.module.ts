import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// Angular Material
import { MatIconModule } from "@angular/material/icon";
import { MatButtonModule } from "@angular/material/button";
import { MatTooltipModule } from "@angular/material/tooltip";
import { MatDialogModule } from "@angular/material/dialog";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatCheckboxModule } from "@angular/material/checkbox";

// Components
import { BatchSidebarComponent } from "./batch-sidebar/batch-sidebar.component";
import { BatchSelectorDialogComponent } from "./batch-selector-dialog/batch-selector-dialog.component";

// Services
import { BatchStorageService } from "./batch-storage.service";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  declarations: [BatchSidebarComponent, BatchSelectorDialogComponent],
  exports: [BatchSidebarComponent, BatchSelectorDialogComponent],
  providers: [BatchStorageService],
})
export class SubstanceBatchModule {}
