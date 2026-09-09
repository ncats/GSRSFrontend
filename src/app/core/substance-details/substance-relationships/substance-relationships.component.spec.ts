import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubstanceRelationshipsComponent } from './substance-relationships.component';
import { MatTableModule } from '@angular/material/table';
import { ConfigService } from '../../config/config.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { UtilsService } from '../../utils/utils.service';
import { UtilsServiceStub } from '../../../../testing/utils-service-stub';
import { vi } from 'vitest';

describe('SubstanceRelationshipsComponent', () => {
  let component: SubstanceRelationshipsComponent;
  let fixture: ComponentFixture<SubstanceRelationshipsComponent>;
  let utilsServiceStub: UtilsServiceStub;

  beforeEach(async () => {
    // real (standalone) ReferencesManagerComponent/RelationshipsDownloadButtonComponent now
    // render for real via this component's own template; their transitive constructors reach
    // the real, root-provided AuthService, whose own constructor calls configService.afterLoad().
    const configServiceSpy = { configData: vi.fn(), afterLoad: () => Promise.resolve({}) };
    utilsServiceStub = new UtilsServiceStub();

    await TestBed.configureTestingModule({
      imports: [
        MatTableModule,
        HttpClientTestingModule,
        SubstanceRelationshipsComponent
      ],
      schemas: [ NO_ERRORS_SCHEMA ],
      providers: [
        { provide: ConfigService, useValue: configServiceSpy },
        { provide: UtilsService, useValue: utilsServiceStub },
        { provide: ActivatedRoute, useValue: { snapshot: { paramMap: { get: () => null }, queryParamMap: { get: () => null } } } }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SubstanceRelationshipsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
