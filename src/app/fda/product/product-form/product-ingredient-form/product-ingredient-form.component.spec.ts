import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { GeneralService } from '../../../service/general.service';
import { ProductService } from '../../service/product.service';
import { ControlledVocabularyService } from '@gsrs-core/controlled-vocabulary/controlled-vocabulary.service';
import { AuthService } from '@gsrs-core/auth/auth.service';
import { ConfigService } from '@gsrs-core/config/config.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { OverlayContainer } from '@angular/cdk/overlay';
import { SubstanceService } from '@gsrs-core/substance';
import { StructureService } from '@gsrs-core/structure';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { ScrollToService } from '@gsrs-core/scroll-to/scroll-to.service';
import { ProductIngredientFormComponent } from './product-ingredient-form.component';

describe('ProductIngredientFormComponent', () => {
  let component: ProductIngredientFormComponent;
  let fixture: ComponentFixture<ProductIngredientFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, ProductIngredientFormComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: GeneralService, useValue: {} },
        { provide: ProductService, useValue: {} },
        { provide: ControlledVocabularyService, useValue: { getDomainVocabulary: () => of(new Proxy({}, { get: () => ({ list: [], dictionary: {} }) })), getVocabularies: () => of({ content: [] }) } },
        { provide: AuthService, useValue: { getAuth: () => of(null), checkAuth: () => of(null), canEditData: () => Promise.resolve(false), hasSpecificPrivilege: () => Promise.resolve(false), getUser: () => null, logout: () => {} } },
        { provide: ConfigService, useValue: { configData: {}, environment: {}, afterLoad: () => Promise.resolve({}) } },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
        { provide: Router, useValue: { navigate: () => Promise.resolve(true) } },
        { provide: OverlayContainer, useValue: { getContainerElement: () => document.createElement('div') } },
        { provide: SubstanceService, useValue: {} },
        { provide: SubstanceFormService, useValue: { definition: of({}), getStoredRelated: () => null } },
        { provide: StructureService, useValue: {} },
        { provide: ScrollToService, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductIngredientFormComponent);
    component = fixture.componentInstance;
    component.ingredient = {} as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
