import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureEditorComponent } from './structure-editor.component';
import { KetcherWrapperModule } from 'ketcher-wrapper';
import { JsdrawWrapperModule } from 'jsdraw-wrapper';
import { environment } from '../../environments/environment';

describe('StructureEditorComponent', () => {
  let component: StructureEditorComponent;
  let fixture: ComponentFixture<StructureEditorComponent>;

  beforeEach(async(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;

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

  it('OnInit, if jsdraw environment,inline css should be set up,' +
  ' scripts should be added, jsdraw element should be in view, ketcher element should not be in view', () => {

    environment.structureEditor = 'jsdraw';

    fixture = TestBed.createComponent(StructureEditorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const scriptElements = document.querySelector('head').querySelectorAll('[type="text/javascript"]');

    component._jsdrawScriptUrls.forEach(url => {
      let isScriptAdded = false;
      Array.from(scriptElements).forEach((element: HTMLScriptElement) => {
        if (element.src.indexOf(url) > -1) {
          isScriptAdded = true;
        }
      });
      expect(isScriptAdded).toBe(true, 'script should have been added');
    });

    const jsdrawAddedStyle = '<style type="text/css">input._scil_dropdown::-ms-clear {display: none;}</style>';

    document.write(jsdrawAddedStyle);

    const styleElements = document.querySelector('head').querySelectorAll('[type="text/css"');

    let isStyleAdded = false;

    Array.from(styleElements).forEach((element: HTMLStyleElement) => {
      if (element.innerHTML === 'input._scil_dropdown::-ms-clear {display: none;}') {
        isStyleAdded = true;
      }
    });

    expect(isStyleAdded).toBe(true, 'style should have been added');

    const jsdrawElement = fixture.nativeElement.querySelector('ncats-jsdraw-wrapper');

    expect(jsdrawElement).toBeTruthy('jsdraw element should be added to view');

    const ketcherElement = fixture.nativeElement.querySelector('ncats-ketcher-wrapper');

    expect(ketcherElement).toBeFalsy('ketcher element should be removed to view');

  });

  it('OnInit, if ketcher environment,' +
  ' jsdraw element should be removed from view, ketcher element should be in view', () => {

    environment.structureEditor = 'ketcher';

    fixture = TestBed.createComponent(StructureEditorComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();

    const jsdrawElement = fixture.nativeElement.querySelector('ncats-jsdraw-wrapper');

    expect(jsdrawElement).toBeFalsy('jsdraw element should be removed to view');

    const ketcherElement = fixture.nativeElement.querySelector('ncats-ketcher-wrapper');

    expect(ketcherElement).toBeTruthy('ketcher element should be added to view');

  });

  describe('on editor load', () => {

    beforeEach(() => {
      environment.structureEditor = 'ketcher';
      fixture = TestBed.createComponent(StructureEditorComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
    });

    it('should emit event', async(() => {
      spyOn(component, 'ketcherOnLoad');
      fixture.detectChanges();
      expect(component.ketcherOnLoad).toHaveBeenCalled();
    }));

  });
});
