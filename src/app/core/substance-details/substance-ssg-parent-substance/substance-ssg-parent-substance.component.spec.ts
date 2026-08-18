import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceSsgParentSubstanceComponent } from './substance-ssg-parent-substance.component';

describe('SubstanceSsgParentSubstanceComponent', () => {
  let component: SubstanceSsgParentSubstanceComponent;
  let fixture: ComponentFixture<SubstanceSsgParentSubstanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceSsgParentSubstanceComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSsgParentSubstanceComponent);
    component = fixture.componentInstance;
    component.substance = { specifiedSubstanceG3: {} } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
