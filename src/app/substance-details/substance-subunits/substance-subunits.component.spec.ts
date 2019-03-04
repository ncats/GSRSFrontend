import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceSubunitsComponent } from './substance-subunits.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { MatIconMock } from '../../../testing/mat-icon-mock.component';

describe('SubstanceSubunitsComponent', () => {
  let component: SubstanceSubunitsComponent;
  let fixture: ComponentFixture<SubstanceSubunitsComponent>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

    TestBed.configureTestingModule({
      imports: [
        MatTooltipModule,
        MatButtonToggleModule,
        HttpClientTestingModule
      ],
      declarations: [
        SubstanceSubunitsComponent,
        MatIconMock
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceSubunitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
