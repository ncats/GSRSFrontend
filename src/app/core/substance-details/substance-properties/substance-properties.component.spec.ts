import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstancePropertiesComponent } from './substance-properties.component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { RouterLinkDirectiveMock } from '../../../testing/router-link-mock.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../testing/utils-service-stub';

describe('SubstancePropertiesComponent', () => {
  let component: SubstancePropertiesComponent;
  let fixture: ComponentFixture<SubstancePropertiesComponent>;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    utilsServiceStub = new UtilsServiceStub();

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        CdkTableModule,
        HttpClientTestingModule
      ],
      declarations: [
        SubstancePropertiesComponent,
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
    fixture = TestBed.createComponent(SubstancePropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
