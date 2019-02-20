import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceMonomersComponent } from './substance-monomers.component';
import { MatInputModule, MatPaginatorModule, MatTableModule } from '@angular/material';
import { CdkTableModule } from '@angular/cdk/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SubstanceMonomersComponent', () => {
  let component: SubstanceMonomersComponent;
  let fixture: ComponentFixture<SubstanceMonomersComponent>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

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
        SubstanceMonomersComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy }
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
