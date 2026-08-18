import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { SubstanceFormService } from '@gsrs-core/substance-form/substance-form.service';
import { SubstanceService } from '@gsrs-core/substance';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingService } from '@gsrs-core/loading/index';
import { UtilsService } from '@gsrs-core/utils/index';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DefinitionSwitchDialogComponent } from './definition-switch-dialog.component';

describe('DefinitionSwitchDialogComponent', () => {
  let component: DefinitionSwitchDialogComponent;
  let fixture: ComponentFixture<DefinitionSwitchDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      declarations: [ DefinitionSwitchDialogComponent ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: SubstanceFormService, useValue: { getJson: () => ({ version: '1', relationships: [] }) } },
        { provide: SubstanceService, useValue: {} },
        { provide: DomSanitizer, useValue: { bypassSecurityTrustHtml: (v: any) => v, bypassSecurityTrustUrl: (v: any) => v, bypassSecurityTrustResourceUrl: (v: any) => v } },
        { provide: LoadingService, useValue: { setLoading: () => null, resetLoading: () => null } },
        { provide: UtilsService, useValue: { getBuildInfo: () => of({}), handleMatSidenavOpen: () => null, handleMatSidenavClose: () => null, newUUID: () => 'test-uuid' } },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinitionSwitchDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
