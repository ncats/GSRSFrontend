import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstancePolymerStructureComponent } from './substance-polymer-structure.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../../testing/utils-service-stub';
import { vi } from 'vitest';

describe('SubstancePolymerStructureComponent', () => {
  let component: SubstancePolymerStructureComponent;
  let fixture: ComponentFixture<SubstancePolymerStructureComponent>;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async () => {
    const configServiceSpy = { configData: vi.fn() };
    utilsServiceStub = new UtilsServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        SubstancePolymerStructureComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: UtilsService, useValue: utilsServiceStub }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstancePolymerStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
