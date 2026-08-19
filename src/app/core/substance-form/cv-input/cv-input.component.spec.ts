import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '@gsrs-core/utils';
import { OverlayContainer } from '@angular/cdk/overlay';
import { DataDictionaryService } from '@gsrs-core/utils/data-dictionary.service';
import { AuthService } from '@gsrs-core/auth';
import { ConfigService } from '@gsrs-core/config';
import { CvInputComponent } from './cv-input.component';

describe('CvInputComponent', () => {
  let component: CvInputComponent;
  let fixture: ComponentFixture<CvInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ CvInputComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of({ testDomain: { list: [] } }) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: DataDictionaryService, useValue: {} },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), hasPrivilege: () => false, getUser: () => null, logout: () => {} } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CvInputComponent);
    component = fixture.componentInstance;
    // no vocabulary/key set, so ngOnInit falls into the `else` branch, which reads
    // this.domain and calls getDomainVocabulary(this.domain) — needs a real value so the
    // stubbed response (keyed by domain name) can be looked up without throwing.
    component.domain = 'testDomain';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
