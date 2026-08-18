import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { AdminService } from '@gsrs-core/admin/admin.service';
import { LoadingService } from '@gsrs-core/loading';
import { AllFilesComponent } from './all-files.component';

describe('AllFilesComponent', () => {
  let component: AllFilesComponent;
  let fixture: ComponentFixture<AllFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ AllFilesComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: AdminService, useValue: { getFiles: () => of([]) } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AllFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
