import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { SdfToolsComponent } from './sdf-tools.component';
import { SDF_IMPORT_ENABLED, SDF_TOOLS_TABS } from './sdf-tools.constants';

describe('SdfToolsComponent', () => {
  let component: SdfToolsComponent;
  let fixture: ComponentFixture<SdfToolsComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let queryParamMap: any;

  const makeParamMap = (tab?: string) => ({
    get: (key: string) => (key === 'tab' ? tab || null : null)
  });

  beforeEach(waitForAsync(() => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    queryParamMap = of(makeParamMap());

    TestBed.configureTestingModule({
      declarations: [SdfToolsComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: {
            get queryParamMap() {
              return queryParamMap;
            }
          }
        },
        { provide: ConfigService, useValue: { configData: { isPfdaVersion: true } } }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  }));

  const createComponent = () => {
    fixture = TestBed.createComponent(SdfToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  it('should create', () => {
    createComponent();
    expect(component).toBeTruthy();
  });

  it('should default to the validate tab when no tab query param is present', () => {
    createComponent();
    expect(component.selectedIndex).toBe(0);
  });

  it('should select the tab named in the query param', () => {
    queryParamMap = of(makeParamMap('guide'));
    createComponent();
    expect(component.selectedIndex).toBe(SDF_TOOLS_TABS.indexOf('guide'));
    expect(component.selectedIndex).toBeGreaterThan(0);
  });

  it('should fall back to the first tab for an unknown tab name', () => {
    queryParamMap = of(makeParamMap('not-a-tab'));
    createComponent();
    expect(component.selectedIndex).toBe(0);
  });

  it('should write the active tab back to the query params', () => {
    createComponent();
    component.onTabChanged({ index: SDF_TOOLS_TABS.indexOf('guide') } as any);

    expect(routerSpy.navigate).toHaveBeenCalled();
    const args = routerSpy.navigate.calls.mostRecent().args;
    expect(args[1].queryParams).toEqual({ tab: 'guide' });
    expect(args[1].replaceUrl).toBe(true);
  });

  it('should not navigate for an out-of-range tab index', () => {
    createComponent();
    routerSpy.navigate.calls.reset();
    component.onTabChanged({ index: 99 } as any);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should keep the import tab in sync with the SDF_IMPORT_ENABLED flag', () => {
    createComponent();
    expect(component.importEnabled).toBe(SDF_IMPORT_ENABLED);
    expect(SDF_TOOLS_TABS.includes('import')).toBe(SDF_IMPORT_ENABLED);
  });

  it('should fall back to the first tab when ?tab=import is requested while import is disabled', () => {
    if (SDF_IMPORT_ENABLED) {
      pending('Import tab is enabled');
      return;
    }
    queryParamMap = of(makeParamMap('import'));
    createComponent();
    expect(component.selectedIndex).toBe(0);
  });

  it('should render one mat-tab per entry in SDF_TOOLS_TABS', () => {
    createComponent();
    const tabs = fixture.nativeElement.querySelectorAll('mat-tab');
    expect(tabs.length).toBe(SDF_TOOLS_TABS.length);
  });

  it('should read the pfda flag from config', () => {
    createComponent();
    expect(component.isPfdaVersion).toBe(true);
  });
});
