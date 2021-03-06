import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SubstanceCodesComponent } from './substance-codes.component';
import { MatTableModule } from '@angular/material/table';
import { CdkTableModule } from '@angular/cdk/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTreeModule } from '@angular/material/tree';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconMock } from '../../../testing/mat-icon-mock.component';

describe('SubstanceCodesComponent', () => {
  let component: SubstanceCodesComponent;
  let fixture: ComponentFixture<SubstanceCodesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        CdkTableModule,
        MatPaginatorModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        MatTreeModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      declarations: [
        SubstanceCodesComponent,
        MatIconMock
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceCodesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
