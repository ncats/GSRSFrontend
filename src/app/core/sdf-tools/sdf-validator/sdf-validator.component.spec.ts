import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, PLATFORM_ID } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ConfigService } from '@gsrs-core/config';
import { SdfValidatorComponent } from './sdf-validator.component';
import { SDF_VALIDATOR_FILENAME } from '../sdf-tools.constants';

describe('SdfValidatorComponent', () => {
  let component: SdfValidatorComponent;
  let fixture: ComponentFixture<SdfValidatorComponent>;

  const configureWith = (baseHref: string, platformId: Object = 'browser') => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      declarations: [SdfValidatorComponent],
      providers: [
        {
          provide: ConfigService,
          useValue: { environment: { baseHref }, configData: {} }
        },
        { provide: PLATFORM_ID, useValue: platformId }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SdfValidatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  };

  beforeEach(waitForAsync(() => {
    configureWith('/ginas/app/beta/');
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build the validator url from the configured base href', () => {
    expect(component.validatorUrl).toBe(`/ginas/app/beta/assets/sdf-tools/${SDF_VALIDATOR_FILENAME}`);
  });

  it('should honour a different base href so the pfda sub-path deployment works', () => {
    configureWith('/ginas/app/ui/');
    expect(component.validatorUrl).toBe(`/ginas/app/ui/assets/sdf-tools/${SDF_VALIDATOR_FILENAME}`);
  });

  it('should fall back to root when no base href is configured', () => {
    configureWith(undefined);
    expect(component.validatorUrl).toBe(`/assets/sdf-tools/${SDF_VALIDATOR_FILENAME}`);
  });

  it('should expose a sanitized resource url for the iframe', () => {
    const sanitizer = TestBed.inject(DomSanitizer);
    expect(component.safeValidatorUrl).toBeTruthy();
    expect(sanitizer.sanitize(4 /* ResourceUrl */, component.safeValidatorUrl)).toBe(
      component.validatorUrl
    );
  });

  it('should not render the iframe on the server', () => {
    configureWith('/ginas/app/beta/', 'server');
    expect(component.isBrowser).toBe(false);
  });

  it('should sandbox the iframe without allow-same-origin', () => {
    const iframe: HTMLIFrameElement = fixture.nativeElement.querySelector('iframe');
    expect(iframe).toBeTruthy();

    const sandbox = iframe.getAttribute('sandbox');
    expect(sandbox).toContain('allow-scripts');
    expect(sandbox).toContain('allow-downloads');
    expect(sandbox).not.toContain('allow-same-origin');
  });
});
