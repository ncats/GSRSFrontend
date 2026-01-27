import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
  Input,
} from "@angular/core";
import { BatchStorageService, BatchSubstance } from "../batch-storage.service";
import { Subscription } from "rxjs";
import { SubstanceSummary } from "@gsrs-core/substance/substance.model";
import {
  trigger,
  state,
  style,
  animate,
  transition,
} from "@angular/animations";

@Component({
  selector: "app-batch-sidebar",
  templateUrl: "./batch-sidebar.component.html",
  styleUrls: ["./batch-sidebar.component.scss"],
  animations: [
    trigger("slideInOut", [
      state(
        "in",
        style({
          transform: "translateX(0)",
        }),
      ),
      state(
        "out",
        style({
          transform: "translateX(-100%)",
        }),
      ),
      transition("in => out", animate("300ms ease-in-out")),
      transition("out => in", animate("300ms ease-in-out")),
    ]),
  ],
})
export class BatchSidebarComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closed = new EventEmitter<void>();
  @Output() substanceSelected = new EventEmitter<SubstanceSummary>();

  batchItems: BatchSubstance[] = [];
  private subscription: Subscription;

  constructor(private batchStorageService: BatchStorageService) {}

  ngOnInit(): void {
    this.subscription = this.batchStorageService.batchSubstances$.subscribe(
      (items) => {
        this.batchItems = items;
      },
    );
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  /**
   * Toggles the sidebar open/closed state
   */
  toggle(): void {
    this.isOpen = !this.isOpen;
    if (!this.isOpen) {
      this.closed.emit();
    }
  }

  /**
   * Closes the sidebar
   */
  close(): void {
    this.isOpen = false;
    this.closed.emit();
  }

  /**
   * Opens the sidebar
   */
  open(): void {
    this.isOpen = true;
  }

  /**
   * Selects a batch item and emits it as SubstanceSummary
   * @param item The batch item to select
   */
  selectItem(item: BatchSubstance): void {
    const summary = this.batchStorageService.toSubstanceSummary(item);
    this.substanceSelected.emit(summary);
  }

  /**
   * Removes an item from the batch
   * @param item The batch item to remove
   * @param event Mouse event to stop propagation
   */
  removeItem(item: BatchSubstance, event: MouseEvent): void {
    event.stopPropagation();
    if (confirm("Are you sure you want to remove this item from the batch?")) {
      this.batchStorageService.removeBatchItem(item.key);
    }
  }

  /**
   * Clears all items from the batch
   */
  clearAll(): void {
    if (
      confirm(
        "Are you sure you want to clear all items from the batch? This cannot be undone.",
      )
    ) {
      this.batchStorageService.clearBatch();
    }
  }

  /**
   * Gets the animation state for the sidebar
   */
  get animationState(): string {
    return this.isOpen ? "in" : "out";
  }

  /**
   * Gets the display type label for a substance class
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
}
