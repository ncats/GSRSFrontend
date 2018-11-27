import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StructureEditorComponent } from './structure-editor.component';
import { KetcherWrapperModule } from 'ketcher-wrapper';
import { JsdrawWrapperModule } from 'jsdraw-wrapper';
import { environment } from '../../environments/environment';

describe('StructureEditorComponent', () => {
  let component: StructureEditorComponent;
  let fixture: ComponentFixture<StructureEditorComponent>;
  let documentCreateElementSpy: jasmine.Spy;

  beforeEach(async(() => {
    const documentSpy = jasmine.createSpyObj('document', ['createElement']);
    const styleElement = document.createElement('style');
    documentCreateElementSpy = documentSpy.createElement.and.returnValue(styleElement);

    spyOn(document, 'createElement');
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

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('OnInit, if jsdraw environment inline css should be set up and scripts should be added', () => {

    environment.structureEditor = 'jsdraw';

    fixture.detectChanges();

    expect(document.createElement).toHaveBeenCalledWith('script', 'should have been called');

  });
});
