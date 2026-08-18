import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Output, EventEmitter } from '@angular/core';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { NameResolverModule } from '../name-resolver/name-resolver.module';
import { StructureSearchComponent } from './structure-search.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { RouterStub } from '../../../testing/router-stub';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { LoadingService } from '../loading/loading.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { EditorStub } from '../../../testing/editor-stub';
import { StructureService } from '../structure/structure.service';
import { GoogleAnalyticsService } from '../google-analytics/google-analytics.service';
import { Title } from '@angular/platform-browser';
import { MatDialogStub } from '../../../testing/mat-dialog-stub';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { StructurePostResponseData } from '../../../testing/structure-post-reponse-test-data';
import { asyncData } from '../../../testing/async-observable-helpers';
import { MolFile } from '../../../testing/mol-file';
import { Editor } from '../structure-editor/structure.editor.model';
import { OverlayContainer } from '@angular/cdk/overlay';
import { ReactiveFormsModule } from '@angular/forms';
import { ConfigService } from '../config/config.service';
import { ActivatedRouteStub } from '../../../testing/activated-route-stub';
import { AuthService } from '@gsrs-core/auth/auth.service';

// real <app-structure-editor> is backed by Ketcher/JSDraw, which don't exist in the
// Karma/jsdom test environment; stub its DOM surface instead of rendering the real thing.
@Component({
  selector: 'app-structure-editor',
  template: '',
  standalone: false
})
class StructureEditorStubComponent {
  @Output() editorOnLoad = new EventEmitter<Editor>();
  @Output() loadedMolfile = new EventEmitter<any>();
}

describe('StructureSearchComponent', () => {
  let component: StructureSearchComponent;
  let fixture: ComponentFixture<StructureSearchComponent>;
  let routerStub: RouterStub;
  let setLoadingSpy: jasmine.Spy;
  let interpretStructureSpy: jasmine.Spy;
  let matDialog: MatDialogStub;
  let activatedRouteStub: Partial<ActivatedRoute>;

  beforeEach(waitForAsync(() => {
    routerStub = new RouterStub();
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);
    setLoadingSpy = loadingServiceSpy.setLoading.and.returnValue(null);
    const structureServiceSpy = jasmine.createSpyObj('StructureService', ['interpretStructure']);
    interpretStructureSpy = structureServiceSpy.interpretStructure.and.returnValue(asyncData(StructurePostResponseData));
    const gaServiceSpy = jasmine.createSpyObj('GoogleAnalyticsService', ['sendPageView', 'sendEvent']);
    const titleServiceSpy = jasmine.createSpyObj('Title', ['setTitle']);
    matDialog = new MatDialogStub();
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData', 'afterLoad']);
    configServiceSpy.afterLoad.and.returnValue(Promise.resolve(configServiceSpy.configData));
    activatedRouteStub = new ActivatedRouteStub(
      {
        'sequence': 'test_sequence_term',
        'type': 'test_type_term',
        'seq_type': 'test_seq_type_term',
        'cutoff': 'test_cutoff_term'
      }
    );

    TestBed.configureTestingModule({
      imports: [
        NameResolverModule,
        MatSelectModule,
        MatSliderModule,
        MatCardModule,
        HttpClientTestingModule,
        NoopAnimationsModule,
        MatFormFieldModule,
        MatButtonModule,
        ReactiveFormsModule
      ],
      declarations: [
        StructureSearchComponent,
        StructureEditorStubComponent
      ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: LoadingService, useValue: loadingServiceSpy },
        { provide: StructureService, useValue: structureServiceSpy },
        { provide: GoogleAnalyticsService, useValue: gaServiceSpy },
        { provide: Title, useValue: titleServiceSpy },
        { provide: MatDialog, useValue: matDialog },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        // real (root-provided) AuthService can get constructed transitively via
        // NameResolverModule's real module tree; its constructor does real async
        // HTTP work we don't want running in this test.
        { provide: AuthService, useValue: {} }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('on Init, loading should be set to true', () => {
    expect(setLoadingSpy).toHaveBeenCalledTimes(1);
    expect(setLoadingSpy.calls.mostRecent().args[0]).toBe(true);
  });

  describe('after editor load', () => {
    let editorStub: Editor;

    beforeEach(() => {
      editorStub = new EditorStub();
      component.editorOnLoad(editorStub);
      fixture.detectChanges();
    });

    it('on edtiroOnLoad, loading should be set to false and editor should be set', () => {
      expect(setLoadingSpy).toHaveBeenCalledTimes(2);
      expect(setLoadingSpy.calls.mostRecent().args[0]).toBe(false);
      expect(component._editor).toBe(editorStub);
    });

    it('on search button clicked, getMolFile, postSubtance, and navigate should be called', waitForAsync(() => {
      const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.search-button');
      searchButtonElement.click();
      fixture.detectChanges();
      expect(component._editor.getMolfile).toHaveBeenCalledTimes(1);
      expect(interpretStructureSpy).toHaveBeenCalled();
      expect(interpretStructureSpy.calls.mostRecent().args[0]).toBe(MolFile);
      fixture.whenStable().then(() => {
        // routerStub.navigate is a vi.fn() (RouterStub is a shared helper, converted for
        // other consumers' Vitest compatibility); use its own .mock API, not jasmine matchers.
        expect(routerStub.navigate.mock.calls.length > 0).toBe(true);
        const navigationExtras = routerStub.navigate.mock.lastCall[1];
        expect(navigationExtras.queryParams['structure_search']).toEqual(StructurePostResponseData.structure.id);
      });
    }));

    describe('search type selection', () => {
      let loader: HarnessLoader;
      let searchTypeSelect: MatSelectHarness;

      beforeEach(async () => {
        loader = TestbedHarnessEnvironment.loader(fixture);
        searchTypeSelect = await loader.getHarness(
          MatSelectHarness.with({ selector: '.search-type-select mat-select' })
        );
      });

      it('on search type select not equal similarity,' +
        ' component\'s searchType value should equal value selected and similarity cutoff should be hidden', async () => {
          await searchTypeSelect.clickOptions({ text: /Flex/ });
          fixture.detectChanges();
          expect(component._searchType).toEqual('flex');

          const similarityCutoffElement: HTMLElement = fixture.nativeElement.querySelector('.similarity-cutoff');
          expect(similarityCutoffElement).toBeFalsy();
        });

      it('on search type select equal similarity, similarityCutoff should equal 0.8 and similarity cut off should show', async () => {
          await searchTypeSelect.clickOptions({ text: /Similarity/ });
          fixture.detectChanges();
          expect(component.similarityCutoff).toEqual(0.8);

          const similarityCutoffElement: HTMLElement = fixture.nativeElement.querySelector('.similarity-cutoff');
          expect(similarityCutoffElement).toBeTruthy();
      });

    });

    it('on import button click, dialop.open should be called, and editor.setMolecule should be called after close', waitForAsync(() => {
      spyOn(matDialog, 'open').and.callThrough();
      // openStructureImportDialog() calls setMolecule on the @ViewChild(StructureEditorComponent)
      // instance, which the type-matched stub declared for this spec doesn't satisfy (it's a
      // different class), so the ViewChild query resolves to undefined; assign a spy directly,
      // same as editorOnLoad() above bypasses the real child to set component.editor.
      const structureEditorSpy = jasmine.createSpyObj('StructureEditorComponent', ['setMolecule']);
      component.structureEditor = structureEditorSpy;
      const importButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.import-button');
      importButtonElement.click();
      fixture.detectChanges();
      expect(matDialog.open).toHaveBeenCalledTimes(1);
      // openStructureImportDialog() reads structurePostResponse.structure.molfile.
      matDialog.closeDialogRef({ structure: { molfile: MolFile } });
      fixture.detectChanges();
      expect(structureEditorSpy.setMolecule).toHaveBeenCalled();
      expect(structureEditorSpy.setMolecule).toHaveBeenCalledWith(MolFile);
    }));
  });
});
