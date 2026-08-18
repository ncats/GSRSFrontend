import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { DomSanitizer } from '@angular/platform-browser';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { JsonDialogComponent } from './json-dialog.component';

describe('JsonDialogComponent', () => {
  let component: JsonDialogComponent;
  let fixture: ComponentFixture<JsonDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ JsonDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { cleanSubstance: () => ({}) } },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v, bypassSecurityTrustUrl: (v: any) => v, bypassSecurityTrustResourceUrl: (v: any) => v } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JsonDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
