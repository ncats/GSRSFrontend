import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { ConfigService } from '@gsrs-core/config';
import { SdfConvertedRecord, SdfImportService } from './sdf-import.service';

describe('SdfImportService', () => {
  let service: SdfImportService;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;
  let substanceServiceSpy: jasmine.SpyObj<SubstanceService>;

  const previewResponse = {
    dataPreview: [
      {
        data: {
          substanceClass: 'chemical',
          names: [
            { name: 'Secondary name' },
            { name: 'Preferred name', displayName: true }
          ],
          codes: [
            { codeSystem: 'CAS', code: '50-00-0' },
            { codeSystem: 'UNII', code: 'ABC123' },
            { codeSystem: 'EMPTY' }
          ],
          structure: { molfile: 'molfile-a', formula: 'CH2O', mwt: 30.03 }
        }
      },
      { data: { substanceClass: 'chemical', names: [], codes: [] } },
      { notData: true }
    ]
  };

  beforeEach(() => {
    adminServiceSpy = jasmine.createSpyObj('AdminService', [
      'getAdapters',
      'postAdapterFile',
      'previewAdapter',
      'executeAdapter',
      'executeAdapterAsync',
      'stagedRecordMultiAction'
    ]);
    adminServiceSpy.getAdapters.and.returnValue(
      of([
        { adapterKey: 'Delimited Text Importer', fileExtensions: ['txt', 'csv'] },
        { adapterKey: 'NSRS SDF Adapter', fileExtensions: ['sdf', 'sd'] }
      ])
    );
    substanceServiceSpy = jasmine.createSpyObj('SubstanceService', ['saveSubstance']);

    TestBed.configureTestingModule({
      providers: [
        SdfImportService,
        { provide: AdminService, useValue: adminServiceSpy },
        { provide: SubstanceService, useValue: substanceServiceSpy },
        {
          provide: ConfigService,
          useValue: {
            configData: { isPfdaVersion: true, pfdaBaseUrl: 'https://precision.fda.gov/' }
          }
        }
      ]
    });

    service = TestBed.inject(SdfImportService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should build the pfda My Home url from config', () => {
    expect(service.pfdaHomeUrl).toBe('https://precision.fda.gov/home');
  });

  describe('uploadSdFile', () => {
    it('should post the file using the adapter key the server reports for the extension', done => {
      adminServiceSpy.postAdapterFile.and.returnValue(of({ id: 'upload-1' } as any));
      const file = new File(['content'], 'test.sdf');

      service.uploadSdFile(file).subscribe(response => {
        expect(response.id).toBe('upload-1');
        expect(adminServiceSpy.postAdapterFile).toHaveBeenCalled();
        expect(adminServiceSpy.postAdapterFile.calls.mostRecent().args[1]).toBe(
          'NSRS SDF Adapter'
        );
        done();
      });
    });

    it('should never hardcode an adapter key the server does not know', done => {
      adminServiceSpy.getAdapters.and.returnValue(
        of([{ adapterKey: 'Some Custom SDF Reader', fileExtensions: ['sdf'] }])
      );
      adminServiceSpy.postAdapterFile.and.returnValue(of({ id: 'upload-2' } as any));

      service.uploadSdFile(new File(['content'], 'test.sdf')).subscribe(() => {
        expect(adminServiceSpy.postAdapterFile.calls.mostRecent().args[1]).toBe(
          'Some Custom SDF Reader'
        );
        done();
      });
    });

    it('should fall back to matching the adapter key by name when the extension is unknown', done => {
      adminServiceSpy.getAdapters.and.returnValue(
        of([
          { adapterKey: 'Delimited Text Importer', fileExtensions: ['txt'] },
          { adapterKey: 'SDF Importer', fileExtensions: [] }
        ])
      );
      adminServiceSpy.postAdapterFile.and.returnValue(of({ id: 'upload-3' } as any));

      service.uploadSdFile(new File(['content'], 'noextension')).subscribe(() => {
        expect(adminServiceSpy.postAdapterFile.calls.mostRecent().args[1]).toBe('SDF Importer');
        done();
      });
    });

    it('should report the available adapters when none can handle the file', done => {
      adminServiceSpy.getAdapters.and.returnValue(
        of([{ adapterKey: 'Delimited Text Importer', fileExtensions: ['txt'] }])
      );

      service.uploadSdFile(new File(['content'], 'test.sdf')).subscribe({
        error: error => {
          expect(error.message).toContain('Delimited Text Importer');
          expect(adminServiceSpy.postAdapterFile).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('should explain the problem when the server has no adapters configured', done => {
      adminServiceSpy.getAdapters.and.returnValue(of([]));

      service.uploadSdFile(new File(['content'], 'test.sdf')).subscribe({
        error: error => {
          expect(error.message).toContain('no import adapters configured');
          expect(adminServiceSpy.postAdapterFile).not.toHaveBeenCalled();
          done();
        }
      });
    });

    it('should retry the adapter lookup after a failure rather than caching it forever', done => {
      adminServiceSpy.getAdapters.and.returnValue(of([]));

      service.uploadSdFile(new File(['content'], 'test.sdf')).subscribe({
        error: () => {
          adminServiceSpy.getAdapters.and.returnValue(
            of([{ adapterKey: 'Recovered SDF', fileExtensions: ['sdf'] }])
          );
          adminServiceSpy.postAdapterFile.and.returnValue(of({ id: 'upload-6' } as any));

          service.uploadSdFile(new File(['content'], 'test.sdf')).subscribe(() => {
            expect(adminServiceSpy.postAdapterFile.calls.mostRecent().args[1]).toBe(
              'Recovered SDF'
            );
            done();
          });
        }
      });
    });
  });

  describe('convertRecords', () => {
    beforeEach(() => {
      adminServiceSpy.previewAdapter.and.returnValue(of(previewResponse));
    });

    it('should convert every previewed record and skip entries without data', done => {
      service.convertRecords({ id: 'upload-1' }).subscribe(records => {
        expect(records.length).toBe(2);
        done();
      });
    });

    it('should request every record rather than a page of them', done => {
      service.convertRecords({ id: 'upload-1' }).subscribe(() => {
        expect(adminServiceSpy.previewAdapter.calls.mostRecent().args[2]).toBe('all');
        done();
      });
    });

    it('should prefer the display name', done => {
      service.convertRecords({ id: 'upload-1' }).subscribe(records => {
        expect(records[0].displayName).toBe('Preferred name');
        done();
      });
    });

    it('should fall back to a positional label when a record has no names', done => {
      service.convertRecords({ id: 'upload-1' }).subscribe(records => {
        expect(records[1].displayName).toBe('Record 2');
        done();
      });
    });

    it('should drop codes with no code value', done => {
      service.convertRecords({ id: 'upload-1' }).subscribe(records => {
        expect(records[0].codes.length).toBe(2);
        expect(records[0].codes.map(code => code.codeSystem)).not.toContain('EMPTY');
        done();
      });
    });

    it('should select every record by default', done => {
      service.convertRecords({ id: 'upload-1' }).subscribe(records => {
        expect(records.every(record => record.selected)).toBe(true);
        done();
      });
    });

    it('should error when the upload response has no id', done => {
      service.convertRecords({}).subscribe({
        error: error => {
          expect(error).toBeTruthy();
          done();
        }
      });
    });

    it('should never call a database-persisting endpoint', done => {
      service.convertRecords({ id: 'upload-1' }).subscribe(() => {
        expect(adminServiceSpy.executeAdapter).not.toHaveBeenCalled();
        expect(adminServiceSpy.executeAdapterAsync).not.toHaveBeenCalled();
        expect(adminServiceSpy.stagedRecordMultiAction).not.toHaveBeenCalled();
        done();
      });
    });
  });

  describe('submitRecords', () => {
    const makeRecord = (index: number): SdfConvertedRecord => ({
      index,
      data: { substanceClass: 'chemical' },
      displayName: `Record ${index + 1}`,
      codes: [],
      selected: true
    });

    it('should return the pfda file url for each saved record', done => {
      substanceServiceSpy.saveSubstance.and.returnValue(
        of({ fileUrl: 'https://precision.fda.gov/home/files/file-1' } as any)
      );

      service.submitRecords([makeRecord(0)]).subscribe(results => {
        expect(results.length).toBe(1);
        expect(results[0].success).toBe(true);
        expect(results[0].fileUrl).toBe('https://precision.fda.gov/home/files/file-1');
        done();
      });
    });

    it('should submit each record through the substance save path as an import', done => {
      substanceServiceSpy.saveSubstance.and.returnValue(of({} as any));

      service.submitRecords([makeRecord(0)]).subscribe(() => {
        expect(substanceServiceSpy.saveSubstance.calls.mostRecent().args[1]).toBe('import');
        done();
      });
    });

    it('should keep going after a failure so one bad record cannot lose the batch', done => {
      let call = 0;
      substanceServiceSpy.saveSubstance.and.callFake(() => {
        call++;
        if (call === 2) {
          return throwError(() => ({ error: { message: 'Validation failed' } }));
        }
        return of({ fileUrl: `file-${call}` } as any);
      });

      service
        .submitRecords([makeRecord(0), makeRecord(1), makeRecord(2)])
        .subscribe(results => {
          expect(results.length).toBe(3);
          expect(results.filter(result => result.success).length).toBe(2);

          const failure = results.find(result => !result.success);
          expect(failure.errorMessage).toBe('Validation failed');
          expect(failure.index).toBe(1);
          done();
        });
    });

    it('should return an empty result set for an empty selection', done => {
      service.submitRecords([]).subscribe(results => {
        expect(results).toEqual([]);
        expect(substanceServiceSpy.saveSubstance).not.toHaveBeenCalled();
        done();
      });
    });

    it('should emit results progressively for live progress reporting', done => {
      substanceServiceSpy.saveSubstance.and.returnValue(of({} as any));
      const seen = [];

      service.submitRecordsProgressively([makeRecord(0), makeRecord(1)]).subscribe({
        next: result => seen.push(result),
        complete: () => {
          expect(seen.length).toBe(2);
          done();
        }
      });
    });
  });
});
