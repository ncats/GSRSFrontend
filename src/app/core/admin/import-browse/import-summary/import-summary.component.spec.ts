import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NEVER } from 'rxjs';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatMenuModule } from '@angular/material/menu';
import { OverlayContainer } from '@angular/cdk/overlay';
import { UtilsService } from '@gsrs-core/utils';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { AuthService } from '@gsrs-core/auth';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { StructureService } from '@gsrs-core/structure';
import { ConfigService } from '@gsrs-core/config';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { LoadingService } from '@gsrs-core/loading';
import { DYNAMIC_COMPONENT_MANIFESTS } from '@gsrs-core/dynamic-component-loader';
import { TakePipe } from '@gsrs-core/utils/take.pipe';

import { ImportSummaryComponent } from './import-summary.component';

describe('ImportSummaryComponent', () => {
  let component: ImportSummaryComponent;
  let fixture: ComponentFixture<ImportSummaryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportSummaryComponent, TakePipe ],
      imports: [ MatMenuModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: UtilsService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: AuthService, useValue: { hasSpecificPrivilege: () => Promise.resolve(false) } },
        { provide: SubstanceService, useValue: { getSubstanceSummary: () => NEVER } },
        { provide: StructureService, useValue: { formatFormula: () => '', interpretStructure: () => NEVER } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => NEVER }) } },
        { provide: AdminService, useValue: { GetStagedRecord: () => NEVER } },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: DYNAMIC_COMPONENT_MANIFESTS, useValue: [] }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSummaryComponent);
    component = fixture.componentInstance;
    component.substance = { matchedRecords: [], codes: [], _metadata: { importStatus: 'PENDING' } };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
