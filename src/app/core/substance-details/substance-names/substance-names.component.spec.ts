import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceNamesComponent } from './substance-names.component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ConfigService } from '../../config/config.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('SubstanceNamesComponent', () => {
  let component: SubstanceNamesComponent;
  let fixture: ComponentFixture<SubstanceNamesComponent>;

  beforeEach(async(() => {
    const configServiceSpy = jasmine.createSpyObj('ConfigService', ['configData']);

    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        CdkTableModule,
        MatPaginatorModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      declarations: [
        SubstanceNamesComponent
      ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceNamesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
