import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceVariantConceptsComponent } from './substance-variant-concepts.component';
import { RouterLinkDirectiveStub } from '../../../testing/router-link-directive-stub';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';

describe('SubstanceVariantConceptsComponent', () => {
  let component: SubstanceVariantConceptsComponent;
  let fixture: ComponentFixture<SubstanceVariantConceptsComponent>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

    TestBed.configureTestingModule({
      declarations: [
        SubstanceVariantConceptsComponent,
        RouterLinkDirectiveStub,
        HttpClientTestingModule
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceVariantConceptsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
