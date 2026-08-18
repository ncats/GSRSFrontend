import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubstanceFormMonomersCardComponent } from './substance-form-monomers-card.component';
import { SubstanceFormMonomersService } from './substance-form-monomers.service';
import { ScrollToService } from '../../scroll-to/scroll-to.service';
import { GoogleAnalyticsService } from '../../google-analytics/google-analytics.service';
import { MatIconModule } from '@angular/material/icon';
import { of } from 'rxjs';

describe('SubstanceFormMonomersCardComponent', () => {
  let component: SubstanceFormMonomersCardComponent;
  let fixture: ComponentFixture<SubstanceFormMonomersCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ MatIconModule ],
      declarations: [ SubstanceFormMonomersCardComponent ],
      providers: [
        // ngAfterViewInit subscribes to this directly, so it needs to actually emit.
        { provide: SubstanceFormMonomersService, useValue: { substanceMonomers: of([]) } },
        { provide: ScrollToService, useValue: {} },
        { provide: GoogleAnalyticsService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceFormMonomersCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
