import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ProductService } from '../../service/product.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatDialog } from '@angular/material/dialog';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Router } from '@angular/router';
import { SubstanceService } from '@gsrs-core/substance';
import { StructureService } from '@gsrs-core/structure';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { UtilsService } from '@gsrs-core/utils';
import { DataDictionaryService } from '@gsrs-core/utils/data-dictionary.service';
import { ConfigService } from '@gsrs-core/config';
import { ProductLotFormComponent } from './product-lot-form.component';

describe('ProductLotFormComponent', () => {
  let component: ProductLotFormComponent;
  let fixture: ComponentFixture<ProductLotFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, ProductLotFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ProductService, useValue: {} },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), getUser: () => null, logout: () => {} } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        provideNativeDateAdapter(),
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: SubstanceService, useValue: {} },
        { provide: StructureService, useValue: {} },
        { provide: SubstanceFormService, useValue: { definition: of({}) } },
        { provide: ScrollToService, useValue: {} },
        { provide: UtilsService, useValue: {} },
        { provide: DataDictionaryService, useValue: { getDictionaryRow: () => ({}) } },
        { provide: ConfigService, useValue: { configData: {} } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductLotFormComponent);
    component = fixture.componentInstance;
    component.productLot = { productIngredients: [] } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
