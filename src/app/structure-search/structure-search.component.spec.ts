import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StructureEditorModule } from '../structure-editor/structure-editor.module';
import { StructureSearchComponent } from './structure-search.component';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { MatCardModule } from '@angular/material/card';
import { RouterStub } from '../../testing/router-stub';
import { Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../config/config.service';
import { LoadingService } from '../loading/loading.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { EditorStub } from '../../testing/editor-stub';

describe('StructureSearchComponent', () => {
  let component: StructureSearchComponent;
  let fixture: ComponentFixture<StructureSearchComponent>;
  let routerStub: RouterStub;
  let setLoadingSpy: jasmine.Spy;

  beforeEach(async(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 1000000;
    routerStub = new RouterStub();
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    const loadingServiceSpy = jasmine.createSpyObj('LoadingService', ['setLoading']);
    setLoadingSpy = loadingServiceSpy.setLoading;

    TestBed.configureTestingModule({
      imports: [
        StructureEditorModule,
        MatSelectModule,
        MatSliderModule,
        MatCardModule,
        HttpClientTestingModule,
        BrowserAnimationsModule
      ],
      declarations: [
        StructureSearchComponent
      ],
      providers: [
        { provide: Router, useValue: routerStub },
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: LoadingService, useValue: loadingServiceSpy }
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
    expect(setLoadingSpy.arguments[0]).toEqual(true);
  });

  // it('on edtiroOnLoad, editor should be set and ')
});
