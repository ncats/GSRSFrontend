import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceModificationsComponent } from './substance-modifications.component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';

describe('SubstanceModificationsComponent', () => {
  let component: SubstanceModificationsComponent;
  let fixture: ComponentFixture<SubstanceModificationsComponent>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        CdkTableModule,
        HttpClientTestingModule
      ],
      declarations: [
        SubstanceModificationsComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceModificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
