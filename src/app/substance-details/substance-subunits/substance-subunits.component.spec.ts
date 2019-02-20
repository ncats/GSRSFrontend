import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceSubunitsComponent } from './substance-subunits.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';

describe('SubstanceSubunitsComponent', () => {
  let component: SubstanceSubunitsComponent;
  let fixture: ComponentFixture<SubstanceSubunitsComponent>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

    TestBed.configureTestingModule({
      imports: [
        MatTooltipModule,
        MatButtonToggleModule,
        MatIconModule,
        HttpClientTestingModule
      ],
      declarations: [
        SubstanceSubunitsComponent
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
