import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceRelationshipsComponent } from './substance-relationships.component';
import { MatTableModule } from '@angular/material/table';
import { ConfigService } from '../../config/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../testing/utils-service-stub';

describe('SubstanceRelationshipsComponent', () => {
  let component: SubstanceRelationshipsComponent;
  let fixture: ComponentFixture<SubstanceRelationshipsComponent>;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    utilsServiceStub = new UtilsServiceStub();

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        HttpClientTestingModule
      ],
      declarations: [
        SubstanceRelationshipsComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: UtilsService, useValue: utilsServiceStub }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceRelationshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
