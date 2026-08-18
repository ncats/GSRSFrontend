import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AdverseEventService } from '../service/adverseevent.service';
import { FacetsManagerService } from '@gsrs-core/facets-manager';
import { AdverseEventsBrowseComponent } from './adverse-events-browse.component';

describe('AdverseEventsBrowseComponent', () => {
  let component: AdverseEventsBrowseComponent;
  let fixture: ComponentFixture<AdverseEventsBrowseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ AdverseEventsBrowseComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AdverseEventService, useValue: {} },
        { provide: FacetsManagerService, useValue: { registerGetFacetsHandler: () => {}, unregisterFacetSearchHandler: () => {}, getFacetParams: () => ({}), clearSelections: () => {} } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdverseEventsBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
