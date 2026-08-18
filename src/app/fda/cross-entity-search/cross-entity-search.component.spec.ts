import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ConfigService } from '@gsrs-core/config';
import { LoadingService } from '@gsrs-core/loading';
import { MainNotificationService } from '@gsrs-core/main-notification';
import { UtilsService } from '@gsrs-core/utils';
import { AuthService } from '@gsrs-core/auth';
import { OverlayContainer } from '@angular/cdk/overlay';
import { BulkSearchService } from '@gsrs-core/bulk-search/service/bulk-search.service';
import { SubstanceService } from '@gsrs-core/substance';
import { GeneralService } from '../../fda/service/general.service';
import { ProductService } from '../../fda/product/service/product.service';
import { ApplicationService } from '../../fda/application/service/application.service';
import { CrossEntitySearchService } from '../cross-entity-search/cross-entity-search.service';

import { CrossEntitySearchComponent } from './cross-entity-search.component';

describe('CrossEntitySearchComponent', () => {
  let component: CrossEntitySearchComponent;
  let fixture: ComponentFixture<CrossEntitySearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrossEntitySearchComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialog, useValue: {} },
        { provide: ActivatedRoute, useValue: { snapshot: { params: {}, queryParams: {} } } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: Location, useValue: {} },
        { provide: ConfigService, useValue: { configData: {} } },
        { provide: LoadingService, useValue: { setLoading: () => null } },
        { provide: MainNotificationService, useValue: { setNotification: () => null } },
        { provide: UtilsService, useValue: {} },
        { provide: AuthService, useValue: {} },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: BulkSearchService, useValue: {} },
        { provide: SubstanceService, useValue: {} },
        { provide: GeneralService, useValue: {} },
        { provide: ProductService, useValue: {} },
        { provide: ApplicationService, useValue: {} },
        { provide: CrossEntitySearchService, useValue: {} }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrossEntitySearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
