import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StructureEditorModule } from '../structure-editor/structure-editor.module';
import { StructureSearchComponent } from './structure-search.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { RouterStub } from '../../testing/router-stub';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoadingService } from '../loading/loading.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EditorStub } from '../../testing/editor-stub';
import { SubstanceService } from '../substance/substance.service';
import { MatDialogStub } from '../../testing/mat-dialog-stub';
import { MatDialog } from '../../../node_modules/@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

describe('StructureSearchComponent', () => {
  let component: StructureSearchComponent;
  let fixture: ComponentFixture<StructureSearchComponent>;
  let routerStub: RouterStub;
  let setLoadingSpy: jasmine.Spy;
  let postSubstanceSpy: jasmine.Spy;
  let matDialog: MatDialogStub;

  beforeEach(async(() => {
    routerStub = new RouterStub();
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);
    setLoadingSpy = loadingServiceSpy.setLoading;
    const substanceServiceSpy = jasmine.createSpyObj('SubstanceService', ['postSubstance']);
    postSubstanceSpy = substanceServiceSpy.postSubstance.and.returnValue({});
    matDialog = new MatDialogStub();

    TestBed.configureTestingModule({
      imports: [
        StructureEditorModule,
        MatSelectModule,
        MatSliderModule,
        MatCardModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatButtonModule
      ],
      declarations: [
        StructureSearchComponent
      ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: SubstanceService, useValue: substanceServiceSpy },
        { provide: MatDialog, useValue: matDialog }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureSearchComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it ('on Init, loading should be set to true', () => {
    fixture.detectChanges();
    expect(setLoadingSpy).toHaveBeenCalledTimes(1);
  });

  // it('on edtiroOnLoad, editor should be set and ')
});
