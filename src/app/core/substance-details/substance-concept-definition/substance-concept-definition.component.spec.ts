import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceConceptDefinitionComponent } from './substance-concept-definition.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../testing/utils-service-stub';

describe('SubstanceConceptDefinitionComponent', () => {
  let component: SubstanceConceptDefinitionComponent;
  let fixture: ComponentFixture<SubstanceConceptDefinitionComponent>;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    utilsServiceStub = new UtilsServiceStub();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [
        SubstanceConceptDefinitionComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: UtilsService, useValue: UtilsServiceStub}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceConceptDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
