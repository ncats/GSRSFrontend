import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceMixtureSourceComponent } from './substance-mixture-source.component';
import { RouterLinkDirectiveMock } from '../../../testing/router-link-mock.directive';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';

describe('SubstanceMixtureSourceComponent', () => {
  let component: SubstanceMixtureSourceComponent;
  let fixture: ComponentFixture<SubstanceMixtureSourceComponent>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        SubstanceMixtureSourceComponent,
        RouterLinkDirectiveMock
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceMixtureSourceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
