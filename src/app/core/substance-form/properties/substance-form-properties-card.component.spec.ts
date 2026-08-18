import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormPropertiesCardComponent } from './substance-form-properties-card.component';
import { SubstanceFormPropertiesService } from './substance-form-properties.service';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { of } from 'rxjs';

describe('SubstanceFormPropertiesCardComponent', () => {
  let component: SubstanceFormPropertiesCardComponent;
  let fixture: ComponentFixture<SubstanceFormPropertiesCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SubstanceFormPropertiesCardComponent ],
      providers: [
        // ngAfterViewInit subscribes to this directly, so it needs to actually emit.
        { provide: SubstanceFormPropertiesService, useValue: { substanceProperties: of([]) } },
        { provide: ScrollToService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormPropertiesCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
