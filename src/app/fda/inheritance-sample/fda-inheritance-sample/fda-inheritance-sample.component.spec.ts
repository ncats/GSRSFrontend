import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FdaInheritanceSampleComponent } from './fda-inheritance-sample.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';

describe('FdaInheritanceSampleComponent', () => {
  let component: FdaInheritanceSampleComponent;
  let fixture: ComponentFixture<FdaInheritanceSampleComponent>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [
        FdaInheritanceSampleComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FdaInheritanceSampleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
