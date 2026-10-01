import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { Auth } from '@gsrs-core/auth/auth.model';
import { StructureService } from '@gsrs-core/structure/structure.service';
import { LoadingService } from '@gsrs-core/loading';
import {
  SdfConvertedRecord,
  SdfImportService,
  SdfSubmissionResult
} from './sdf-import.service';
import { SDF_ACCEPTED_EXTENSIONS } from '../sdf-tools.constants';

type SdfImportStep = 'upload' | 'review' | 'submitting' | 'done';

@Component({
  selector: 'app-sdf-import',
  templateUrl: './sdf-import.component.html',
  styleUrls: ['./sdf-import.component.scss'],
  standalone: false
})
export class SdfImportComponent implements OnInit, OnDestroy {
  acceptedExtensions = SDF_ACCEPTED_EXTENSIONS;
  isPfdaVersion = false;

  // Standard (non-pFDA) deployment state.
  auth?: Auth;
  authResolved = false;
  canImportData = false;

  // pFDA import flow state.
  isSignedIn = false;
  step: SdfImportStep = 'upload';
  selectedFile?: File;
  filename = '';
  errorMessage = '';
  isConverting = false;
  records: Array<SdfConvertedRecord> = [];
  results: Array<SdfSubmissionResult> = [];
  submittedCount = 0;

  private subscriptions: Array<Subscription> = [];

  constructor(
    private sdfImportService: SdfImportService,
    private authService: AuthService,
    private structureService: StructureService,
    private loadingService: LoadingService
  ) {}

  ngOnInit(): void {
    this.isPfdaVersion = this.sdfImportService.isPfdaVersion;

    if (this.isPfdaVersion) {
      this.resolvePfdaSignInState();
    } else {
      this.resolveStandardDeploymentAccess();
    }
  }

  get pfdaHomeUrl(): string {
    return this.sdfImportService.pfdaHomeUrl;
  }

  get selectedRecords(): Array<SdfConvertedRecord> {
    return this.records.filter(record => record.selected);
  }

  get allSelected(): boolean {
    return this.records.length > 0 && this.records.every(record => record.selected);
  }

  get someSelected(): boolean {
    return this.records.some(record => record.selected) && !this.allSelected;
  }

  get successResults(): Array<SdfSubmissionResult> {
    return this.results.filter(result => result.success);
  }

  get failedResults(): Array<SdfSubmissionResult> {
    return this.results.filter(result => !result.success);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.errorMessage = '';

    if (!input.files || input.files.length !== 1) {
      this.selectedFile = undefined;
      this.filename = '';
      return;
    }

    const file = input.files[0];
    if (!this.hasAcceptedExtension(file.name)) {
      this.selectedFile = undefined;
      this.filename = '';
      this.errorMessage = 'Invalid file extension. The file extension should be .sdf or .txt.';
      return;
    }

    this.selectedFile = file;
    this.filename = file.name;
  }

  convert(): void {
    if (!this.selectedFile) {
      return;
    }

    this.errorMessage = '';
    this.isConverting = true;
    this.loadingService.setLoading(true);

    const subscription = this.sdfImportService
      .uploadSdFile(this.selectedFile)
      .subscribe({
        next: uploadResponse => this.convertUploaded(uploadResponse),
        error: error => this.handleConversionError(error)
      });
    this.subscriptions.push(subscription);
  }

  toggleAll(checked: boolean): void {
    this.records.forEach(record => (record.selected = checked));
  }

  submit(): void {
    const toSubmit = this.selectedRecords;
    if (!toSubmit.length) {
      return;
    }

    this.step = 'submitting';
    this.results = [];
    this.submittedCount = 0;
    this.errorMessage = '';

    const subscription = this.sdfImportService
      .submitRecordsProgressively(toSubmit)
      .subscribe({
        next: result => {
          this.results.push(result);
          this.submittedCount = this.results.length;
        },
        error: error => {
          this.errorMessage = this.readErrorMessage(error);
          this.step = 'done';
        },
        complete: () => {
          this.step = 'done';
        }
      });
    this.subscriptions.push(subscription);
  }

  submissionProgress(total: number): number {
    if (!total) {
      return 0;
    }
    return (this.submittedCount / total) * 100;
  }

  startOver(): void {
    this.step = 'upload';
    this.selectedFile = undefined;
    this.filename = '';
    this.records = [];
    this.results = [];
    this.submittedCount = 0;
    this.errorMessage = '';
  }

  backToReview(): void {
    this.step = 'review';
    this.results = [];
    this.submittedCount = 0;
  }

  private convertUploaded(uploadResponse: any): void {
    const subscription = this.sdfImportService.convertRecords(uploadResponse).subscribe({
      next: records => {
        this.isConverting = false;
        this.loadingService.setLoading(false);
        this.records = records;

        if (!records.length) {
          this.errorMessage =
            'No records could be read from this SD File. Run it through the Validate tab to find out why.';
          return;
        }

        this.step = 'review';
        this.resolveStructureImages(records);
      },
      error: error => this.handleConversionError(error)
    });
    this.subscriptions.push(subscription);
  }

  /**
   * Registers each record's molfile with the structure service so the review table can
   * render an image for it. Records without a structure (valid for complex substances) are
   * skipped, and a rendering failure must not block the import.
   */
  private resolveStructureImages(records: Array<SdfConvertedRecord>): void {
    records.forEach(record => {
      const molfile = record.data && record.data.structure && record.data.structure.molfile;
      if (!molfile) {
        return;
      }

      const subscription = this.structureService
        .interpretStructure(molfile)
        .pipe(take(1))
        .subscribe({
          next: response => {
            if (response && response.structure && response.structure.id) {
              record.data.structureID = response.structure.id;
            }
          },
          error: () => {}
        });
      this.subscriptions.push(subscription);
    });
  }

  private handleConversionError(error: any): void {
    this.isConverting = false;
    this.loadingService.setLoading(false);
    this.errorMessage = this.readErrorMessage(error);
  }

  /**
   * Saves the selected records to the user's machine as a single GSRS JSON file.
   *
   * This is deliberately available to everyone, signed in or not. pFDA proxies logged-out
   * traffic as the `pfda-guest` profile, so conversion itself works anonymously — but an
   * anonymous user has no My Home area to submit to, and downloading is the only way for
   * them to keep the result.
   */
  downloadJson(): void {
    const selected = this.selectedRecords;
    if (!selected.length) {
      return;
    }

    const payload = selected.map(record => record.data);
    // A single record downloads as a bare object so it can be fed straight back into GSRS;
    // multiple records download as an array.
    const json = JSON.stringify(payload.length === 1 ? payload[0] : payload, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = this.downloadFilename(selected.length);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Opens the pFDA login popup and, once the user is back, continues straight into the
   * submission they originally asked for.
   */
  signInAndSubmit(): void {
    const subscription = this.authService
      .pfdaLogin()
      .pipe(take(1))
      .subscribe({
        next: signedIn => {
          this.isSignedIn = signedIn;
          if (signedIn) {
            this.submit();
          } else {
            this.errorMessage =
              'Sign in did not complete, so nothing was saved to My Home. ' +
              'You can try again, or download the JSON instead.';
          }
        },
        error: () => {
          this.errorMessage =
            'Sign in failed, so nothing was saved to My Home. ' +
            'You can try again, or download the JSON instead.';
        }
      });
    this.subscriptions.push(subscription);
  }

  private downloadFilename(count: number): string {
    const base = (this.filename || 'sd-file').replace(/\.[^.]+$/, '') || 'sd-file';
    const suffix = count === 1 ? 'gsrs' : `gsrs-${count}-records`;
    return `${base}-${suffix}.json`;
  }

  private resolvePfdaSignInState(): void {
    const authSubscription = this.authService.getAuth().subscribe(auth => {
      this.auth = auth;
      this.isSignedIn = !!auth;
    });
    this.subscriptions.push(authSubscription);
  }

  private resolveStandardDeploymentAccess(): void {
    const authSubscription = this.authService.getAuth().subscribe(auth => {
      this.auth = auth;

      if (!auth) {
        this.canImportData = false;
        this.authResolved = true;
        return;
      }

      this.authService
        .hasSpecificPrivilege('Import Data')
        .then(canImport => {
          this.canImportData = canImport;
          this.authResolved = true;
        })
        .catch(() => {
          this.canImportData = false;
          this.authResolved = true;
        });
    });
    this.subscriptions.push(authSubscription);
  }

  private hasAcceptedExtension(filename: string): boolean {
    const lower = (filename || '').toLowerCase();
    return this.acceptedExtensions
      .split(',')
      .some(extension => lower.endsWith(extension.trim()));
  }

  private readErrorMessage(error: any): string {
    if (!error) {
      return 'Unknown error';
    }
    if (error.error && error.error.message) {
      return error.error.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'The SD File could not be processed. Please check the file and try again.';
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.subscriptions = [];
  }
}
