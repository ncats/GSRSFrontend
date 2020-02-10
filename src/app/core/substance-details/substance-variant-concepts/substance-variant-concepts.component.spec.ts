import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceVariantConceptsComponent } from './substance-variant-concepts.component';
import { RouterLinkDirectiveMock } from '../../../testing/router-link-mock.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../testing/utils-service-stub';

describe('SubstanceVariantConceptsComponent', () => {
  let component: SubstanceVariantConceptsComponent;
  let fixture: ComponentFixture<SubstanceVariantConceptsComponent>;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    utilsServiceStub = new UtilsServiceStub();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        SubstanceVariantConceptsComponent,
        RouterLinkDirectiveMock
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: UtilsService, useValue: utilsServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceVariantConceptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
