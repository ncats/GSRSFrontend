import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstancePropertiesComponent } from './substance-properties.component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { RouterLinkDirectiveMock } from '../../../testing/router-link-mock.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';

describe('SubstancePropertiesComponent', () => {
  let component: SubstancePropertiesComponent;
  let fixture: ComponentFixture<SubstancePropertiesComponent>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

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
        { provide: ConfigService, useValue: configServiceSpy }
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
