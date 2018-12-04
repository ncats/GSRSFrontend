import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { StructureEditorModule } from '../structure-editor/structure-editor.module';
import { StructureSearchComponent } from './structure-search.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule, MatSlider } from '@angular/material/slider';
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
import { StructurePostResponseData } from '../../testing/structure-post-reponse-test-data';
import { asyncData } from '../../testing/async-observable-helpers';
import { MolFile } from '../../testing/mol-file';
import { Editor } from '../structure-editor/structure.editor.model';
import { OverlayContainer } from '@angular/cdk/overlay';
import { TestGestureConfig } from '../../testing/test-gesture-config';
import { By, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';

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
    setLoadingSpy = loadingServiceSpy.setLoading.and.returnValue(null);
    const substanceServiceSpy = jasmine.createSpyObj('SubstanceService', ['postSubstance']);
    postSubstanceSpy = substanceServiceSpy.postSubstance.and.returnValue(asyncData(StructurePostResponseData));
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

    it('on search button clicked, getMolFile, postSubtance, and navigate should be called', async(() => {
      const searchButtonElement: HTMLButtonElement = fixture.nativeElement.querySelector('.search-button');
      searchButtonElement.click();
      fixture.detectChanges();
      expect(component._editor.getMolfile).toHaveBeenCalledTimes(1);
      expect(postSubstanceSpy).toHaveBeenCalled();
      expect(postSubstanceSpy.calls.mostRecent().args[0]).toBe(MolFile);
      fixture.whenStable().then(() => {
        expect(routerStub.navigate).toHaveBeenCalled();
        const navigationExtras = routerStub.navigate.calls.mostRecent().args[1];
        expect(navigationExtras.queryParams['structure_search_term']).toEqual(StructurePostResponseData.structure.id);
      });
    }));

    describe('search type selection', () => {
      let searchTypeContainerElement: HTMLElement;
      let searchTypeSelectTriggerElement: HTMLButtonElement;

      beforeEach(() => {
        searchTypeContainerElement = fixture.nativeElement.querySelector('.search-type-select');
        searchTypeSelectTriggerElement = searchTypeContainerElement.querySelector('.mat-select-trigger');
        searchTypeSelectTriggerElement.click();
        fixture.detectChanges();
      });

      it('on search type select not equal similarity,' +
        ' component\'s searchType value should equal value selected and similarity cutoff should be hidden', () => {
          inject([OverlayContainer], (oc: OverlayContainer) => {

            const overlayContainerElement = oc.getContainerElement();

            const flexOptionElement: HTMLButtonElement = overlayContainerElement.querySelector('mat-option[value="flex"]');
            flexOptionElement.click();
            fixture.detectChanges();
            expect(component._searchType).toEqual('flex');

            const similarityCutoffElement: HTMLElement = fixture.nativeElement.querySelector('.similarity-cutoff');
            expect(similarityCutoffElement).toBeFalsy();

          })();
        });

      it('on search type select equal similarity, similarityCutoff should equal 0.5 and similarity cut off should show', () => {
        inject([OverlayContainer], (oc: OverlayContainer) => {

          const overlayContainerElement = oc.getContainerElement();

          const flexOptionElement: HTMLButtonElement = overlayContainerElement.querySelector('mat-option[value="similarity"]');
          flexOptionElement.click();
          fixture.detectChanges();
          expect(component.similarityCutoff).toEqual(0.5);

          const similarityCutoffElement: HTMLElement = fixture.nativeElement.querySelector('.similarity-cutoff');
          expect(similarityCutoffElement).toBeTruthy();
        })();
      });

    });

    // https://github.com/angular/material2/blob/master/src/lib/slider/slider.spec.ts
    it('on similarity cutoff change, similarityCutoff should be set to value emitted by slider', () => {
      const gestureConfig = new TestGestureConfig();
      component.searchTypeSelected({ value: 'similarity' });
      fixture.detectChanges();
      const sliderNativeElement = fixture.nativeElement.querySelector('mat-slider');
      dispatchMouseenterEvent(sliderNativeElement);
      dispatchSlideEvent(sliderNativeElement, 0.7, gestureConfig);
      fixture.detectChanges();
      expect(component.similarityCutoff).toEqual(0.7);
    });
  });
});

function createMouseEvent(type: string, x = 0, y = 0, button = 0) {
  const event = document.createEvent('MouseEvent');

  event.initMouseEvent(type,
    true, /* canBubble */
    false, /* cancelable */
    window, /* view */
    0, /* detail */
    x, /* screenX */
    y, /* screenY */
    x, /* clientX */
    y, /* clientY */
    false, /* ctrlKey */
    false, /* altKey */
    false, /* shiftKey */
    false, /* metaKey */
    button, /* button */
    null /* relatedTarget */);

  // `initMouseEvent` doesn't allow us to pass the `buttons` and
  // defaults it to 0 which looks like a fake event.
  Object.defineProperty(event, 'buttons', { get: () => 1 });

  return event;
}

export function dispatchEvent(node: Node | Window, event: Event): Event {
  node.dispatchEvent(event);
  return event;
}

function dispatchMouseEvent(node: Node, type: string, x = 0, y = 0,
  event = createMouseEvent(type, x, y)): MouseEvent {
  return dispatchEvent(node, event) as MouseEvent;
}

function dispatchMouseenterEvent(element: HTMLElement): void {
  const dimensions = element.getBoundingClientRect();
  const y = dimensions.top;
  const x = dimensions.left;

  dispatchMouseEvent(element, 'mouseenter', x, y);
}

function dispatchSlideEvent(sliderElement: HTMLElement, percent: number,
  gestureConfig: TestGestureConfig): void {
  const trackElement = sliderElement.querySelector('.mat-slider-wrapper');
  const dimensions = trackElement.getBoundingClientRect();
  const x = dimensions.left + (dimensions.width * percent);
  const y = dimensions.top + (dimensions.height * percent);

  gestureConfig.emitEventForElement('slide', sliderElement, {
    center: { x: x, y: y },
    srcEvent: { preventDefault: jasmine.createSpy('preventDefault') }
  });
}
