import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceMixtureSourceComponent } from './substance-mixture-source.component';
import { RouterLinkDirectiveMock } from '../../../../testing/router-link-mock.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../../testing/utils-service-stub';
import { vi } from 'vitest';

describe('SubstanceMixtureSourceComponent', () => {
  let component: SubstanceMixtureSourceComponent;
  let fixture: ComponentFixture<SubstanceMixtureSourceComponent>;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async () => {
    const configServiceSpy = { configData: vi.fn() };
    utilsServiceStub = new UtilsServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        SubstanceMixtureSourceComponent,
        RouterLinkDirectiveMock
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: UtilsService, useValue: utilsServiceStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceMixtureSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
