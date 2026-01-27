import { Component, OnInit, Inject } from "@angular/core";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { BatchStorageService, BatchSubstance } from "../batch-storage.service";
import { SubstanceSummary } from "@gsrs-core/substance/substance.model";

@Component({
  selector: "app-batch-selector-dialog",
  templateUrl: "./batch-selector-dialog.component.html",
  styleUrls: ["./batch-selector-dialog.component.scss"],
})
export class BatchSelectorDialogComponent implements OnInit {
  batchItems: BatchSubstance[] = [];
  filteredItems: BatchSubstance[] = [];
  searchTerm = "";
  selectedItem: BatchSubstance | null = null;

  constructor(
    private batchStorageService: BatchStorageService,
    public dialogRef: MatDialogRef<BatchSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  ngOnInit(): void {
    this.loadBatchItems();
  }

  /**
   * Loads batch items from storage
   */
  loadBatchItems(): void {
    this.batchItems = this.batchStorageService.getBatchList();
    this.filteredItems = [...this.batchItems];
  }

  /**
   * Filters items based on search term
   */
  filterItems(): void {
    const term = this.searchTerm.toLowerCase().trim();
    if (!term) {
      this.filteredItems = [...this.batchItems];
      return;
    }

    this.filteredItems = this.batchItems.filter(
      (item) =>
        (item.name && item.name.toLowerCase().includes(term)) ||
        (item.uuid && item.uuid.toLowerCase().includes(term)) ||
        (item.type && item.type.toLowerCase().includes(term)),
    );
  }

  /**
   * Selects an item
   * @param item The batch item to select
   */
  selectItem(item: BatchSubstance): void {
    this.selectedItem = item;
  }

  /**
   * Confirms selection and closes dialog
   */
  confirmSelection(): void {
    if (this.selectedItem) {
      const summary = this.batchStorageService.toSubstanceSummary(
        this.selectedItem,
      );
      this.dialogRef.close(summary);
    }
  }

  /**
   * Double-click to immediately select
   * @param item The batch item to select
   */
  quickSelect(item: BatchSubstance): void {
    const summary = this.batchStorageService.toSubstanceSummary(item);
    this.dialogRef.close(summary);
  }

  /**
   * Closes dialog without selection
   */
  cancel(): void {
    this.dialogRef.close(null);
  }

  /**
   * Gets display type label
   * @param type The substance class
   */
  getTypeLabel(type: string): string {
    const typeLabels: { [key: string]: string } = {
      chemical: "Chemical",
      protein: "Protein",
      nucleicAcid: "Nucleic Acid",
      mixture: "Mixture",
      polymer: "Polymer",
      structurallyDiverse: "Structurally Diverse",
      concept: "Concept",
      specifiedSubstanceG1: "SSG1",
      specifiedSubstanceG2: "SSG2",
      specifiedSubstanceG3: "SSG3",
      specifiedSubstanceG4m: "SSG4m",
    };
    return typeLabels[type] || type || "Unknown";
  }

  /**
   * Checks if an item is selected
   * @param item The item to check
   */
  isSelected(item: BatchSubstance): boolean {
    return this.selectedItem?.key === item.key;
  }
}
