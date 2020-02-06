import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { StructureImportComponent } from './structure-import.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { StructurePostResponseData } from '../../../testing/structure-post-reponse-test-data';
import { SubstanceService } from '../../substance/substance.service';
import { asyncData } from '../../../testing/async-observable-helpers';
import { MolFile } from '../../../testing/mol-file';
import { MatDialogRefStub } from '../../../testing/mat-dialog-ref-stub';
import { throwError } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('StructureImportComponent', () => {
  let component: StructureImportComponent;
  let fixture: ComponentFixture<StructureImportComponent>;
  let matDialogRefStub: Partial<MatDialogRef<StructureImportComponent>>;
  let postSubstanceStructureSpy: jasmine.Spy;

  beforeEach(async(() => {
    const substanceServiceSpy = jasmine.createSpyObj('SubstanceService', ['postSubstanceStructure']);
    postSubstanceStructureSpy = substanceServiceSpy.postSubstanceStructure.and.returnValue(asyncData(StructurePostResponseData));
    matDialogRefStub = new MatDialogRefStub();

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatProgressBarModule,
        MatDialogModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      declarations: [
        StructureImportComponent
      ],
      providers: [
        { provide: MatDialogRef, useValue: matDialogRefStub },
        { provide: MAT_DIALOG_DATA, useValue: [] },
        { provide: SubstanceService, useValue: substanceServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('import structure', () => {
    let textAreaElement: HTMLTextAreaElement;
    let importButtonElement: HTMLButtonElement;

    beforeEach(() => {
      textAreaElement = fixture.nativeElement.querySelector('textarea');
      textAreaElement.focus();
      textAreaElement.dispatchEvent(new Event('focusin'));
      importButtonElement = fixture.nativeElement.querySelector('.import-button');
    });

    it('on import click, if text area is empty, it should show message', async(() => {
      textAreaElement.value = '';
      textAreaElement.dispatchEvent(new Event('input'));
      importButtonElement.click();
      fixture.detectChanges();
      const messageContainerElement: HTMLElement = fixture.nativeElement.querySelector('.message-container');
      expect(messageContainerElement).toBeTruthy('message should appear');
      expect(messageContainerElement.className.indexOf('error') > -1).toBe(true, 'should have error class');
      expect(messageContainerElement.innerHTML).toBeTruthy('should show an error message');
    }));

    it('on import click, a call to postSubstance should be made', async(() => {
      textAreaElement.value = MolFile;
      textAreaElement.dispatchEvent(new Event('input'));
      importButtonElement.click();
      fixture.detectChanges();
      expect(postSubstanceStructureSpy.calls.count()).toBe(1, 'should have been called once');
    }));

    it('after import call, if response is empty object, an error message should be displayed', async(() => {
      postSubstanceStructureSpy.and.returnValue(asyncData({}));
      textAreaElement.value = 'test for error';
      textAreaElement.dispatchEvent(new Event('input'));
      importButtonElement.click();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const messageContainerElement: HTMLElement = fixture.nativeElement.querySelector('.message-container');
        expect(messageContainerElement).toBeTruthy('message should appear');
        expect(messageContainerElement.className.indexOf('error') > -1).toBe(true, 'should have error class');
        expect(messageContainerElement.innerHTML).toBeTruthy('should show an error message');
      });
    }));

    it('after import call, if error, an error message should be displayed', async(() => {
      postSubstanceStructureSpy.and.returnValue(asyncData(throwError('test error')));
      textAreaElement.value = 'test for error';
      textAreaElement.dispatchEvent(new Event('input'));
      importButtonElement.click();
      fixture.whenStable().then(() => {
        fixture.detectChanges();
        const messageContainerElement: HTMLElement = fixture.nativeElement.querySelector('.message-container');
        expect(messageContainerElement).toBeTruthy('message should appear');
        expect(messageContainerElement.className.indexOf('error') > -1).toBe(true, 'should have error class');
        expect(messageContainerElement.innerHTML).toBeTruthy('should show an error message');
      });
    }));

    it('when on file select called, file should be read and value added to textarea', async(() => {
      const readAsTextSpy = jasmine.createSpy().and.callFake(() => {
        fileReaderObject['onload']();
      });
      const fileReaderObject = {
        readAsText: readAsTextSpy,
        result: MolFile
      };
      spyOn(<any>window, 'FileReader').and.returnValue(fileReaderObject);
      const molefile = new File([MolFile], 'methandriol.mol', {type: 'text/plain'});
      component.fileSelected(molefile);
      fixture.detectChanges();
      expect(FileReader).toHaveBeenCalled();
      expect(readAsTextSpy).toHaveBeenCalled();
      expect(textAreaElement.value).toEqual(MolFile);
    }));

  });

});
