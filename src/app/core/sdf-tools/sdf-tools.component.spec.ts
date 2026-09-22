import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { ConfigService } from '@gsrs-core/config';
import { SdfToolsComponent } from './sdf-tools.component';

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
    expect(component.selectedIndex).toBe(2);
  });

  it('should fall back to the first tab for an unknown tab name', () => {
    queryParamMap = of(makeParamMap('not-a-tab'));
    createComponent();
    expect(component.selectedIndex).toBe(0);
  });

  it('should write the active tab back to the query params', () => {
    createComponent();
    component.onTabChanged({ index: 1 } as any);

    expect(routerSpy.navigate).toHaveBeenCalled();
    const args = routerSpy.navigate.calls.mostRecent().args;
    expect(args[1].queryParams).toEqual({ tab: 'import' });
    expect(args[1].replaceUrl).toBe(true);
  });

  it('should not navigate for an out-of-range tab index', () => {
    createComponent();
    routerSpy.navigate.calls.reset();
    component.onTabChanged({ index: 99 } as any);
    expect(routerSpy.navigate).not.toHaveBeenCalled();
  });

  it('should read the pfda flag from config', () => {
    createComponent();
    expect(component.isPfdaVersion).toBe(true);
  });
});
