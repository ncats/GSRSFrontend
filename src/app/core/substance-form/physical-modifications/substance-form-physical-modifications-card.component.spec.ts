import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NEVER } from 'rxjs';
import { SubstanceFormPhysicalModificationsService } from './substance-form-physical-modifications.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics';
import { SubstanceFormPhysicalModificationsCardComponent } from './substance-form-physical-modifications-card.component';

describe('SubstanceFormPhysicalModificationsCardComponent', () => {
  let component: SubstanceFormPhysicalModificationsCardComponent;
  let fixture: ComponentFixture<SubstanceFormPhysicalModificationsCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ SubstanceFormPhysicalModificationsCardComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormPhysicalModificationsService, useValue: { substancePhysicalModifications: NEVER } },
        { provide: ScrollToService, useValue: { scrollToElement: () => null } },
        { provide: GoogleAnalyticsService, useValue: { sendPageView: () => null, sendEvent: () => null, sendException: () => null } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormPhysicalModificationsCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
