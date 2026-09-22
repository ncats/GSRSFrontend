import { Injectable } from '@angular/core';
import { Observable, from, of, throwError } from 'rxjs';
import { catchError, concatMap, map, switchMap, take, toArray } from 'rxjs/operators';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ConfigService } from '@gsrs-core/config';

export interface SdfConvertedRecord {
  index: number;
  data: any;
  displayName: string;
  codes: Array<{ codeSystem: string; code: string }>;
  formula?: string;
  mwt?: number;
  selected: boolean;
}

export interface SdfSubmissionResult {
  index: number;
  displayName: string;
  success: boolean;
  fileUrl?: string;
  errorMessage?: string;
}

/**
 * One entry from `api/v1/substances/import/adapters`, which returns a bare array of these.
 * Mirrors the server's ClientFriendlyImportAdapterConfig. Note that `fileExtensions` is the
 * client-facing name for the `supportedFileExtensions` key used in the server's config file.
 */
export interface SdfImportAdapter {
  adapterKey: string;
  adapterName?: string;
  description?: string;
  fileExtensions?: Array<string>;
  parameters?: any;
}

/**
 * Drives the SD File -> GSRS JSON pipeline used by the SD File Tools hub.
 *
 * IMPORTANT: this service must never write to the substance database. The precisionFDA
 * deployment runs against a read-only database with no admin privileges, so the
 * DB-persisting import endpoints (`@execute`, `@executeasync` and
 * `stagingArea/@bulkactasync`) are deliberately not used. Conversion happens through the
 * import adapter's `@preview` endpoint, which parses without persisting, and each record is
 * then submitted individually through the normal substance save path. On precisionFDA that
 * save path writes a JSON file to the user's My Home area and returns its `fileUrl`.
 */
@Injectable({ providedIn: 'root' })
export class SdfImportService {
  constructor(
    private adminService: AdminService,
    private substanceService: SubstanceService,
    private configService: ConfigService
  ) {}

  get isPfdaVersion(): boolean {
    return this.configService.configData?.isPfdaVersion === true;
  }

  get pfdaHomeUrl(): string {
    const base = this.configService.configData?.pfdaBaseUrl || '/';
    return `${base}home`;
  }

  /**
   * Successful adapter lookups are cached; failures deliberately are not, so a user who hits
   * a transient server problem can retry instead of having to reload the page.
   */
  private cachedAdapters: Array<SdfImportAdapter>;

  private getAdapters(): Observable<Array<SdfImportAdapter>> {
    if (this.cachedAdapters && this.cachedAdapters.length) {
      return of(this.cachedAdapters);
    }

    return this.adminService.getAdapters().pipe(
      take(1),
      map(result => {
        const adapters: Array<SdfImportAdapter> = (Array.isArray(result) ? result : []).filter(
          adapter => adapter && adapter.adapterKey
        );

        if (!adapters.length) {
          throw new Error(
            'The server has no import adapters configured, so the SD File cannot be converted. ' +
              'An administrator needs to register an SD File import adapter on the server.'
          );
        }
        this.cachedAdapters = adapters;
        return adapters;
      })
    );
  }

  /**
   * Picks the adapter the backend has registered for this file, matching on the declared
   * file extensions first and falling back to an adapter whose key or name mentions SDF.
   */
  resolveAdapterKey(file: File): Observable<string> {
    const extension = this.fileExtension(file);

    return this.getAdapters().pipe(
      take(1),
      map(adapters => {
        const byExtension = adapters.find(
          adapter =>
            extension &&
            (adapter.fileExtensions || []).some(ext => this.normalize(ext) === extension)
        );
        if (byExtension) {
          return byExtension.adapterKey;
        }

        const byName = adapters.find(
          adapter =>
            this.normalize(adapter.adapterKey).indexOf('sdf') > -1 ||
            this.normalize(adapter.adapterName).indexOf('sdf') > -1
        );
        if (byName) {
          return byName.adapterKey;
        }

        const available = adapters.map(adapter => adapter.adapterKey).join(', ');
        throw new Error(
          `The server has no import adapter that accepts this file. Adapters available: ${available}.`
        );
      })
    );
  }

  /** Lowercased extension without the leading dot, e.g. 'sdf'. */
  private fileExtension(file: File): string {
    const name = (file && file.name) || '';
    const dot = name.lastIndexOf('.');
    return dot > -1 ? this.normalize(name.substring(dot + 1)) : '';
  }

  private normalize(value: string): string {
    return (value || '').trim().replace(/^\./, '').toLowerCase();
  }

  /**
   * Uploads the SD File so the backend can derive the adapter settings for it. This
   * registers the file with the importer but does not create any substance records.
   */
  uploadSdFile(file: File): Observable<any> {
    return this.resolveAdapterKey(file).pipe(
      switchMap(adapterKey => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('file-type', adapterKey);

        return this.adminService.postAdapterFile(formData, adapterKey).pipe(take(1));
      })
    );
  }

  /**
   * Converts every record in the uploaded SD File into GSRS substance JSON.
   * Uses the `@preview` endpoint, which parses without persisting anything.
   */
  convertRecords(uploadResponse: any): Observable<Array<SdfConvertedRecord>> {
    if (!uploadResponse || !uploadResponse.id) {
      return throwError(() => new Error('The SD File could not be prepared for conversion.'));
    }

    const settings = JSON.parse(JSON.stringify(uploadResponse));

    return this.adminService.previewAdapter(uploadResponse.id, settings, 'all').pipe(
      take(1),
      map(response => {
        const preview = (response && response.dataPreview) || [];
        return preview
          .filter(entry => entry && entry.data)
          .map((entry, index) => this.toConvertedRecord(entry.data, index));
      })
    );
  }

  /**
   * Submits the selected records one at a time. A failure on any single record is captured
   * and reported rather than aborting the batch, so a single bad record in a large SD File
   * cannot cost the user every other record.
   */
  submitRecords(records: Array<SdfConvertedRecord>): Observable<Array<SdfSubmissionResult>> {
    if (!records || !records.length) {
      return of([]);
    }

    return from(records).pipe(
      concatMap(record => this.submitRecord(record)),
      toArray()
    );
  }

  /** Emits one result per record as it completes, so callers can show live progress. */
  submitRecordsProgressively(
    records: Array<SdfConvertedRecord>
  ): Observable<SdfSubmissionResult> {
    return from(records || []).pipe(concatMap(record => this.submitRecord(record)));
  }

  private submitRecord(record: SdfConvertedRecord): Observable<SdfSubmissionResult> {
    return this.substanceService.saveSubstance(record.data, 'import').pipe(
      take(1),
      map((response: any) => ({
        index: record.index,
        displayName: record.displayName,
        success: true,
        fileUrl: response && response.fileUrl ? response.fileUrl : undefined
      })),
      catchError(error =>
        of({
          index: record.index,
          displayName: record.displayName,
          success: false,
          errorMessage: this.extractErrorMessage(error)
        })
      )
    );
  }

  private toConvertedRecord(data: any, index: number): SdfConvertedRecord {
    return {
      index,
      data,
      displayName: this.extractDisplayName(data, index),
      codes: this.extractCodes(data),
      formula: data && data.structure ? data.structure.formula : undefined,
      mwt: data && data.structure ? data.structure.mwt : undefined,
      selected: true
    };
  }

  private extractDisplayName(data: any, index: number): string {
    const names = (data && data.names) || [];
    const preferred = names.find(name => name && name.displayName === true);

    if (preferred && preferred.name) {
      return preferred.name;
    }
    if (names.length && names[0].name) {
      return names[0].name;
    }
    return `Record ${index + 1}`;
  }

  private extractCodes(data: any): Array<{ codeSystem: string; code: string }> {
    return ((data && data.codes) || [])
      .filter(code => code && code.code)
      .map(code => ({ codeSystem: code.codeSystem, code: code.code }));
  }

  private extractErrorMessage(error: any): string {
    if (!error) {
      return 'Unknown error';
    }
    if (typeof error === 'string') {
      return error;
    }
    if (error.error && error.error.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    if (error.statusText) {
      return error.statusText;
    }
    return 'Unknown error';
  }
}
