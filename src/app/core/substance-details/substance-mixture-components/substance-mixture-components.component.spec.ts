import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceMixtureComponentsComponent } from './substance-mixture-components.component';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { RouterLinkDirectiveMock } from '../../../testing/router-link-mock.directive';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../testing/utils-service-stub';

describe('SubstanceMixtureComponentsComponent', () => {
  let component: SubstanceMixtureComponentsComponent;
  let fixture: ComponentFixture<SubstanceMixtureComponentsComponent>;
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
        SubstanceMixtureComponentsComponent,
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
    fixture = TestBed.createComponent(SubstanceMixtureComponentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
