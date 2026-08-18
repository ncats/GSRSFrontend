import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { GoogleAnalyticsService } from '@gsrs-core/google-analytics/google-analytics.service';
import { ConfigService } from '@gsrs-core/config';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { ProductService } from '../service/product.service';

import { ProductTextSearchComponent } from './product-text-search.component';

describe('ProductTextSearchComponent', () => {
  let component: ProductTextSearchComponent;
  let fixture: ComponentFixture<ProductTextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductTextSearchComponent ],
      imports: [ MatAutocompleteModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ProductService, useValue: {} },
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: GoogleAnalyticsService, useValue: { sendEvent: () => null } },
        { provide: ConfigService, useValue: { configData: {}, environment: {} } },
        { provide: ControlledVocabularyService, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
