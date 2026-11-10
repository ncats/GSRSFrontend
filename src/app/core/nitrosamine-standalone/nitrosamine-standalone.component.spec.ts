import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { StructureService } from '@gsrs-core/structure';

import { NitrosamineStandaloneComponent } from './nitrosamine-standalone.component';
import { NitrosamineDisplayComponent } from './nitrosamine-display/nitrosamine-display.component';

// real <app-structure-editor> is backed by Ketcher/JSDraw, which don't exist in the
// Karma/jsdom test environment; stub its DOM surface instead of rendering the real thing.
@Component({
  selector: 'app-structure-editor',
  template: '',
  standalone: true
})
class StructureEditorStubComponent {}

describe('NitrosamineStandaloneComponent', () => {
  let component: NitrosamineStandaloneComponent;
  let fixture: ComponentFixture<NitrosamineStandaloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ NitrosamineStandaloneComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: StructureService, useValue: { smileObservable$: NEVER } }
      ]
    });

    // NitrosamineStandaloneComponent is standalone; its own @Component.imports (not
    // TestBed's) decide what <app-structure-editor> resolves to, so swap in the stub
    // via overrideComponent instead of declaring it at the TestBed level. The real
    // NitrosamineDisplayComponent is left in place - it's lightweight, just needs the
    // StructureService stub above.
    TestBed.overrideComponent(NitrosamineStandaloneComponent, {
      set: {
        imports: [
          MatCardModule,
          StructureEditorStubComponent,
          NitrosamineDisplayComponent
        ]
      }
    });

    await TestBed.compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NitrosamineStandaloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
