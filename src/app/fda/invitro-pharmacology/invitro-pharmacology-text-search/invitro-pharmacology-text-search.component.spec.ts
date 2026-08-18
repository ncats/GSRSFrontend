import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA, ElementRef } from '@angular/core';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ConfigService } from '@gsrs-core/config';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary';
import { InvitroPharmacologyService } from '../service/invitro-pharmacology.service';

import { InvitroPharmacologyTextSearchComponent } from './invitro-pharmacology-text-search.component';

describe('InvitroPharmacologyTextSearchComponent', () => {
  let component: InvitroPharmacologyTextSearchComponent;
  let fixture: ComponentFixture<InvitroPharmacologyTextSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InvitroPharmacologyTextSearchComponent ],
      imports: [ MatAutocompleteModule ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ElementRef, useValue: { nativeElement: document.createElement('div') } },
        { provide: ConfigService, useValue: { configData: {}, environment: {} } },
        { provide: ControlledVocabularyService, useValue: {} },
        { provide: InvitroPharmacologyService, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InvitroPharmacologyTextSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
