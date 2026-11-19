import { Injectable } from "@angular/core";

/* GSRS Invitro Pharmacology Imports */
import { InvitroAssayInformation } from "../model/invitro-pharmacology.model";

export type IvpDraftType = "assay" | "assayset" | "screening" | "summary";

export const IVP_DRAFT_TYPES: Array<IvpDraftType> = [
  "assay",
  "assayset",
  "screening",
  "summary",
];

export const IVP_DRAFT_TYPE_LABELS: { [type: string]: string } = {
  assay: "Assay",
  assayset: "Assay Set",
  screening: "Screening",
  summary: "Summary",
};

export interface IvpDraft {
  uuid: string;
  type: IvpDraftType;
  name: string;
  date: number;
  version: number;
  data: any;
  // UI-only, not stored
  key?: string;
  fromNow?: string;
}

export interface IvpDraftImportResult {
  drafts: Array<IvpDraft>;
  errors: Array<string>;
}

export const IVP_DRAFT_KEY_PREFIX = "gsrs-ivp-draft-";
export const IVP_DRAFT_BACKUP_FORMAT = "gsrs-ivp-drafts";
export const IVP_DRAFT_VERSION = 1;

export function generateUuid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// precisionFDA only: In Vitro Pharmacology local drafts.
// pFDA users have no GSRS database to save to, so the registration forms save their records as drafts in this
// browser's localStorage, under 'gsrs-ivp-draft-<type>-<uuid>' keys. Drafts can be reused across the forms (e.g. a
// draft assay in a Screening or Summary), exported to a JSON backup file and imported again.
@Injectable({
  providedIn: "root",
})
export class InvitroPharmacologyDraftService {
  constructor() {}

  getKey(type: IvpDraftType, uuid: string): string {
    return IVP_DRAFT_KEY_PREFIX + type + "-" + uuid;
  }

  getTypeLabel(type: string): string {
    return IVP_DRAFT_TYPE_LABELS[type] || type;
  }

  getRegisterRoute(type: IvpDraftType): string {
    switch (type) {
      case "assay":
        return "/invitro-pharm/assay/register";
      case "assayset":
        return "/invitro-pharm/assaySetBuilder";
      case "summary":
        return "/invitro-pharm/summary/register";
      default:
        return "/invitro-pharm/register";
    }
  }

  // All drafts (optionally of one type), newest first. Unparsable entries are skipped.
  getDrafts(type?: IvpDraftType): Array<IvpDraft> {
    const drafts: Array<IvpDraft> = [];
    if (!this.storageAvailable()) {
      return drafts;
    }
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (!key || !key.startsWith(IVP_DRAFT_KEY_PREFIX)) {
        continue;
      }
      const draft = this.readDraft(key);
      if (draft && (!type || draft.type === type)) {
        drafts.push(draft);
      }
    }
    return drafts.sort((a, b) => (b.date || 0) - (a.date || 0));
  }

  getDraft(type: IvpDraftType, uuid: string): IvpDraft {
    if (!uuid || !this.storageAvailable()) {
      return null;
    }
    return this.readDraft(this.getKey(type, uuid));
  }

  // Draft with this uuid, of any type.
  findDraft(uuid: string): IvpDraft {
    for (const type of IVP_DRAFT_TYPES) {
      const draft = this.getDraft(type, uuid);
      if (draft) {
        return draft;
      }
    }
    return null;
  }

  // Saves (or overwrites, when uuid is given) a draft. Throws an Error with a readable message on failure.
  saveDraft(
    type: IvpDraftType,
    data: any,
    name: string,
    uuid?: string,
  ): IvpDraft {
    if (!this.storageAvailable()) {
      throw new Error(
        "Drafts cannot be saved: this browser does not allow local storage.",
      );
    }
    const draft: IvpDraft = {
      uuid: uuid || generateUuid(),
      type: type,
      name: (name || "").trim() || "Untitled " + this.getTypeLabel(type),
      date: Date.now(),
      version: IVP_DRAFT_VERSION,
      data: data,
    };
    this.writeDraft(draft);
    draft.key = this.getKey(type, draft.uuid);
    return draft;
  }

  // Deleting an Assay Set draft also removes the Assay Set from its draft assays.
  deleteDraft(draft: IvpDraft): void {
    if (draft && this.storageAvailable()) {
      localStorage.removeItem(this.getKey(draft.type, draft.uuid));
      if (draft.type === "assayset" && draft.data) {
        const assaySet = this.getAssaySetDraftName(draft);
        if (assaySet) {
          this.getDraftAssaysBySet(assaySet).forEach((assayDraft) => {
            const assay = assayDraft.data;
            assay.invitroAssaySets = assay.invitroAssaySets.filter(
              (set) => !set || (set.assaySet || "").trim() !== assaySet,
            );
            this.saveDraft("assay", assay, assayDraft.name, assayDraft.uuid);
          });
        }
      }
    }
  }

  // Assay Set names of the Assay Set drafts and of the draft assays.
  getDraftAssaySets(): Array<string> {
    const sets = new Set<string>();
    this.getDrafts("assayset").forEach((draft) => {
      const name = this.getAssaySetDraftName(draft);
      if (name) {
        sets.add(name);
      }
    });
    this.getDrafts("assay").forEach((draft) => {
      this.getAssaySetNames(draft.data).forEach((name) => sets.add(name));
    });
    return Array.from(sets).sort((a, b) => a.localeCompare(b));
  }

  getAssaySetDraftName(draft: IvpDraft): string {
    return draft && draft.data && typeof draft.data.assaySet === "string"
      ? draft.data.assaySet.trim()
      : "";
  }

  // The Assay Set draft with this name, if any.
  getAssaySetDraftByName(assaySet: string): IvpDraft {
    const name = (assaySet || "").trim();
    return name
      ? this.getDrafts("assayset").find(
          (draft) => this.getAssaySetDraftName(draft) === name,
        ) || null
      : null;
  }

  // Saves an Assay Set draft and assigns the Assay Set to exactly the given draft assays: the Assay Set
  // (or its previous name, when renamed) is added to the member assays and removed from the other draft assays.
  // The draft assays stay the source of truth of the membership, 'assayUuids' is a snapshot for the backups.
  saveAssaySetDraft(
    assaySet: string,
    description: string,
    memberUuids: Array<string>,
    uuid?: string,
    previousName?: string,
  ): IvpDraft {
    const name = (assaySet || "").trim();
    const previous = (previousName || "").trim();
    const members = new Set(memberUuids || []);

    const draft = this.saveDraft(
      "assayset",
      {
        assaySet: name,
        description: description || "",
        assayUuids: Array.from(members),
      },
      name,
      uuid,
    );

    this.getDrafts("assay").forEach((assayDraft) => {
      const assay = assayDraft.data || {};
      const sets = Array.isArray(assay.invitroAssaySets)
        ? assay.invitroAssaySets
        : [];
      const kept = sets.filter((set) => {
        const setName = set && set.assaySet ? set.assaySet.trim() : "";
        return setName !== name && (!previous || setName !== previous);
      });
      if (members.has(assayDraft.uuid)) {
        kept.push({ assaySet: name });
      }
      const changed =
        kept.length !== sets.length ||
        kept.some(
          (set, index) =>
            !sets[index] ||
            (sets[index].assaySet || "").trim() !== set.assaySet,
        );
      if (changed) {
        assay.invitroAssaySets = kept;
        this.saveDraft("assay", assay, assayDraft.name, assayDraft.uuid);
      }
    });
    return draft;
  }

  getDraftAssaysBySet(assaySet: string): Array<IvpDraft> {
    if (!assaySet) {
      return [];
    }
    return this.getDrafts("assay")
      .filter((draft) => this.getAssaySetNames(draft.data).includes(assaySet))
      .sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }

  getAssaySetNames(assay: InvitroAssayInformation): Array<string> {
    if (!assay || !Array.isArray(assay.invitroAssaySets)) {
      return [];
    }
    return assay.invitroAssaySets
      .map((set) => (set && set.assaySet ? set.assaySet.trim() : ""))
      .filter((name) => name.length > 0);
  }

  getAssayDraftName(assay: InvitroAssayInformation): string {
    if (!assay) {
      return "";
    }
    return (
      (assay.assayTitle && assay.assayTitle.trim()) ||
      assay.targetName ||
      assay.externalAssayId ||
      ""
    );
  }

  getAssayValidationMessages(assay: InvitroAssayInformation): Array<string> {
    const messages = [];
    const isBlank = (value: string) => !value || value.trim().length === 0;
    if (this.getAssaySetNames(assay).length === 0) {
      messages.push("Assay Set is required");
    }
    if (isBlank(assay.externalAssaySource)) {
      messages.push("External Assay Source is required");
    }
    if (isBlank(assay.externalAssayId)) {
      messages.push("External Assay ID is required");
    }
    if (isBlank(assay.targetName) || isBlank(assay.targetNameSubstanceKey)) {
      messages.push("Target Name is required");
    }
    return messages;
  }

  // Short description of the draft content, for the drafts list.
  describeDraft(draft: IvpDraft): string {
    const data = draft && draft.data;
    if (!data) {
      return "";
    }
    const parts = [];
    if (draft.type === "assay") {
      const sets = this.getAssaySetNames(data);
      if (sets.length > 0) {
        parts.push("Assay Set: " + sets.join(", "));
      }
      if (data.externalAssaySource || data.externalAssayId) {
        parts.push(
          (data.externalAssaySource || "") +
            " / " +
            (data.externalAssayId || ""),
        );
      }
      if (data.targetName) {
        parts.push("Target: " + data.targetName);
      }
    } else if (draft.type === "assayset") {
      const count = this.getDraftAssaysBySet(
        this.getAssaySetDraftName(draft),
      ).length;
      parts.push(count + " draft assay" + (count === 1 ? "" : "s"));
      if (data.description) {
        parts.push(data.description);
      }
    } else if (draft.type === "screening") {
      if (data.selectedAssaySet) {
        parts.push("Assay Set: " + data.selectedAssaySet);
      }
      const assays = Array.isArray(data.assays) ? data.assays : [];
      parts.push(assays.length + " assay" + (assays.length === 1 ? "" : "s"));
    } else if (draft.type === "summary") {
      const screenings = Array.isArray(data.screeningList)
        ? data.screeningList
        : [];
      parts.push(
        screenings.length + " summar" + (screenings.length === 1 ? "y" : "ies"),
      );
    }
    return parts.join("; ");
  }

  // Backup file content. Exports only the given drafts.
  createBackup(drafts: Array<IvpDraft>): any {
    return {
      format: IVP_DRAFT_BACKUP_FORMAT,
      version: IVP_DRAFT_VERSION,
      exportedAt: new Date().toISOString(),
      drafts: (drafts || []).map((draft) => this.toStored(draft)),
    };
  }

  exportDrafts(drafts: Array<IvpDraft>, fileName?: string): void {
    const json = JSON.stringify(this.createBackup(drafts), null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = (fileName || "gsrs-ivp-drafts-" + Date.now()) + ".json";
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  // Parses and validates a backup file. Accepts the backup object, or a plain array of drafts.
  parseBackup(text: string): IvpDraftImportResult {
    const result: IvpDraftImportResult = { drafts: [], errors: [] };
    let json: any;
    try {
      json = JSON.parse(text);
    } catch (e) {
      result.errors.push("The file is not valid JSON.");
      return result;
    }

    let entries: Array<any>;
    if (Array.isArray(json)) {
      entries = json;
    } else if (json && typeof json === "object" && Array.isArray(json.drafts)) {
      if (json.format && json.format !== IVP_DRAFT_BACKUP_FORMAT) {
        result.errors.push(
          'Unknown backup format "' +
            json.format +
            '", expected "' +
            IVP_DRAFT_BACKUP_FORMAT +
            '".',
        );
        return result;
      }
      entries = json.drafts;
    } else {
      result.errors.push(
        'The file is not an In Vitro Pharmacology drafts backup (no "drafts" list found).',
      );
      return result;
    }

    if (entries.length === 0) {
      result.errors.push("The backup contains no drafts.");
      return result;
    }

    entries.forEach((entry, index) => {
      const label =
        "Draft " +
        (index + 1) +
        (entry && entry.name ? ' ("' + entry.name + '")' : "");
      const entryErrors = this.validateEntry(entry);
      if (entryErrors.length > 0) {
        entryErrors.forEach((error) =>
          result.errors.push(label + ": " + error),
        );
      } else {
        result.drafts.push({
          uuid: entry.uuid,
          type: entry.type,
          name:
            typeof entry.name === "string" && entry.name.trim()
              ? entry.name
              : "Untitled " + this.getTypeLabel(entry.type),
          date:
            typeof entry.date === "number"
              ? entry.date
              : Date.parse(entry.date) || Date.now(),
          version:
            typeof entry.version === "number"
              ? entry.version
              : IVP_DRAFT_VERSION,
          data: entry.data,
        });
      }
    });
    return result;
  }

  // Writes the drafts into localStorage, overwriting drafts with the same type and uuid.
  importDrafts(drafts: Array<IvpDraft>): { added: number; replaced: number } {
    if (!this.storageAvailable()) {
      throw new Error(
        "Drafts cannot be imported: this browser does not allow local storage.",
      );
    }
    let added = 0;
    let replaced = 0;
    drafts.forEach((draft) => {
      const exists =
        localStorage.getItem(this.getKey(draft.type, draft.uuid)) !== null;
      this.writeDraft(draft);
      if (exists) {
        replaced++;
      } else {
        added++;
      }
    });
    // Imported Assay Sets are re-applied to their listed draft assays found in this browser.
    drafts
      .filter((draft) => draft.type === "assayset")
      .forEach((draft) => {
        const assaySet = this.getAssaySetDraftName(draft);
        const uuids: Array<string> = Array.isArray(draft.data.assayUuids)
          ? draft.data.assayUuids
          : [];
        uuids.forEach((uuid) => {
          const assayDraft = this.getDraft("assay", uuid);
          if (
            assaySet &&
            assayDraft &&
            !this.getAssaySetNames(assayDraft.data).includes(assaySet)
          ) {
            const assay = assayDraft.data;
            assay.invitroAssaySets = (
              Array.isArray(assay.invitroAssaySets)
                ? assay.invitroAssaySets
                : []
            ).concat([{ assaySet: assaySet }]);
            this.writeDraft({ ...assayDraft, data: assay });
          }
        });
      });
    return { added, replaced };
  }

  private validateEntry(entry: any): Array<string> {
    const errors = [];
    if (!entry || typeof entry !== "object" || Array.isArray(entry)) {
      return ["not a draft object"];
    }
    if (typeof entry.uuid !== "string" || !/^[A-Za-z0-9-]+$/.test(entry.uuid)) {
      errors.push('missing or invalid "uuid"');
    }
    if (!IVP_DRAFT_TYPES.includes(entry.type)) {
      errors.push('"type" must be one of ' + IVP_DRAFT_TYPES.join(", "));
    }
    if (
      !entry.data ||
      typeof entry.data !== "object" ||
      Array.isArray(entry.data)
    ) {
      errors.push('missing "data" object');
    } else if (entry.type === "assay") {
      // A draft assay can lose its Assay Set when the Assay Set draft is deleted, it is still importable
      this.getAssayValidationMessages(entry.data)
        .filter((message) => message !== "Assay Set is required")
        .forEach((message) => errors.push(message));
    } else if (
      entry.type === "assayset" &&
      (typeof entry.data.assaySet !== "string" ||
        entry.data.assaySet.trim().length === 0)
    ) {
      errors.push('assay set draft has no "assaySet" name');
    } else if (
      entry.type === "screening" &&
      !Array.isArray(entry.data.assays)
    ) {
      errors.push('screening draft has no "assays" list');
    } else if (
      entry.type === "summary" &&
      !Array.isArray(entry.data.screeningList)
    ) {
      errors.push('summary draft has no "screeningList" list');
    }
    return errors;
  }

  private toStored(draft: IvpDraft): IvpDraft {
    return {
      uuid: draft.uuid,
      type: draft.type,
      name: draft.name,
      date: draft.date,
      version: draft.version || IVP_DRAFT_VERSION,
      data: draft.data,
    };
  }

  private writeDraft(draft: IvpDraft): void {
    try {
      localStorage.setItem(
        this.getKey(draft.type, draft.uuid),
        JSON.stringify(this.toStored(draft)),
      );
    } catch (e) {
      if (
        e &&
        (e.name === "QuotaExceededError" || e.code === 22 || e.code === 1014)
      ) {
        throw new Error(
          "The browser storage is full. Export and delete some drafts, then try again.",
        );
      }
      throw new Error(
        "The draft could not be saved in this browser: " +
          (e && e.message ? e.message : e),
      );
    }
  }

  private readDraft(key: string): IvpDraft {
    const value = localStorage.getItem(key);
    if (!value) {
      return null;
    }
    try {
      const draft = JSON.parse(value);
      if (
        !draft ||
        !IVP_DRAFT_TYPES.includes(draft.type) ||
        !draft.uuid ||
        !draft.data
      ) {
        return null;
      }
      draft.key = key;
      return draft;
    } catch (e) {
      return null;
    }
  }

  private storageAvailable(): boolean {
    try {
      return typeof localStorage !== "undefined" && localStorage !== null;
    } catch (e) {
      return false;
    }
  }
}
