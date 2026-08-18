import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceClinicalTrialsEuropeComponent } from './substance-clinical-trials-eu.component';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { ClinicalTrialService } from '../../../clinical-trials/clinical-trial/clinical-trial.service';
import { ConfigService } from '@gsrs-core/config';
import { AuthService } from '@gsrs-core/auth';
import { LoadingService } from '@gsrs-core/loading/loading.service';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

describe('SubstanceClinicalTrialsEuropeComponent', () => {
  let component: SubstanceClinicalTrialsEuropeComponent;
  let fixture: ComponentFixture<SubstanceClinicalTrialsEuropeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceClinicalTrialsEuropeComponent ],
      providers: [
        { provide: GoogleAnalyticsService, useValue: {} },
        { provide: ClinicalTrialService, useValue: {} },
        // ngOnInit reads configService.configData.loadedComponents directly.
        { provide: ConfigService, useValue: { configData: { loadedComponents: null } } },
        // ngOnInit awaits this.
        { provide: AuthService, useValue: { hasSpecificPrivilege: () => Promise.resolve(false) } },
        { provide: LoadingService, useValue: {} },
        { provide: Router, useValue: {} },
        { provide: MatDialog, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceClinicalTrialsEuropeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
