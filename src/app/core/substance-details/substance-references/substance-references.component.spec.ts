import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { UtilsService } from '@gsrs-core/utils';
import { ConfigService } from '@gsrs-core/config';
import { SubstanceReferencesComponent } from './substance-references.component';

describe('SubstanceReferencesComponent', () => {
  let component: SubstanceReferencesComponent;
  let fixture: ComponentFixture<SubstanceReferencesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceReferencesComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceReferencesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
