import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { SubstanceNamesComponent } from './substance-names.component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SubstanceNamesComponent', () => {
  let component: SubstanceNamesComponent;
  let fixture: ComponentFixture<SubstanceNamesComponent>;

  beforeEach(async () => {
    const configServiceSpy = { configData: {} };

    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        CdkTableModule,
        MatPaginatorModule,
        MatInputModule,
        MatRadioModule,
        MatSelectModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      declarations: [
        SubstanceNamesComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
