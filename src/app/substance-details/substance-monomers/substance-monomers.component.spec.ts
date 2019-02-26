import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceMonomersComponent } from './substance-monomers.component';
import { MatInputModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterLinkDirectiveMock } from '../../../testing/router-link-mock.directive';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../testing/utils-service-stub';

describe('SubstanceMonomersComponent', () => {
  let component: SubstanceMonomersComponent;
  let fixture: ComponentFixture<SubstanceMonomersComponent>;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);
    utilsServiceStub = new UtilsServiceStub();

    TestBed.configureTestingModule({
      imports: [
        MatInputModule,
        MatPaginatorModule,
        MatTableModule,
        CdkTableModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      declarations: [
        SubstanceMonomersComponent,
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
    fixture = TestBed.createComponent(SubstanceMonomersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
