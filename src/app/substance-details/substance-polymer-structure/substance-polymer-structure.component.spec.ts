import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstancePolymerStructureComponent } from './substance-polymer-structure.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';

describe('SubstancePolymerStructureComponent', () => {
  let component: SubstancePolymerStructureComponent;
  let fixture: ComponentFixture<SubstancePolymerStructureComponent>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        SubstancePolymerStructureComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstancePolymerStructureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
