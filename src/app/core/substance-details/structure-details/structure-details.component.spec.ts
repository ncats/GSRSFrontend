import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { StructureDetailsComponent } from './structure-details.component';
import { ConfigService } from '../../config/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../testing/utils-service-stub';

describe('StructureDetailsComponent', () => {
  let component: StructureDetailsComponent;
  let fixture: ComponentFixture<StructureDetailsComponent>;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    utilsServiceStub = new UtilsServiceStub();

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        StructureDetailsComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: UtilsService, useValue: utilsServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StructureDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
