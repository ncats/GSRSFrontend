import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, NEVER } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { SubstanceService } from '@gsrs-core/substance/substance.service';
import { AuthService } from '@gsrs-core/auth';
import { PreviousReferencesDialogComponent } from './previous-references-dialog.component';

describe('PreviousReferencesDialogComponent', () => {
  let component: PreviousReferencesDialogComponent;
  let fixture: ComponentFixture<PreviousReferencesDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule, PreviousReferencesDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: MatDialogRef, useValue: { close: () => {}, afterClosed: () => of(null), backdropClick: () => NEVER, beforeClosed: () => NEVER } },
        { provide: SubstanceService, useValue: { getSubstanceReferences: () => NEVER } },
        { provide: AuthService, useValue: { getUser: () => null } },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PreviousReferencesDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
