import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UtilsService } from "@gsrs-core/utils";
import {
  SubstanceDetail,
  SubstanceSummary,
} from "@gsrs-core/substance/substance.model";
import * as moment from "moment";

/**
 * Represents a substance stored in the Batch
 * Similar to SubstanceDraft but only contains validated substances
 */
export interface BatchSubstance {
  key: string; // localStorage key (gsrs-batch-{timestamp})
  uuid: string; // Substance UUID (generated if new)
  date: number; // Timestamp when saved to batch
  type: string; // substanceClass
  name?: string; // Primary display name
  substance: SubstanceDetail; // Full SubstanceDetail JSON
  fromNow?: string; // Human-readable relative time
  isValidated: boolean; // Always true for batch items
}

const BATCH_STORAGE_PREFIX = "gsrs-batch-";

@Injectable({
  providedIn: "root",
})
export class BatchStorageService {
  private batchSubjectsSubject = new BehaviorSubject<BatchSubstance[]>([]);

  /** Observable stream of batch substances */
  public batchSubstances$ = this.batchSubjectsSubject.asObservable();

  constructor(private utilsService: UtilsService) {
    // Load existing batch items on service initialization
    this.refreshBatchList();
  }

  /**
   * Saves a pre-validated substance to the batch.
   * This method assumes the substance has already been validated.
   * @param substance The validated substance to save
   * @returns Object with success status and the saved batch item
   */
  saveToBatch(substance: SubstanceDetail): {
    success: boolean;
    error?: string;
    batchItem?: BatchSubstance;
  } {
    // Ensure substance has a UUID
    const substanceToSave = { ...substance };
    if (!substanceToSave.uuid) {
      substanceToSave.uuid = this.utilsService.newUUID();
    }

    const time = Date.now();
    const key = `${BATCH_STORAGE_PREFIX}${time}`;

    // Get primary name
    let primaryName: string | null = null;
    if (substanceToSave.names && substanceToSave.names.length > 0) {
      const displayName = substanceToSave.names.find((n) => n.displayName);
      primaryName = displayName
        ? displayName.name
        : substanceToSave.names[0].name;
    }

    const batchItem: BatchSubstance = {
      key,
      uuid: substanceToSave.uuid,
      date: time,
      type: substanceToSave.substanceClass || "unknown",
      name: primaryName || "Unnamed",
      substance: substanceToSave,
      isValidated: true,
      fromNow: "just now",
    };

    try {
      localStorage.setItem(key, JSON.stringify(batchItem));
      this.refreshBatchList();
      return { success: true, batchItem };
    } catch (error) {
      return {
        success: false,
        error: "Failed to save to local storage: " + (error as Error).message,
      };
    }
  }

  /**
   * Gets all batch substances from localStorage
   * @returns Array of BatchSubstance items
   */
  getBatchList(): BatchSubstance[] {
    const items: BatchSubstance[] = [];
    const keys = Object.keys(localStorage);

    for (const key of keys) {
      if (key.startsWith(BATCH_STORAGE_PREFIX)) {
        try {
          const item = JSON.parse(localStorage.getItem(key) || "");
          item.key = key; // Ensure key is set
          item.fromNow = moment(item.date).fromNow();
          items.push(item);
        } catch (e) {
          console.error("Failed to parse batch item:", key, e);
        }
      }
    }

    // Sort by date descending (newest first)
    return items.sort((a, b) => b.date - a.date);
  }

  /**
   * Refreshes the batch list and emits to subscribers
   */
  refreshBatchList(): void {
    const items = this.getBatchList();
    this.batchSubjectsSubject.next(items);
  }

  /**
   * Gets a single batch item by key
   * @param key The localStorage key
   * @returns BatchSubstance or null
   */
  getBatchItem(key: string): BatchSubstance | null {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        const parsed = JSON.parse(item);
        parsed.key = key;
        parsed.fromNow = moment(parsed.date).fromNow();
        return parsed;
      }
    } catch (e) {
      console.error("Failed to get batch item:", key, e);
    }
    return null;
  }

  /**
   * Gets a batch item by substance UUID
   * @param uuid The substance UUID
   * @returns BatchSubstance or null
   */
  getBatchItemByUuid(uuid: string): BatchSubstance | null {
    const items = this.getBatchList();
    return items.find((item) => item.uuid === uuid) || null;
  }

  /**
   * Removes a batch item from localStorage
   * @param key The localStorage key
   */
  removeBatchItem(key: string): void {
    localStorage.removeItem(key);
    this.refreshBatchList();
  }

  /**
   * Removes a batch item by UUID
   * @param uuid The substance UUID
   */
  removeBatchItemByUuid(uuid: string): void {
    const item = this.getBatchItemByUuid(uuid);
    if (item) {
      this.removeBatchItem(item.key);
    }
  }

  /**
   * Clears all batch items from localStorage
   */
  clearBatch(): void {
    const keys = Object.keys(localStorage);
    for (const key of keys) {
      if (key.startsWith(BATCH_STORAGE_PREFIX)) {
        localStorage.removeItem(key);
      }
    }
    this.refreshBatchList();
  }

  /**
   * Gets the count of items in the batch
   * @returns Number of batch items
   */
  getBatchCount(): number {
    return this.getBatchList().length;
  }

  /**
   * Converts a BatchSubstance to SubstanceSummary format
   * This allows batch items to be used polymorphically with server substances
   * @param batchItem The batch item to convert
   * @returns SubstanceSummary compatible object
   */
  toSubstanceSummary(batchItem: BatchSubstance): SubstanceSummary {
    const substance = batchItem.substance;
    return {
      uuid: substance.uuid,
      _name: batchItem.name || substance._name,
      approvalID: substance.approvalID,
      substanceClass: substance.substanceClass,
      definitionType: substance.definitionType,
      definitionLevel: substance.definitionLevel,
      status: substance.status,
      structure: substance.structure,
      polymer: substance.polymer,
      protein: substance.protein,
      nucleicAcid: substance.nucleicAcid,
      structurallyDiverse: substance.structurallyDiverse,
      names: substance.names,
      // Mark as batch item for internal identification if needed
      $$source: "batch",
    } as SubstanceSummary;
  }

  /**
   * Checks if a substance UUID exists in the batch
   * @param uuid The substance UUID to check
   * @returns boolean
   */
  isInBatch(uuid: string): boolean {
    return this.getBatchItemByUuid(uuid) !== null;
  }
}
