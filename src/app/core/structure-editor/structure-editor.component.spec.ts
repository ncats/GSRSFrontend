import { of } from 'rxjs';
import { EditorImplementation } from './structure-editor-implementation.model';
import {
  resolveStructureEditorPreference,
  StructureEditorComponent,
} from './structure-editor.component';

/*import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditorImplementation } from './structure-editor-implementation.model';
import { StructureEditorComponent } from './structure-editor.component';
import { KetcherWrapperModule, Ketcher } from 'ketcher-wrapper';
import { JsdrawWrapperModule } from 'jsdraw-wrapper';
import { environment } from '../../environments/environment';
import { JSDraw, JSDrawOptions } from 'jsdraw-wrapper';*/

describe('StructureEditorComponent', () => {
  it('restores JSDraw when it was the last enabled editor used', () => {
    expect(resolveStructureEditorPreference('jsdraw', 'ketcher', true, true)).toBe('jsdraw');
  });

  it('restores Ketcher when it was the last enabled editor used', () => {
    expect(resolveStructureEditorPreference('ketcher', 'jsdraw', true, true)).toBe('ketcher');
  });

  it('does not restore a disabled editor', () => {
    expect(resolveStructureEditorPreference('jsdraw', 'jsdraw', false, true)).toBe('ketcher');
    expect(resolveStructureEditorPreference('ketcher', 'ketcher', true, false)).toBe('jsdraw');
  });

  it('loads the current JSDraw molfile after Ketcher is visible', () => {
    const component = Object.create(StructureEditorComponent.prototype) as StructureEditorComponent;
    const currentMolfile = 'blank JSDraw molfile';
    const destinationEditor = {
      setMolecule: jasmine.createSpy('setMolecule'),
    };
    const sourceEditor = {
      getMolfile: () => of(currentMolfile),
    };

    component.structureEditor = 'jsdraw';
    component.editor = sourceEditor as any;
    component.ketcherLoaded = true;
    (component as any).ketcher = {};
    (component as any).jsdraw = { activated: true };
    component.editorOnLoad = { emit: jasmine.createSpy('editorOnLoad') } as any;
    component.editorSwitched = { emit: jasmine.createSpy('editorSwitched') } as any;
    spyOn(component, 'getSketcher').and.returnValue((component as any).jsdraw);
    spyOn(EditorImplementation.prototype, 'setMolecule').and.callFake(
      destinationEditor.setMolecule,
    );
    spyOn(document, 'getElementById').and.returnValue({ style: {} } as HTMLElement);
    const animationFrame = spyOn(window, 'requestAnimationFrame').and.callFake(() => 1);

    component.toggleEditor();

    expect(component.structureEditor).toBe('ketcher');
    expect(destinationEditor.setMolecule).not.toHaveBeenCalled();

    animationFrame.calls.mostRecent().args[0](0);

    expect(destinationEditor.setMolecule).toHaveBeenCalledWith(currentMolfile);
    expect(component.editorOnLoad.emit).toHaveBeenCalled();
  });

  it('loads and activates JSDraw after it is visible', () => {
    const component = Object.create(StructureEditorComponent.prototype) as StructureEditorComponent;
    const currentMolfile = 'Ketcher molfile';
    const normalizedMolfile = 'normalized JSDraw molfile';
    const destinationEditor = {
      setMolecule: jasmine.createSpy('setMolecule'),
    };

    component.structureEditor = 'ketcher';
    component.editor = { getMolfile: () => of(currentMolfile) } as any;
    (component as any).jsdraw = { activated: false };
    (component as any).structureService = {
      interpretStructure: jasmine.createSpy('interpretStructure').and.returnValue(of({
        structure: { molfile: normalizedMolfile },
      })),
    };
    component.editorOnLoad = { emit: jasmine.createSpy('editorOnLoad') } as any;
    component.editorSwitched = { emit: jasmine.createSpy('editorSwitched') } as any;
    spyOn(component, 'getSketcher').and.returnValue((component as any).jsdraw);
    spyOn(EditorImplementation.prototype, 'setMolecule').and.callFake(
      destinationEditor.setMolecule,
    );
    spyOn(document, 'getElementById').and.returnValue({ style: {} } as HTMLElement);
    const animationFrame = spyOn(window, 'requestAnimationFrame').and.callFake(() => 1);

    component.toggleEditor();

    expect(component.structureEditor).toBe('jsdraw');
    expect((component as any).jsdraw.activated).toBe(false);
    expect(destinationEditor.setMolecule).not.toHaveBeenCalled();

    animationFrame.calls.mostRecent().args[0](0);

    expect(destinationEditor.setMolecule).toHaveBeenCalledWith(normalizedMolfile);
    expect((component as any).jsdraw.activated).toBe(true);
    expect(component.editorOnLoad.emit).toHaveBeenCalled();
  });

/*  let component: StructureEditorComponent;
  let fixture: ComponentFixture<StructureEditorComponent>;

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      imports: [
        KetcherWrapperModule,
        JsdrawWrapperModule
      ],
      declarations: [
        StructureEditorComponent
      ]
    })
    .compileComponents();
  }));

  it('should create', () => {
    fixture = TestBed.createComponent(StructureEditorComponent);
    component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });

  // it('OnInit, if jsdraw environment,inline css should be set up,' +
  // ' scripts should be added, jsdraw element should be in view, ketcher element should not be in view,' +
  // ' event should be emmited when jsDrawOnLoad called', () => {

  //   environment.structureEditor = 'jsdraw';

  //   fixture = TestBed.createComponent(StructureEditorComponent);
  //   component = fixture.componentInstance;

  //   fixture.detectChanges();

  //   const scriptElements = document.querySelector('head').querySelectorAll('[type="text/javascript"]');

  //   component._jsdrawScriptUrls.forEach(url => {
  //     let isScriptAdded = false;
  //     Array.from(scriptElements).forEach((element: HTMLScriptElement) => {
  //       if (element.src.indexOf(url) > -1) {
  //         isScriptAdded = true;
  //       }
  //     });
  //     expect(isScriptAdded).toBe(true, 'script should have been added');
  //   });

  //   const jsdrawAddedStyle = '<style type="text/css">input._scil_dropdown::-ms-clear {display: none;}</style>';

  //   document.write(jsdrawAddedStyle);

  //   const styleElements = document.querySelector('head').querySelectorAll('[type="text/css"');

  //   let isStyleAdded = false;

  //   Array.from(styleElements).forEach((element: HTMLStyleElement) => {
  //     if (element.innerHTML === 'input._scil_dropdown::-ms-clear {display: none;}') {
  //       isStyleAdded = true;
  //     }
  //   });

  //   expect(isStyleAdded).toBe(true, 'style should have been added');

  //   const jsdrawElement = fixture.nativeElement.querySelector('ncats-jsdraw-wrapper');

  //   expect(jsdrawElement).toBeTruthy('jsdraw element should be added to view');

  //   const ketcherElement = fixture.nativeElement.querySelector('ncats-ketcher-wrapper');

  //   expect(ketcherElement).toBeFalsy('ketcher element should be removed to view');

  //   const jsdrawObject: JSDraw = {
  //     options: {},
  //     setMolfile(molfile: string) {},
  //     getMolfile() { return ''; },
  //     getXml() { return ''; }
  //   };

  //   component.editorOnLoad.subscribe(jsdraw => {
  //     expect(jsdraw instanceof EditorImplementation).toBe(true, 'should emit instance of EditorImplementation');
  //   });

  //   component.jsDrawOnLoad(jsdrawObject);

  // });

  it('OnInit, if ketcher environment,' +
    ' jsdraw element should be removed from view, ketcher element should be in view,' +
    ' event should be emmited when ketcherOnLoad called', () => {

    environment.structureEditor = 'ketcher';

    fixture = TestBed.createComponent(StructureEditorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const jsdrawElement = fixture.nativeElement.querySelector('ncats-jsdraw-wrapper');

    expect(jsdrawElement).toBeFalsy('jsdraw element should be removed to view');

    const ketcherElement = fixture.nativeElement.querySelector('ncats-ketcher-wrapper');

    expect(ketcherElement).toBeTruthy('ketcher element should be added to view');

    const ketcherObject: Ketcher = {
      version: '',
      apiPath: '',
      buildDate: '',
      getSmiles() { return ''; },
      saveSmiles() { return null; },
      getMolfile() { return ''; },
      setMolecule(molString: any) {},
      addFragment(molString: any) {},
      showMolfile(clientArea: any, molString: any, options: any) {}
    };

    component.editorOnLoad.subscribe(ketcher => {
      expect(ketcher instanceof EditorImplementation).toBe(true, 'should emit instance of EditorImplementation');
    });

    component.ketcherOnLoad(ketcherObject);

  });*/
});

