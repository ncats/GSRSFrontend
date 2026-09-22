import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConfigService } from '@gsrs-core/config';
import { SdfGuideComponent } from './sdf-guide.component';
import {
  SDF_QUICK_GUIDE_FILENAME,
  SDF_RECOMMENDED_HEADERS,
  SDF_SAMPLE_FILENAME
} from '../sdf-tools.constants';

describe('SdfGuideComponent', () => {
  let component: SdfGuideComponent;
  let fixture: ComponentFixture<SdfGuideComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [SdfGuideComponent],
      providers: [
        {
          provide: ConfigService,
          useValue: { environment: { baseHref: '/ginas/app/beta/' }, configData: {} }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SdfGuideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should build the quick guide url from the base href', () => {
    expect(component.quickGuideUrl).toBe(
      `/ginas/app/beta/assets/sdf-tools/${SDF_QUICK_GUIDE_FILENAME}`
    );
  });

  it('should build the sample file url from the base href', () => {
    expect(component.sampleFileUrl).toBe(
      `/ginas/app/beta/assets/sdf-tools/${SDF_SAMPLE_FILENAME}`
    );
  });

  it('should expose the recommended headers from the quick guide', () => {
    expect(component.recommendedHeaders).toBe(SDF_RECOMMENDED_HEADERS);
    expect(component.recommendedHeaders.map(item => item.header)).toContain('UNII');
  });

  it('should expose the FDA support contacts', () => {
    expect(component.supportContacts.length).toBeGreaterThan(0);
    expect(component.supportContacts[0].email).toContain('@fda.hhs.gov');
  });
});
