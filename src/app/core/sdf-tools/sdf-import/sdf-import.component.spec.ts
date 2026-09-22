import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, throwError } from 'rxjs';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { StructureService } from '@gsrs-core/structure/structure.service';
import { LoadingService } from '@gsrs-core/loading';
import { SdfImportComponent } from './sdf-import.component';
import { SdfConvertedRecord, SdfImportService } from './sdf-import.service';

describe('SdfImportComponent', () => {
  let component: SdfImportComponent;
  let fixture: ComponentFixture<SdfImportComponent>;
  let sdfImportServiceSpy: any;
  let authServiceSpy: any;
  let structureServiceSpy: jasmine.SpyObj<StructureService>;

  const makeRecord = (index: number): SdfConvertedRecord => ({
    index,
    data: { substanceClass: 'chemical', structure: { molfile: 'mol' } },
    displayName: `Record ${index + 1}`,
    codes: [],
    selected: true
  });

  const configure = (isPfdaVersion: boolean) => {
    TestBed.resetTestingModule();

    sdfImportServiceSpy = jasmine.createSpyObj(
      'SdfImportService',
      ['uploadSdFile', 'convertRecords', 'submitRecords', 'submitRecordsProgressively'],
      { isPfdaVersion, pfdaHomeUrl: 'https://precision.fda.gov/home' }
    );
    authServiceSpy = jasmine.createSpyObj('AuthService', [
      'getAuth',
      'hasSpecificPrivilege',
      'pfdaLogin'
    ]);
    authServiceSpy.getAuth.and.returnValue(of(null));
    authServiceSpy.hasSpecificPrivilege.and.returnValue(Promise.resolve(false));
    authServiceSpy.pfdaLogin.and.returnValue(of(true));

    structureServiceSpy = jasmine.createSpyObj('StructureService', ['interpretStructure']);
    structureServiceSpy.interpretStructure.and.returnValue(of({} as any));

    TestBed.configureTestingModule({
      declarations: [SdfImportComponent],
      providers: [
        { provide: SdfImportService, useValue: sdfImportServiceSpy },
        { provide: AuthService, useValue: authServiceSpy },
        { provide: StructureService, useValue: structureServiceSpy },
        { provide: LoadingService, useValue: { setLoading: () => {} } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SdfImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => configure(true)));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should start on the upload step', () => {
    expect(component.step).toBe('upload');
  });

  describe('file selection', () => {
    const selectFile = (name: string) => {
      const file = new File(['data'], name);
      component.onFileSelected({ target: { files: [file] } } as any);
    };

    it('should accept a .sdf file', () => {
      selectFile('substances.sdf');
      expect(component.filename).toBe('substances.sdf');
      expect(component.errorMessage).toBe('');
    });

    it('should accept a .txt file', () => {
      selectFile('substances.txt');
      expect(component.filename).toBe('substances.txt');
    });

    it('should reject an unsupported extension', () => {
      selectFile('substances.mol');
      expect(component.selectedFile).toBeUndefined();
      expect(component.errorMessage).toContain('.sdf or .txt');
    });
  });

  describe('conversion', () => {
    beforeEach(() => {
      const file = new File(['data'], 'substances.sdf');
      component.onFileSelected({ target: { files: [file] } } as any);
    });

    it('should move to review once records are converted', () => {
      sdfImportServiceSpy.uploadSdFile.and.returnValue(of({ id: 'upload-1' }));
      sdfImportServiceSpy.convertRecords.and.returnValue(of([makeRecord(0), makeRecord(1)]));

      component.convert();

      expect(component.step).toBe('review');
      expect(component.records.length).toBe(2);
    });

    it('should report an empty SD File instead of showing an empty review table', () => {
      sdfImportServiceSpy.uploadSdFile.and.returnValue(of({ id: 'upload-1' }));
      sdfImportServiceSpy.convertRecords.and.returnValue(of([]));

      component.convert();

      expect(component.step).toBe('upload');
      expect(component.errorMessage).toContain('No records');
    });

    it('should surface an upload failure', () => {
      sdfImportServiceSpy.uploadSdFile.and.returnValue(
        throwError(() => ({ error: { message: 'Upload rejected' } }))
      );

      component.convert();

      expect(component.errorMessage).toBe('Upload rejected');
      expect(component.isConverting).toBe(false);
    });

    it('should not block the import when structure rendering fails', () => {
      sdfImportServiceSpy.uploadSdFile.and.returnValue(of({ id: 'upload-1' }));
      sdfImportServiceSpy.convertRecords.and.returnValue(of([makeRecord(0)]));
      structureServiceSpy.interpretStructure.and.returnValue(throwError(() => new Error('nope')));

      component.convert();

      expect(component.step).toBe('review');
    });
  });

  describe('selection', () => {
    beforeEach(() => {
      component.records = [makeRecord(0), makeRecord(1), makeRecord(2)];
    });

    it('should report all selected', () => {
      expect(component.allSelected).toBe(true);
      expect(component.someSelected).toBe(false);
    });

    it('should report a partial selection as indeterminate', () => {
      component.records[0].selected = false;
      expect(component.allSelected).toBe(false);
      expect(component.someSelected).toBe(true);
    });

    it('should deselect everything', () => {
      component.toggleAll(false);
      expect(component.selectedRecords.length).toBe(0);
    });
  });

  describe('submission', () => {
    beforeEach(() => {
      component.records = [makeRecord(0), makeRecord(1)];
    });

    it('should collect results and finish on the done step', () => {
      sdfImportServiceSpy.submitRecordsProgressively.and.returnValue(
        of(
          { index: 0, displayName: 'Record 1', success: true, fileUrl: 'file-1' },
          { index: 1, displayName: 'Record 2', success: false, errorMessage: 'bad' }
        )
      );

      component.submit();

      expect(component.step).toBe('done');
      expect(component.successResults.length).toBe(1);
      expect(component.failedResults.length).toBe(1);
    });

    it('should only submit selected records', () => {
      component.records[1].selected = false;
      sdfImportServiceSpy.submitRecordsProgressively.and.returnValue(of());

      component.submit();

      const submitted = sdfImportServiceSpy.submitRecordsProgressively.calls.mostRecent().args[0];
      expect(submitted.length).toBe(1);
      expect(submitted[0].index).toBe(0);
    });

    it('should do nothing when nothing is selected', () => {
      component.toggleAll(false);
      component.submit();
      expect(sdfImportServiceSpy.submitRecordsProgressively).not.toHaveBeenCalled();
      expect(component.step).not.toBe('submitting');
    });

    it('should compute submission progress', () => {
      component.submittedCount = 1;
      expect(component.submissionProgress(2)).toBe(50);
      expect(component.submissionProgress(0)).toBe(0);
    });

    it('should reset cleanly when starting over', () => {
      component.submittedCount = 2;
      component.results = [{ index: 0, displayName: 'x', success: true }];
      component.startOver();

      expect(component.step).toBe('upload');
      expect(component.records).toEqual([]);
      expect(component.results).toEqual([]);
      expect(component.submittedCount).toBe(0);
    });
  });

  describe('standard (non-pfda) deployment', () => {
    it('should show the signed-out state when there is no auth', waitForAsync(() => {
      configure(false);
      fixture.whenStable().then(() => {
        expect(component.auth).toBeFalsy();
        expect(component.canImportData).toBe(false);
        expect(component.authResolved).toBe(true);
      });
    }));

    it('should grant access when the user holds the Import Data privilege', waitForAsync(() => {
      TestBed.resetTestingModule();
      configure(false);
      authServiceSpy.getAuth.and.returnValue(of({ identifier: 'tester' }));
      authServiceSpy.hasSpecificPrivilege.and.returnValue(Promise.resolve(true));

      fixture = TestBed.createComponent(SdfImportComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(authServiceSpy.hasSpecificPrivilege).toHaveBeenCalledWith('Import Data');
        expect(component.canImportData).toBe(true);
      });
    }));

    it('should deny access when the privilege lookup fails', waitForAsync(() => {
      TestBed.resetTestingModule();
      configure(false);
      authServiceSpy.getAuth.and.returnValue(of({ identifier: 'tester' }));
      authServiceSpy.hasSpecificPrivilege.and.returnValue(Promise.reject(new Error('boom')));

      fixture = TestBed.createComponent(SdfImportComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      fixture.whenStable().then(() => {
        expect(component.canImportData).toBe(false);
        expect(component.authResolved).toBe(true);
      });
    }));
  });

  describe('local download and sign-in gating (pFDA)', () => {
    it('should treat an anonymous visitor as signed out', () => {
      expect(component.isSignedIn).toBe(false);
    });

    it('should mark the visitor as signed in when auth resolves', waitForAsync(() => {
      configure(true);
      authServiceSpy.getAuth.and.returnValue(of({ identifier: 'tester' }));

      fixture = TestBed.createComponent(SdfImportComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();

      expect(component.isSignedIn).toBe(true);
    }));

    it('should download the selected records without requiring sign in', () => {
      const createObjectUrlSpy = spyOn(URL, 'createObjectURL').and.returnValue('blob:fake');
      const revokeSpy = spyOn(URL, 'revokeObjectURL');
      const clickSpy = jasmine.createSpy('click');
      const anchor = { href: '', download: '', click: clickSpy } as any;
      spyOn(document, 'createElement').and.returnValue(anchor);
      spyOn(document.body, 'appendChild').and.stub();
      spyOn(document.body, 'removeChild').and.stub();

      component.filename = 'my-file.sdf';
      component.records = [makeRecord(0), makeRecord(1)];

      component.downloadJson();

      expect(component.isSignedIn).toBe(false);
      expect(createObjectUrlSpy).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(revokeSpy).toHaveBeenCalledWith('blob:fake');
      expect(anchor.download).toBe('my-file-gsrs-2-records.json');
    });

    it('should name a single-record download after the source file', () => {
      spyOn(URL, 'createObjectURL').and.returnValue('blob:fake');
      spyOn(URL, 'revokeObjectURL');
      const anchor = { href: '', download: '', click: () => {} } as any;
      spyOn(document, 'createElement').and.returnValue(anchor);
      spyOn(document.body, 'appendChild').and.stub();
      spyOn(document.body, 'removeChild').and.stub();

      component.filename = 'sample.sdf';
      component.records = [makeRecord(0)];

      component.downloadJson();

      expect(anchor.download).toBe('sample-gsrs.json');
    });

    it('should do nothing when no records are selected', () => {
      const createObjectUrlSpy = spyOn(URL, 'createObjectURL');
      const record = makeRecord(0);
      record.selected = false;
      component.records = [record];

      component.downloadJson();

      expect(createObjectUrlSpy).not.toHaveBeenCalled();
    });

    it('should submit after a successful sign in', () => {
      const submitSpy = spyOn(component, 'submit');
      authServiceSpy.pfdaLogin.and.returnValue(of(true));

      component.signInAndSubmit();

      expect(component.isSignedIn).toBe(true);
      expect(submitSpy).toHaveBeenCalled();
    });

    it('should not submit and should explain when sign in is cancelled', () => {
      const submitSpy = spyOn(component, 'submit');
      authServiceSpy.pfdaLogin.and.returnValue(of(false));

      component.signInAndSubmit();

      expect(component.isSignedIn).toBe(false);
      expect(submitSpy).not.toHaveBeenCalled();
      expect(component.errorMessage).toContain('download the JSON instead');
    });

    it('should surface an error when the sign in popup fails', () => {
      const submitSpy = spyOn(component, 'submit');
      authServiceSpy.pfdaLogin.and.returnValue(throwError(() => new Error('popup blocked')));

      component.signInAndSubmit();

      expect(submitSpy).not.toHaveBeenCalled();
      expect(component.errorMessage).toContain('Sign in failed');
    });
  });
});
